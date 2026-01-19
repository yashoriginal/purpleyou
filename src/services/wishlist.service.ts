/**
 * Wishlist Service
 * Handles all wishlist-related API calls to the backend
 * API Base: https://purpleoneservice.onrender.com/api/v1/wishlist
 */

const WISHLIST_API_BASE = "https://purpleoneservice.onrender.com/api/v1/wishlist";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Variant selection for a product
 */
export interface Variant {
  color?: string;
  size?: string;
  [key: string]: string | undefined;
}

/**
 * Wishlist item as stored in the backend
 */
export interface WishlistItemData {
  productId: string;
  quantity: number;
  priceEach: number;
  currency: string;
  variant?: Variant;
}

/**
 * Wishlist data returned from the API
 */
export interface WishlistData {
  userId: string;
  items: WishlistItemData[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Standard API response
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  error: string | null;
  statusCode: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Make authenticated request to wishlist API
 */
async function makeWishlistRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${WISHLIST_API_BASE}${endpoint}`, {
    ...options,
    headers,
    timeout: 10000,
  } as any);

  if (!response.ok) {
    const errorData: ApiResponse = await response.json().catch(() => ({
      success: false,
      error: `HTTP ${response.status}`,
      statusCode: response.status,
    }));

    throw new Error(
      errorData.error || `Wishlist API error: ${response.status}`,
    );
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Wishlist operation failed");
  }

  return data.data as T;
}

// ============================================================================
// WISHLIST API FUNCTIONS
// ============================================================================

/**
 * Add item to wishlist
 * POST /api/v1/wishlist/items
 */
export async function addToWishlist(
  userId: string,
  productId: string,
  quantity: number = 1,
  priceEach: number,
  variant?: Variant,
): Promise<WishlistData> {
  const payload = {
    userId,
    productId,
    quantity,
    variant: variant || {},
    priceEach,
    currency: "INR",
  };

  return makeWishlistRequest<WishlistData>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Remove item from wishlist
 * DELETE /api/v1/wishlist/items/{productId}?userId={userId}
 */
export async function removeFromWishlist(
  userId: string,
  productId: string,
  variant?: Variant,
): Promise<WishlistData> {
  const options: RequestInit = {
    method: "DELETE",
  };

  // Only include body if variant is provided
  if (variant) {
    options.body = JSON.stringify({ variant });
  }

  return makeWishlistRequest<WishlistData>(
    `/items/${productId}?userId=${userId}`,
    options,
  );
}

/**
 * Clear entire wishlist
 * DELETE /api/v1/wishlist?userId={userId}
 */
export async function clearWishlist(userId: string): Promise<WishlistData> {
  return makeWishlistRequest<WishlistData>(`?userId=${userId}`, {
    method: "DELETE",
  });
}
