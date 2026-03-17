import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
        data-ocid="success.panel"
      >
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. You'll receive an email confirmation with
          your order details shortly.
        </p>
        <Link to="/">
          <Button
            className="gap-2 bg-primary text-primary-foreground"
            data-ocid="success.primary_button"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
