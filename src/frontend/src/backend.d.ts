import type { Principal } from '@icp-sdk/core/principal';
export type { CartItem, Cart, Product, ProductInput, UserRole, StripeConfig } from './declarations/backend.did';

export interface backendInterface {
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  addToCart(productId: bigint, quantity: bigint): Promise<import('./declarations/backend.did').Cart>;
  assignCallerUserRole(user: Principal, role: import('./declarations/backend.did').UserRole): Promise<void>;
  clearCart(): Promise<void>;
  createCheckoutSession(successUrl: string, cancelUrl: string): Promise<string>;
  createProduct(input: import('./declarations/backend.did').ProductInput): Promise<import('./declarations/backend.did').Product>;
  getCallerUserRole(): Promise<import('./declarations/backend.did').UserRole>;
  getCart(): Promise<import('./declarations/backend.did').Cart>;
  getProduct(id: bigint): Promise<[] | [import('./declarations/backend.did').Product]>;
  isCallerAdmin(): Promise<boolean>;
  listAllProducts(): Promise<import('./declarations/backend.did').Product[]>;
  listCategories(): Promise<string[]>;
  listProducts(): Promise<import('./declarations/backend.did').Product[]>;
  removeFromCart(productId: bigint): Promise<import('./declarations/backend.did').Cart>;
  setProductActive(id: bigint, isActive: boolean): Promise<boolean>;
  setStripeConfig(config: import('./declarations/backend.did').StripeConfig): Promise<void>;
  updateCartItem(productId: bigint, quantity: bigint): Promise<import('./declarations/backend.did').Cart>;
  updateProduct(id: bigint, input: import('./declarations/backend.did').ProductInput): Promise<[] | [import('./declarations/backend.did').Product]>;
}
