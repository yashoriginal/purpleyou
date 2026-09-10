import { clientApiFetch } from "@/services/client-api";

import type {
  CreateOrderPayload,
  OrderResponse,
  VerifyPaymentPayload,
} from "@/types/order";

interface OrderApiResponse<T> {
  data: T;
  success: boolean;
  error: string | null;
  statusCode: number;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const response = await clientApiFetch<OrderApiResponse<OrderResponse>>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  if (!response.success) {
    throw new Error(response.error || "Unable to create order.");
  }

  return response.data;
}

export async function verifyRazorpayPayment(
  payload: VerifyPaymentPayload,
): Promise<void> {
  const response = await clientApiFetch<
    OrderApiResponse<{ verified: boolean }>
  >("/orders/payment/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.error || "Payment verification failed.");
  }
}
