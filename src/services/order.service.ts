/**
 * Order Service
 * Handles all order-related API calls to the backend
 * API Base: https://purpleoneservice.onrender.com/api/v1/orders
 */

const ORDER_API_BASE = "https://purpleoneservice.onrender.com/api/v1/orders";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface OrderItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderDetails {
  totalQuantity: number;
  totalPrice: number;
  paymentMethod: string;
}

export interface DeliveryDetails {
  deliveryDate: string;
  deliveryAddress: string;
}

export interface PickupDetails {
  pickupDate?: string;
  pickupLocation?: string;
}

export interface CreateOrderPayload {
  userId: string;
  shopId?: string;
  status: string;
  items: OrderItem[];
  orderDetails: OrderDetails;
  deliveryDetails: DeliveryDetails;
  pickupDetails?: PickupDetails;
}

export interface RazorpayOrderData {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: Record<string, string>;
  offer_id: string | null;
  receipt: string;
  status: string;
}

export interface OrderResponse {
  orderId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  shopId?: string;
  status: string;
  items: OrderItem[];
  orderDetails: OrderDetails;
  deliveryDetails: DeliveryDetails;
  pickupDetails?: PickupDetails;
  razorpayOrder: RazorpayOrderData;
}

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
 * Make authenticated request to order API
 */
async function makeOrderRequest<T = unknown>(
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

  const response = await fetch(`${ORDER_API_BASE}${endpoint}`, {
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
      errorData.error || `Order API error: ${response.status}`,
    );
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Order operation failed");
  }

  return data.data as T;
}

// ============================================================================
// ORDER API FUNCTIONS
// ============================================================================

/**
 * Create a new order
 * POST /api/v1/orders/
 */
export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  return makeOrderRequest<OrderResponse>("/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
