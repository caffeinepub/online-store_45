import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, XCircle } from "lucide-react";
import { motion } from "motion/react";

export function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
        data-ocid="cancel.panel"
      >
        <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mb-8">
          Your payment was cancelled. No charges were made. Your cart items are
          still saved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              data-ocid="cancel.secondary_button"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </Link>
          <Link to="/">
            <Button
              className="gap-2 w-full sm:w-auto bg-primary text-primary-foreground"
              data-ocid="cancel.primary_button"
            >
              <ShoppingBag className="h-4 w-4" />
              View Cart
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
