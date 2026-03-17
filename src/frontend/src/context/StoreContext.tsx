import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../types";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Noise-Canceling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 40-hour battery life, and studio-quality sound. Fold-flat design with premium carrying case included.",
    priceInCents: 29999,
    category: "Electronics",
    imageUrl: "/assets/generated/product-headphones.dim_600x600.jpg",
    stock: 24,
    isActive: true,
  },
  {
    id: "2",
    name: "Leather Travel Backpack",
    description:
      "Handcrafted full-grain leather backpack with 30L capacity, padded laptop sleeve, and antique brass hardware. Ages beautifully over time.",
    priceInCents: 18900,
    category: "Accessories",
    imageUrl: "/assets/generated/product-backpack.dim_600x600.jpg",
    stock: 12,
    isActive: true,
  },
  {
    id: "3",
    name: "Mechanical Dress Watch",
    description:
      "Swiss-movement mechanical wristwatch with exhibition caseback, sapphire crystal glass, and Italian leather strap. Water resistant to 50m.",
    priceInCents: 54900,
    category: "Accessories",
    imageUrl: "/assets/generated/product-watch.dim_600x600.jpg",
    stock: 8,
    isActive: true,
  },
  {
    id: "4",
    name: "Wireless Charging Pad",
    description:
      "15W fast wireless charger compatible with all Qi devices. Ultra-thin design with LED indicator and anti-slip surface.",
    priceInCents: 3499,
    category: "Electronics",
    imageUrl: "/assets/generated/product-charger.dim_600x600.jpg",
    stock: 50,
    isActive: true,
  },
  {
    id: "5",
    name: "Portable Bluetooth Speaker",
    description:
      "360-degree sound with deep bass, IP67 waterproof rating, 24-hour playtime. Perfect for outdoor adventures and home use.",
    priceInCents: 12900,
    category: "Electronics",
    imageUrl: "/assets/generated/product-speaker.dim_600x600.jpg",
    stock: 30,
    isActive: true,
  },
  {
    id: "6",
    name: "Aviator Sunglasses",
    description:
      "Classic aviator frame with polarized gradient lenses, 100% UV400 protection, and lightweight titanium construction. Comes with premium case.",
    priceInCents: 8900,
    category: "Accessories",
    imageUrl: "/assets/generated/product-sunglasses.dim_600x600.jpg",
    stock: 20,
    isActive: true,
  },
];

const SAMPLE_CATEGORIES = ["Electronics", "Accessories"];

interface StoreContextValue {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  addProduct: (p: Omit<Product, "id" | "isActive">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  setProductActive: (id: string, active: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("shopICP_products");
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });
  const [isLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("shopICP_products", JSON.stringify(products));
  }, [products]);

  const categories = [
    ...new Set(products.filter((p) => p.isActive).map((p) => p.category)),
  ];
  const allCategories = categories.length > 0 ? categories : SAMPLE_CATEGORIES;

  function addProduct(p: Omit<Product, "id" | "isActive">) {
    const newProduct: Product = {
      ...p,
      id: Date.now().toString(),
      isActive: true,
    };
    setProducts((prev) => [...prev, newProduct]);
  }

  function updateProduct(id: string, p: Partial<Product>) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...p } : product,
      ),
    );
  }

  function setProductActive(id: string, active: boolean) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isActive: active } : product,
      ),
    );
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: allCategories,
        isLoading,
        addProduct,
        updateProduct,
        setProductActive,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
