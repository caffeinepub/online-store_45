import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    isActive: boolean;
    stock: bigint;
    imageUrl: string;
    category: string;
    priceInCents: bigint;
}
export interface ProductInput {
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    priceInCents: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Cart {
    items: Array<CartItem>;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface StripeConfig {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface mainInterface {
    addToCart(productId: bigint, quantity: bigint): Promise<Cart>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(successUrl: string, cancelUrl: string): Promise<string>;
    createProduct(input: ProductInput): Promise<Product>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getProduct(id: bigint): Promise<Product | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllProducts(): Promise<Array<Product>>;
    listCategories(): Promise<Array<string>>;
    listProducts(): Promise<Array<Product>>;
    removeFromCart(productId: bigint): Promise<Cart>;
    setProductActive(id: bigint, isActive: boolean): Promise<boolean>;
    setStripeConfig(config: StripeConfig): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<Cart>;
    updateProduct(id: bigint, input: ProductInput): Promise<Product | null>;
}
