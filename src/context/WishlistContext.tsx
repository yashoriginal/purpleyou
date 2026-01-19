"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import * as wishlistService from "@/services/wishlist.service";

export interface WishlistItem {
  productId: string;
  quantity: number;
  variant?: Record<string, string>;
  priceEach: number;
  currency: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
  isLoading: boolean;
  error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get userId from localStorage
  const getUserId = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id || user.userId || null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const itemCount = items.length;

  const addToWishlist = async (product: Product) => {
    setError(null);
    const userId = getUserId();

    if (!userId) {
      setError("Please log in to add items to wishlist");
      throw new Error("User not authenticated");
    }

    // Check if already in wishlist
    if (isInWishlist(product.productId)) {
      return;
    }

    try {
      setIsLoading(true);
      const productId = product.productId || String(product.id);
      await wishlistService.addToWishlist(
        userId,
        productId,
        1,
        product.price,
        undefined,
      );

      // Update local state
      setItems((prevItems) => [
        ...prevItems,
        {
          productId,
          quantity: 1,
          priceEach: product.price,
          currency: "INR",
        },
      ]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add to wishlist";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    setError(null);
    const userId = getUserId();

    if (!userId) {
      setError("Please log in to remove items from wishlist");
      throw new Error("User not authenticated");
    }

    try {
      setIsLoading(true);
      const prodId = String(productId);
      await wishlistService.removeFromWishlist(userId, prodId);

      // Update local state
      setItems((prevItems) =>
        prevItems.filter((item) => item.productId !== prodId),
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to remove from wishlist";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string | number): boolean => {
    const prodId = String(productId);
    return items.some((item) => item.productId === prodId);
  };

  const value: WishlistContextType = {
    items,
    itemCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading,
    error,
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
