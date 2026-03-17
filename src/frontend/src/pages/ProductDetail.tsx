import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Package, Plus, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const { products } = useStore();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">
              Product not found
            </h1>
            <Link to="/" className="text-primary underline">
              Back to shop
            </Link>
          </div>
        </main>
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            data-ocid="product.link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-square rounded-xl overflow-hidden bg-muted shadow-card"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <Badge className="w-fit mb-4 bg-primary/10 text-primary border-0">
                {product.category}
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>
              <Separator className="mb-6" />
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-3xl font-bold text-accent">
                  {formatPrice(product.priceInCents)}
                </span>
                {product.stock > 0 && product.stock < 10 && (
                  <Badge variant="secondary" className="text-xs">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    data-ocid="product.toggle"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 w-full md:w-auto"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                data-ocid="product.primary_button"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
