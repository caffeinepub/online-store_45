import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="bg-card rounded-lg shadow-card overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="relative overflow-hidden aspect-square bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs">
              {product.category}
            </Badge>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-1 mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-accent">
                {formatPrice(product.priceInCents)}
              </span>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                onClick={handleAddToCart}
                data-ocid={`products.button.${index + 1}`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
