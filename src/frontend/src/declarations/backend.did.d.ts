/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface CartItem { productId: bigint; quantity: bigint; }
export interface Cart { items: CartItem[]; }
export interface Product {
  id: bigint;
  name: string;
  description: string;
  priceInCents: bigint;
  category: string;
  imageUrl: string;
  stock: bigint;
  isActive: boolean;
}
export interface ProductInput {
  name: string;
  description: string;
  priceInCents: bigint;
  category: string;
  imageUrl: string;
  stock: bigint;
}
export type UserRole = { admin: null } | { user: null } | { guest: null };
export interface StripeConfig { secretKey: string; allowedCountries: string[]; }

export interface _SERVICE {
  '_initializeAccessControlWithSecret': ActorMethod<[string], void>;
  'addToCart': ActorMethod<[bigint, bigint], Cart>;
  'assignCallerUserRole': ActorMethod<[Principal, UserRole], void>;
  'clearCart': ActorMethod<[], void>;
  'createCheckoutSession': ActorMethod<[string, string], string>;
  'createProduct': ActorMethod<[ProductInput], Product>;
  'getCallerUserRole': ActorMethod<[], UserRole>;
  'getCart': ActorMethod<[], Cart>;
  'getProduct': ActorMethod<[bigint], [] | [Product]>;
  'isCallerAdmin': ActorMethod<[], boolean>;
  'listAllProducts': ActorMethod<[], Product[]>;
  'listCategories': ActorMethod<[], string[]>;
  'listProducts': ActorMethod<[], Product[]>;
  'removeFromCart': ActorMethod<[bigint], Cart>;
  'setProductActive': ActorMethod<[bigint, boolean], boolean>;
  'setStripeConfig': ActorMethod<[StripeConfig], void>;
  'updateCartItem': ActorMethod<[bigint, bigint], Cart>;
  'updateProduct': ActorMethod<[bigint, ProductInput], [] | [Product]>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
