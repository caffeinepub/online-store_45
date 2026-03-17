import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Prim "mo:prim";
import AccessControl "./authorization/access-control";
import Stripe "./stripe/stripe";
import OutCall "./http-outcalls/outcall";

actor {
  // ---- Authorization ----
  let _accessControlState = AccessControl.initState();

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) { Runtime.trap("CAFFEINE_ADMIN_TOKEN not set") };
      case (?tok) { AccessControl.initialize(_accessControlState, caller, tok, userSecret) };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(_accessControlState, caller);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(_accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(_accessControlState, caller, user, role);
  };

  // ---- Stripe HTTP transform ----
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ---- Product types ----
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    imageUrl : Text;
    stock : Nat;
    isActive : Bool;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    imageUrl : Text;
    stock : Nat;
  };

  // ---- Product state ----
  var nextProductId : Nat = 1;
  let products = Map.empty<Nat, Product>();
  var seeded : Bool = false;

  func seedProducts() {
    if (seeded) return;
    seeded := true;
    let samples : [(Text, Text, Nat, Text, Text, Nat)] = [
      ("Wireless Headphones", "Premium sound quality with noise cancellation and 30-hour battery life.", 7999, "Electronics", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", 50),
      ("Running Shoes", "Lightweight and breathable for maximum performance on any terrain.", 8999, "Clothing", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", 30),
      ("Coffee Maker", "Brew the perfect cup every morning with programmable settings.", 4999, "Home & Kitchen", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", 20),
      ("Leather Wallet", "Slim genuine leather wallet with RFID blocking technology.", 2999, "Accessories", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", 75),
      ("Yoga Mat", "Non-slip eco-friendly mat for yoga, pilates, and floor exercises.", 3499, "Sports", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", 40),
      ("Desk Lamp", "Adjustable LED desk lamp with USB charging port and touch dimmer.", 3999, "Home & Kitchen", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", 35),
    ];
    for ((name, desc, price, cat, img, stock) in samples.vals()) {
      let id = nextProductId;
      nextProductId += 1;
      products.add(id, { id; name; description = desc; priceInCents = price; category = cat; imageUrl = img; stock; isActive = true });
    };
  };

  // ---- Public product queries ----
  public query func listProducts() : async [Product] {
    seedProducts();
    let result = List.empty<Product>();
    for ((_, p) in products.entries()) {
      if (p.isActive) result.add(p);
    };
    result.toArray();
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func listCategories() : async [Text] {
    let cats = Map.empty<Text, Bool>();
    for ((_, p) in products.entries()) {
      if (p.isActive) cats.add(p.category, true);
    };
    let result = List.empty<Text>();
    for ((cat, _) in cats.entries()) result.add(cat);
    result.toArray();
  };

  // ---- Admin product management ----
  public shared ({ caller }) func createProduct(input : ProductInput) : async Product {
    if (not AccessControl.isAdmin(_accessControlState, caller)) Runtime.trap("Unauthorized");
    let id = nextProductId;
    nextProductId += 1;
    let product : Product = { id; name = input.name; description = input.description; priceInCents = input.priceInCents; category = input.category; imageUrl = input.imageUrl; stock = input.stock; isActive = true };
    products.add(id, product);
    product;
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductInput) : async ?Product {
    if (not AccessControl.isAdmin(_accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (products.get(id)) {
      case (null) null;
      case (?existing) {
        let updated : Product = { id; name = input.name; description = input.description; priceInCents = input.priceInCents; category = input.category; imageUrl = input.imageUrl; stock = input.stock; isActive = existing.isActive };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func setProductActive(id : Nat, isActive : Bool) : async Bool {
    if (not AccessControl.isAdmin(_accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (products.get(id)) {
      case (null) false;
      case (?p) {
        products.add(id, { p with isActive });
        true;
      };
    };
  };

  public query ({ caller }) func listAllProducts() : async [Product] {
    if (not AccessControl.isAdmin(_accessControlState, caller)) Runtime.trap("Unauthorized");
    let result = List.empty<Product>();
    for ((_, p) in products.entries()) result.add(p);
    result.toArray();
  };

  // ---- Cart ----
  public type CartItem = { productId : Nat; quantity : Nat };
  public type Cart = { items : [CartItem] };

  let carts = Map.empty<Principal, List.List<CartItem>>();

  func getCartList(caller : Principal) : List.List<CartItem> {
    switch (carts.get(caller)) {
      case (?c) c;
      case (null) {
        let c = List.empty<CartItem>();
        carts.add(caller, c);
        c;
      };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async Cart {
    let cart = getCartList(caller);
    var found = false;
    let newItems = List.empty<CartItem>();
    for (item in cart.values()) {
      if (item.productId == productId) {
        newItems.add({ productId; quantity = item.quantity + quantity });
        found := true;
      } else {
        newItems.add(item);
      };
    };
    if (not found) newItems.add({ productId; quantity });
    carts.add(caller, newItems);
    { items = newItems.toArray() };
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async Cart {
    let cart = getCartList(caller);
    let newItems = List.empty<CartItem>();
    for (item in cart.values()) {
      if (item.productId == productId) {
        if (quantity > 0) newItems.add({ productId; quantity });
      } else {
        newItems.add(item);
      };
    };
    carts.add(caller, newItems);
    { items = newItems.toArray() };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async Cart {
    let cart = getCartList(caller);
    let newItems = List.empty<CartItem>();
    for (item in cart.values()) {
      if (item.productId != productId) newItems.add(item);
    };
    carts.add(caller, newItems);
    { items = newItems.toArray() };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.add(caller, List.empty<CartItem>());
  };

  public query ({ caller }) func getCart() : async Cart {
    switch (carts.get(caller)) {
      case (?c) { { items = c.toArray() } };
      case (null) { { items = [] } };
    };
  };

  // ---- Stripe Checkout ----
  public type StripeConfig = { secretKey : Text; allowedCountries : [Text] };
  var stripeConfig : ?StripeConfig = null;

  public shared ({ caller }) func setStripeConfig(config : StripeConfig) : async () {
    if (not AccessControl.isAdmin(_accessControlState, caller)) Runtime.trap("Unauthorized");
    stripeConfig := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(successUrl : Text, cancelUrl : Text) : async Text {
    let config = switch (stripeConfig) {
      case (null) Runtime.trap("Stripe not configured");
      case (?c) c;
    };
    let cartList = getCartList(caller);
    let items = List.empty<Stripe.ShoppingItem>();
    for (cartItem in cartList.values()) {
      switch (products.get(cartItem.productId)) {
        case (null) {};
        case (?p) {
          items.add({ currency = "usd"; productName = p.name; productDescription = p.description; priceInCents = p.priceInCents; quantity = cartItem.quantity });
        };
      };
    };
    await Stripe.createCheckoutSession(
      { secretKey = config.secretKey; allowedCountries = config.allowedCountries },
      caller,
      items.toArray(),
      successUrl,
      cancelUrl,
      transform,
    );
  };
};
