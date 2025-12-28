"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/data";

export interface WishlistItem {
  productId: number;
  addedAt: string; // ISO timestamp
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const itemCount = items.length;

  const addToWishlist = (product: Product) => {
    setItems((prevItems) => {
      // Check if product already exists in wishlist
      if (prevItems.some((item) => item.productId === product.id)) {
        return prevItems;
      }

      // Add new item to wishlist
      const newItem: WishlistItem = {
        productId: product.id,
        addedAt: new Date().toISOString(),
      };
      return [...prevItems, newItem];
    });

    // TODO: API Integration
    // Once you have a backend, replace the above with:
    // await fetch('/api/wishlist/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     productId: product.id,
    //   }),
    // });
  };

  const removeFromWishlist = (productId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId),
    );

    // TODO: API Integration
    // await fetch('/api/wishlist/remove', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ productId }),
    // });
  };

  const isInWishlist = (productId: number): boolean => {
    return items.some((item) => item.productId === productId);
  };

  const clearWishlist = () => {
    setItems([]);

    // TODO: API Integration
    // await fetch('/api/wishlist/clear', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    // });
  };

  const value: WishlistContextType = {
    items,
    itemCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
