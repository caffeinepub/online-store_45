import { Principal } from '@dfinity/principal';

export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface Product {
  id: bigint;
  name: string;
  description: string;
  priceInCents: bigint;
  category: string;
  imageUrl: string;
  stock: bigint;
  isActive: boolean;
}

export interface ProductInput {
  name: string;
  description: string;
  priceInCents: bigint;
  category: string;
  imageUrl: string;
  stock: bigint;
}

export interface CartItem {
  productId: bigint;
  quantity: bigint;
}

export interface Cart {
  items: CartItem[];
}

export interface StripeConfig {
  secretKey: string;
  allowedCountries: string[];
}

export interface BackendActor {
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  getCallerUserRole(): Promise<UserRole>;
  isCallerAdmin(): Promise<boolean>;
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;

  listProducts(): Promise<Product[]>;
  listAllProducts(): Promise<Product[]>;
  getProduct(id: bigint): Promise<[] | [Product]>;
  listCategories(): Promise<string[]>;
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(id: bigint, input: ProductInput): Promise<[] | [Product]>;
  setProductActive(id: bigint, isActive: boolean): Promise<boolean>;

  getCart(): Promise<Cart>;
  addToCart(productId: bigint, quantity: bigint): Promise<Cart>;
  updateCartItem(productId: bigint, quantity: bigint): Promise<Cart>;
  removeFromCart(productId: bigint): Promise<Cart>;
  clearCart(): Promise<void>;

  setStripeConfig(config: StripeConfig): Promise<void>;
  createCheckoutSession(successUrl: string, cancelUrl: string): Promise<string>;
}
