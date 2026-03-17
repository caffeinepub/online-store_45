import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
  } = useCart();

  async function handleCheckout() {
    const successUrl = `${window.location.origin}/success`;
    const cancelUrl = `${window.location.origin}/`;
    // In a real integration, call actor.createCheckoutSession(successUrl, cancelUrl)
    // and parse the returned JSON for the URL field
    toast.info(`Checkout would redirect to Stripe. Success: ${successUrl}`);
    console.log("Checkout", { successUrl, cancelUrl });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={closeCart}
            data-ocid="cart.modal"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card shadow-2xl flex flex-col"
            data-ocid="cart.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                data-ocid="cart.close_button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div
                className="flex-1 flex flex-col items-center justify-center gap-4 p-6"
                data-ocid="cart.empty_state"
              >
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                <p className="text-muted-foreground text-center">
                  Your cart is empty.
                  <br />
                  Add some products to get started!
                </p>
                <Button
                  variant="outline"
                  onClick={closeCart}
                  data-ocid="cart.secondary_button"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3"
                      data-ocid={`cart.item.${idx + 1}`}
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-accent font-semibold mt-0.5">
                          {formatPrice(item.product.priceInCents)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            data-ocid={`cart.toggle.${idx + 1}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive ml-auto"
                            onClick={() => removeFromCart(item.product.id)}
                            data-ocid={`cart.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Subtotal
                  </span>
                  <span className="font-display font-bold text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <Separator />
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  onClick={handleCheckout}
                  data-ocid="cart.submit_button"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    clearCart();
                    closeCart();
                  }}
                  data-ocid="cart.delete_button"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
