import { getCurrentUser } from "@/services/auth.service";
import { clientApiFetch } from "@/services/client-api";

import type { BackendResponse } from "@/types/auth";
import type { CartData, CartItemVariant } from "@/types/cart";

export interface AddCartItemInput {
  productId: string;
  quantity: number;
  priceEach: number;
  currency?: string;
  variant?: CartItemVariant;
}

export interface UpdateCartItemInput {
  productId: string;
  quantity: number;
  variant?: CartItemVariant;
}

export interface RemoveCartItemInput {
  productId: string;
  variant?: CartItemVariant;
}

async function getRequiredUserId(): Promise<string> {
  const user = await getCurrentUser();

  if (!user?.userId) {
    throw new Error("Please sign in to manage your bag.");
  }

  return user.userId;
}

export async function getCart(): Promise<CartData> {
  const userId = await getRequiredUserId();

  const response = await clientApiFetch<BackendResponse<CartData>>(
    `/cart?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

export async function addCartItem(input: AddCartItemInput): Promise<CartData> {
  const userId = await getRequiredUserId();

  const response = await clientApiFetch<BackendResponse<CartData>>(
    "/cart/items",
    {
      method: "POST",

      body: JSON.stringify({
        userId,
        productId: input.productId,
        quantity: input.quantity,
        priceEach: input.priceEach,
        currency: input.currency ?? "INR",
        variant: input.variant,
      }),
    },
  );

  return response.data;
}

export async function updateCartItem(
  input: UpdateCartItemInput,
): Promise<CartData> {
  const userId = await getRequiredUserId();

  const response = await clientApiFetch<BackendResponse<CartData>>(
    `/cart/items/${encodeURIComponent(input.productId)}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        userId,
        quantity: input.quantity,
        variant: input.variant,
      }),
    },
  );

  return response.data;
}

export async function removeCartItem(
  input: RemoveCartItemInput,
): Promise<CartData> {
  const userId = await getRequiredUserId();

  const response = await clientApiFetch<BackendResponse<CartData>>(
    `/cart/items/${encodeURIComponent(
      input.productId,
    )}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",

      body: JSON.stringify({
        variant: input.variant,
      }),
    },
  );

  return response.data;
}

export async function clearCart(): Promise<void> {
  const userId = await getRequiredUserId();

  await clientApiFetch<BackendResponse<null>>(
    `/cart?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
}
