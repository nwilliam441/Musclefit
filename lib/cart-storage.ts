import type { CartEntry, UnifiedCart } from "@/lib/cart-types";

const ORDER_CART_KEY = "musclefit-order-cart";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readStoredCart(): UnifiedCart {
  if (!canUseStorage()) {
    return {};
  }

  const raw = window.localStorage.getItem(ORDER_CART_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as UnifiedCart;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function writeStoredCart(cart: UnifiedCart) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ORDER_CART_KEY, JSON.stringify(cart));
}

export function updateStoredCartItem(key: keyof UnifiedCart, entry: CartEntry) {
  const nextCart = {
    ...readStoredCart(),
    [key]: entry,
  };

  writeStoredCart(nextCart);
  return nextCart;
}

export function removeStoredCartItem(key: keyof UnifiedCart) {
  const nextCart = { ...readStoredCart() };
  delete nextCart[key];
  writeStoredCart(nextCart);
  return nextCart;
}

export function clearStoredCart() {
  writeStoredCart({});
}
