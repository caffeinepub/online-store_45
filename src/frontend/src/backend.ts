/* eslint-disable */
// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

export type { CartItem, Cart, Product, ProductInput, UserRole, StripeConfig } from "./declarations/backend.did";

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

// ExternalBlob stub (blob-storage not used but config.ts imports it)
export class ExternalBlob {
  _blob?: Uint8Array | null;
  directURL: string;
  onProgress?: (percentage: number) => void = undefined;
  private constructor(directURL: string, blob: Uint8Array | null) {
    if (blob) this._blob = blob;
    this.directURL = directURL;
  }
  static fromURL(url: string): ExternalBlob { return new ExternalBlob(url, null); }
  static fromBytes(blob: Uint8Array): ExternalBlob {
    const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
    return new ExternalBlob(url, blob);
  }
  async getBytes(): Promise<Uint8Array> {
    if (this._blob) return this._blob;
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  getDirectURL(): string { return this.directURL; }
  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.onProgress = onProgress;
    return this;
  }
}

export class Backend implements backendInterface {
  constructor(private actor: ActorSubclass<_SERVICE>) {}

  _initializeAccessControlWithSecret(userSecret: string) { return this.actor._initializeAccessControlWithSecret(userSecret); }
  addToCart(productId: bigint, quantity: bigint) { return this.actor.addToCart(productId, quantity); }
  assignCallerUserRole(user: Principal, role: any) { return this.actor.assignCallerUserRole(user, role); }
  clearCart() { return this.actor.clearCart(); }
  createCheckoutSession(successUrl: string, cancelUrl: string) { return this.actor.createCheckoutSession(successUrl, cancelUrl); }
  createProduct(input: any) { return this.actor.createProduct(input); }
  getCallerUserRole() { return this.actor.getCallerUserRole(); }
  getCart() { return this.actor.getCart(); }
  getProduct(id: bigint) { return this.actor.getProduct(id); }
  isCallerAdmin() { return this.actor.isCallerAdmin(); }
  listAllProducts() { return this.actor.listAllProducts(); }
  listCategories() { return this.actor.listCategories(); }
  listProducts() { return this.actor.listProducts(); }
  removeFromCart(productId: bigint) { return this.actor.removeFromCart(productId); }
  setProductActive(id: bigint, isActive: boolean) { return this.actor.setProductActive(id, isActive); }
  setStripeConfig(config: any) { return this.actor.setStripeConfig(config); }
  updateCartItem(productId: bigint, quantity: bigint) { return this.actor.updateCartItem(productId, quantity); }
  updateProduct(id: bigint, input: any) { return this.actor.updateProduct(id, input); }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export function createActor(
  canisterId: string,
  _uploadFile?: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile?: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {},
): Backend {
  const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(actor);
}
