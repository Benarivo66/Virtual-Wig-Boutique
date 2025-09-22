import type { ProductField } from "./definitions";

// Utility functions for cart management using localStorage
export type CartItem = ProductField & { quantity: number };

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

export function addToCart(product: ProductField) {
  if (typeof window === "undefined") return;
  const cart: CartItem[] = getCart();
  const index = cart.findIndex((item) => item.id === product.id);
  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeItem(productId: string) {
  if (typeof window === "undefined") return;
  const cart: CartItem[] = getCart();
  const filteredCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(filteredCart));
}

export function updateQuantity(productId: string, quantity: number) {
  if (typeof window === "undefined") return;
  const cart: CartItem[] = getCart();
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

export function getTotalItems(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getTotalPrice(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cart");
}