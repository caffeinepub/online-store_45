import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Edit, Loader2, LogOut, Plus, ShieldCheck, Store } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../context/StoreContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Product } from "../types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

interface ProductFormData {
  name: string;
  description: string;
  priceDisplay: string; // dollars
  category: string;
  imageUrl: string;
  stock: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  priceDisplay: "",
  category: "",
  imageUrl: "",
  stock: "",
};

export function Admin() {
  const { products, addProduct, updateProduct, setProductActive } = useStore();
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  function openAddDialog() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setIsDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      priceDisplay: (product.priceInCents / 100).toFixed(2),
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceInCents = Math.round(Number.parseFloat(form.priceDisplay) * 100);
    if (Number.isNaN(priceInCents) || priceInCents <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      priceInCents,
      category: form.category,
      imageUrl: form.imageUrl,
      stock: Number.parseInt(form.stock) || 0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success("Product updated successfully");
    } else {
      addProduct(productData);
      toast.success("Product added successfully");
    }
    setIsDialogOpen(false);
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-8 shadow-card max-w-sm w-full mx-4 text-center"
          data-ocid="admin.panel"
        >
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to manage your store products and inventory.
          </p>
          <Button
            className="w-full bg-primary text-primary-foreground"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Link
            to="/"
            className="block mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Store
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <span className="font-display font-bold text-primary">
                  ShopICP
                </span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold text-sm">Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden md:block">
                {identity?.getPrincipal().toString().slice(0, 14)}...
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                data-ocid="admin.secondary_button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} total products
            </p>
          </div>
          <Button onClick={openAddDialog} data-ocid="admin.primary_button">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, idx) => (
                <TableRow key={product.id} data-ocid={`admin.row.${idx + 1}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover border border-border"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-48">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product.priceInCents)}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={(checked) =>
                        setProductActive(product.id, checked)
                      }
                      data-ocid={`admin.switch.${idx + 1}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                      data-ocid={`admin.edit_button.${idx + 1}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Premium Headphones"
                  required
                  data-ocid="admin.input"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Product description..."
                  rows={3}
                  required
                  data-ocid="admin.textarea"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.priceDisplay}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceDisplay: e.target.value }))
                  }
                  placeholder="29.99"
                  required
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  placeholder="100"
                  required
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="Electronics"
                  required
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  data-ocid="admin.input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
              <Button type="submit" data-ocid="admin.submit_button">
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
