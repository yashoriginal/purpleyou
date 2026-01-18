"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";
import * as cartService from "@/services/cart.service";

export interface CartItem {
  id: string; // Unique identifier for this cart item
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (
    product: Product,
    selectedVariants?: Record<string, string>,
    quantity?: number,
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate unique ID for cart items based on product and variants
 */
function generateCartItemId(
  productId: string | number,
  variants?: Record<string, string>,
): string {
  const variantString = variants
    ? Object.entries(variants)
        .sort()
        .map(([key, value]) => `${key}:${value}`)
        .join("|")
    : "";
  return `${productId}_${variantString}`;
}

/**
 * Convert API cart data to local CartItem format
 */
function mapCartItemsFromAPI(
  apiItems: cartService.CartItemData[],
  productMap: Map<string, Product>,
): CartItem[] {
  return apiItems.map((apiItem) => {
    const product = productMap.get(apiItem.productId);
    const itemId = generateCartItemId(apiItem.productId, apiItem.variant);

    return {
      id: itemId,
      productId: apiItem.productId,
      productName: product?.name || "Product",
      price: apiItem.priceEach,
      image: product?.image || "/images/hero1.jpg",
      quantity: apiItem.quantity,
      selectedVariants: apiItem.variant || {},
    };
  });
}

// ============================================================================
// CONTEXT PROVIDER
// ============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
  // State management
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize userId from localStorage (auth token)
  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Try to extract userId from the auth storage
        const userStr = localStorage.getItem("current_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const id = user._id || user.id || user.userId;
          if (id) {
            setUserId(id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to initialize cart:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Fetch cart from API when userId changes
  useEffect(() => {
    if (userId && isHydrated) {
      loadCart();
    }
  }, [userId, isHydrated]);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // =========================================================================
  // CART OPERATIONS
  // =========================================================================

  /**
   * Load cart items from API
   */
  async function loadCart() {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const cartData = await cartService.getCart(userId);
      
      // Create a map of products from the cart data
      // Since we don't have full product details from cart API, we'll use partial info
      const productMap = new Map<string, Product>();

      const cartItems = cartData.items.map((apiItem) => {
        const itemId = generateCartItemId(apiItem.productId, apiItem.variant);
        return {
          id: itemId,
          productId: apiItem.productId,
          productName: `Product ${apiItem.productId.substring(0, 8)}...`,
          price: apiItem.priceEach,
          image: "/images/hero1.jpg", // Fallback image
          quantity: apiItem.quantity,
          selectedVariants: apiItem.variant || {},
        };
      });

      setItems(cartItems);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load cart";
      setError(errorMessage);
      console.error("Failed to load cart:", err);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Add product to cart
   */
  const addToCart = async (
    product: Product,
    selectedVariants?: Record<string, string>,
    quantity: number = 1,
  ) => {
    if (!userId) {
      setError("Please log in to add items to cart");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call API to add item
      const cartData = await cartService.addToCart(
        userId,
        product.id.toString(),
        quantity,
        product.price,
        selectedVariants,
      );

      // Update local state with response
      const itemId = generateCartItemId(product.id, selectedVariants);
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === itemId);

        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems];
          updatedItems[existingIndex].quantity += quantity;
          return updatedItems;
        } else {
          // Add new item
          return [
            ...prevItems,
            {
              id: itemId,
              productId: product.id.toString(),
              productName: product.name,
              price: product.price,
              image: product.image,
              quantity,
              selectedVariants: selectedVariants || {},
            },
          ];
        }
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add item to cart";
      setError(errorMessage);
      console.error("Failed to add to cart:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (itemId: string) => {
    if (!userId) {
      setError("Please log in to manage cart");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find the item to get productId and variant
      const itemToRemove = items.find((item) => item.id === itemId);
      if (!itemToRemove) {
        throw new Error("Item not found in cart");
      }

      // Call API to remove item
      await cartService.removeFromCart(
        userId,
        itemToRemove.productId,
        itemToRemove.selectedVariants,
      );

      // Update local state
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove item from cart";
      setError(errorMessage);
      console.error("Failed to remove from cart:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update item quantity
   */
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!userId) {
      setError("Please log in to manage cart");
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find the item to get productId and variant
      const itemToUpdate = items.find((item) => item.id === itemId);
      if (!itemToUpdate) {
        throw new Error("Item not found in cart");
      }

      // Call API to update quantity
      await cartService.updateCartItem(
        userId,
        itemToUpdate.productId,
        quantity,
        itemToUpdate.selectedVariants,
      );

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update cart item";
      setError(errorMessage);
      console.error("Failed to update quantity:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (!userId) {
      setError("Please log in to manage cart");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cartService.clearCart(userId);
      setItems([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear cart";
      setError(errorMessage);
      console.error("Failed to clear cart:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // CONTEXT VALUE
  // =========================================================================

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
