/**
 * Cart Service
 * Handles all cart-related API calls to the backend
 * API Base: https://purpleoneservice.onrender.com/api/v1/cart
 */

const CART_API_BASE = "https://purpleoneservice.onrender.com/api/v1/cart";

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
 * Cart item as stored in the backend
 */
export interface CartItemData {
  productId: string;
  quantity: number;
  priceEach: number;
  currency: string;
  variant?: Variant;
}

/**
 * Cart data returned from the API
 */
export interface CartData {
  userId: string;
  items: CartItemData[];
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
 * Make authenticated request to cart API
 */
async function makeCartRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${CART_API_BASE}${endpoint}`, {
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
      errorData.error || `Cart API error: ${response.statusCode}`,
    );
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Cart operation failed");
  }

  return data.data as T;
}

// ============================================================================
// CART API FUNCTIONS
// ============================================================================

/**
 * Get cart items for a user
 * GET /api/v1/cart?userId={userId}
 */
export async function getCart(userId: string): Promise<CartData> {
  return makeCartRequest<CartData>(`?userId=${userId}`);
}

/**
 * Add item to cart
 * POST /api/v1/cart/items
 */
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  priceEach: number,
  variant?: Variant,
): Promise<CartData> {
  const payload = {
    userId,
    productId,
    quantity,
    variant: variant || {},
    priceEach,
    currency: "INR",
  };

  return makeCartRequest<CartData>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update item quantity in cart
 * PATCH /api/v1/cart/items/{productId}
 */
export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number,
  variant?: Variant,
): Promise<CartData> {
  const payload = {
    userId,
    quantity,
    variant: variant || {},
  };

  return makeCartRequest<CartData>(`/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Remove item from cart
 * DELETE /api/v1/cart/items/{productId}?userId={userId}
 */
export async function removeFromCart(
  userId: string,
  productId: string,
  variant?: Variant,
): Promise<CartData> {
  const options: RequestInit = {
    method: "DELETE",
  };

  // Only include body if variant is provided
  if (variant) {
    options.body = JSON.stringify({ variant });
  }

  return makeCartRequest<CartData>(
    `/items/${productId}?userId=${userId}`,
    options,
  );
}

/**
 * Clear entire cart
 * DELETE /api/v1/cart?userId={userId}
 */
export async function clearCart(userId: string): Promise<CartData> {
  return makeCartRequest<CartData>(`?userId=${userId}`, {
    method: "DELETE",
  });
}
