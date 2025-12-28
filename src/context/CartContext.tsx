"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/data";

export interface CartItem {
  id: string; // Unique identifier for this cart item (productId_variant_hash)
  productId: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants?: Record<string, string>; // e.g., { "Size": "M", "Length": "16 inches" }
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (
    product: Product,
    selectedVariants?: Record<string, string>,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculate total items count
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Generate unique ID for cart items based on product and variants
  const generateCartItemId = (
    productId: number,
    variants?: Record<string, string>
  ): string => {
    const variantString = variants
      ? Object.entries(variants)
          .sort()
          .map(([key, value]) => `${key}:${value}`)
          .join("|")
      : "";
    return `${productId}_${variantString}`;
  };

  const addToCart = (
    product: Product,
    selectedVariants?: Record<string, string>,
    quantity: number = 1
  ) => {
    const itemId = generateCartItemId(product.id, selectedVariants);

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemId);

      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          productName: product.name,
          price: product.price,
          image: product.image,
          quantity,
          selectedVariants: selectedVariants || {},
        };
        return [...prevItems, newItem];
      }
    });

    // TODO: API Integration
    // Once you have a backend, replace the above with:
    // await fetch('/api/cart/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     productId: product.id,
    //     selectedVariants,
    //     quantity,
    //   }),
    // });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

    // TODO: API Integration
    // await fetch('/api/cart/remove', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ itemId }),
    // });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    // TODO: API Integration
    // await fetch('/api/cart/update', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ itemId, quantity }),
    // });
  };

  const clearCart = () => {
    setItems([]);

    // TODO: API Integration
    // await fetch('/api/cart/clear', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    // });
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
