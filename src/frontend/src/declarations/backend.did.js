/* eslint-disable */
// @ts-nocheck
import { IDL } from '@icp-sdk/core/candid';

const Cart = IDL.Record({ 'items': IDL.Vec(IDL.Record({ 'productId': IDL.Nat, 'quantity': IDL.Nat })) });
const CartItem = IDL.Record({ 'productId': IDL.Nat, 'quantity': IDL.Nat });
const Product = IDL.Record({
  'id': IDL.Nat,
  'name': IDL.Text,
  'description': IDL.Text,
  'priceInCents': IDL.Nat,
  'category': IDL.Text,
  'imageUrl': IDL.Text,
  'stock': IDL.Nat,
  'isActive': IDL.Bool,
});
const ProductInput = IDL.Record({
  'name': IDL.Text,
  'description': IDL.Text,
  'priceInCents': IDL.Nat,
  'category': IDL.Text,
  'imageUrl': IDL.Text,
  'stock': IDL.Nat,
});
const UserRole = IDL.Variant({ 'admin': IDL.Null, 'user': IDL.Null, 'guest': IDL.Null });
const StripeConfig = IDL.Record({ 'secretKey': IDL.Text, 'allowedCountries': IDL.Vec(IDL.Text) });
const TransformationInput = IDL.Record({
  'context': IDL.Vec(IDL.Nat8),
  'response': IDL.Record({
    'body': IDL.Vec(IDL.Nat8),
    'headers': IDL.Vec(IDL.Record({ 'name': IDL.Text, 'value': IDL.Text })),
    'status': IDL.Nat,
  }),
});
const TransformationOutput = IDL.Record({
  'body': IDL.Vec(IDL.Nat8),
  'headers': IDL.Vec(IDL.Record({ 'name': IDL.Text, 'value': IDL.Text })),
  'status': IDL.Nat,
});

export const idlService = IDL.Service({
  '_initializeAccessControlWithSecret': IDL.Func([IDL.Text], [], []),
  'addToCart': IDL.Func([IDL.Nat, IDL.Nat], [Cart], []),
  'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
  'clearCart': IDL.Func([], [], []),
  'createCheckoutSession': IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  'createProduct': IDL.Func([ProductInput], [Product], []),
  'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
  'getCart': IDL.Func([], [Cart], ['query']),
  'getProduct': IDL.Func([IDL.Nat], [IDL.Opt(Product)], ['query']),
  'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
  'listAllProducts': IDL.Func([], [IDL.Vec(Product)], ['query']),
  'listCategories': IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
  'listProducts': IDL.Func([], [IDL.Vec(Product)], ['query']),
  'removeFromCart': IDL.Func([IDL.Nat], [Cart], []),
  'setProductActive': IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  'setStripeConfig': IDL.Func([StripeConfig], [], []),
  'transform': IDL.Func([TransformationInput], [TransformationOutput], ['query']),
  'updateCartItem': IDL.Func([IDL.Nat, IDL.Nat], [Cart], []),
  'updateProduct': IDL.Func([IDL.Nat, ProductInput], [IDL.Opt(Product)], []),
});

export const idlInitArgs = [];
export const idlFactory = ({ IDL }) => {
  const Cart = IDL.Record({ 'items': IDL.Vec(IDL.Record({ 'productId': IDL.Nat, 'quantity': IDL.Nat })) });
  const Product = IDL.Record({
    'id': IDL.Nat,
    'name': IDL.Text,
    'description': IDL.Text,
    'priceInCents': IDL.Nat,
    'category': IDL.Text,
    'imageUrl': IDL.Text,
    'stock': IDL.Nat,
    'isActive': IDL.Bool,
  });
  const ProductInput = IDL.Record({
    'name': IDL.Text,
    'description': IDL.Text,
    'priceInCents': IDL.Nat,
    'category': IDL.Text,
    'imageUrl': IDL.Text,
    'stock': IDL.Nat,
  });
  const UserRole = IDL.Variant({ 'admin': IDL.Null, 'user': IDL.Null, 'guest': IDL.Null });
  const StripeConfig = IDL.Record({ 'secretKey': IDL.Text, 'allowedCountries': IDL.Vec(IDL.Text) });
  const TransformationInput = IDL.Record({
    'context': IDL.Vec(IDL.Nat8),
    'response': IDL.Record({
      'body': IDL.Vec(IDL.Nat8),
      'headers': IDL.Vec(IDL.Record({ 'name': IDL.Text, 'value': IDL.Text })),
      'status': IDL.Nat,
    }),
  });
  const TransformationOutput = IDL.Record({
    'body': IDL.Vec(IDL.Nat8),
    'headers': IDL.Vec(IDL.Record({ 'name': IDL.Text, 'value': IDL.Text })),
    'status': IDL.Nat,
  });
  return IDL.Service({
    '_initializeAccessControlWithSecret': IDL.Func([IDL.Text], [], []),
    'addToCart': IDL.Func([IDL.Nat, IDL.Nat], [Cart], []),
    'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
    'clearCart': IDL.Func([], [], []),
    'createCheckoutSession': IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'createProduct': IDL.Func([ProductInput], [Product], []),
    'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
    'getCart': IDL.Func([], [Cart], ['query']),
    'getProduct': IDL.Func([IDL.Nat], [IDL.Opt(Product)], ['query']),
    'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
    'listAllProducts': IDL.Func([], [IDL.Vec(Product)], ['query']),
    'listCategories': IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'listProducts': IDL.Func([], [IDL.Vec(Product)], ['query']),
    'removeFromCart': IDL.Func([IDL.Nat], [Cart], []),
    'setProductActive': IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'setStripeConfig': IDL.Func([StripeConfig], [], []),
    'transform': IDL.Func([TransformationInput], [TransformationOutput], ['query']),
    'updateCartItem': IDL.Func([IDL.Nat, IDL.Nat], [Cart], []),
    'updateProduct': IDL.Func([IDL.Nat, ProductInput], [IDL.Opt(Product)], []),
  });
};
export const init = ({ IDL }) => { return []; };
