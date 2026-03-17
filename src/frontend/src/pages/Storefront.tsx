import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";

export function Storefront() {
  const { products, categories } = useStore();
  const { openCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const activeProducts = products.filter((p) => p.isActive);
  const filteredProducts =
    activeCategory === "All"
      ? activeProducts
      : activeProducts.filter((p) => p.category === activeCategory);

  const allCategories = ["All", ...categories];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-banner.dim_1200x500.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-white/20 px-3 py-1 rounded-full mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                New arrivals just dropped
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
                Discover
                <br />
                Premium Products
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
                Curated selection of high-quality electronics, accessories, and
                lifestyle products. Free shipping on orders over $50.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-ocid="hero.primary_button"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-primary-foreground hover:bg-white/10 bg-transparent"
                  onClick={openCart}
                  data-ocid="hero.secondary_button"
                >
                  View Cart
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="bg-card border-y border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                {
                  icon: Truck,
                  label: "Free shipping",
                  desc: "On orders over $50",
                },
                {
                  icon: Shield,
                  label: "Secure checkout",
                  desc: "256-bit SSL encryption",
                },
                {
                  icon: Sparkles,
                  label: "30-day returns",
                  desc: "No questions asked",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section id="products" className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Our Products
            </h2>
            {/* Category filters */}
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Product categories"
            >
              {allCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                  data-ocid="products.tab"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20" data-ocid="products.empty_state">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
