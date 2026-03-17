export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}
