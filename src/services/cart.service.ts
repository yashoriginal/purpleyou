import { getCurrentUser } from "@/services/auth.service";
import { clientApiFetch } from "@/services/client-api";

import type { BackendResponse } from "@/types/auth";
import type { CartApiItem, CartData, CartItemVariant } from "@/types/cart";

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

const GUEST_CART_STORAGE_KEY = "purpleyou_guest_cart";

const GUEST_CART_USER_ID = "guest";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createGuestCart(items: CartApiItem[] = []): CartData {
  const now = new Date().toISOString();

  return calculateCartTotals({
    userId: GUEST_CART_USER_ID,
    items,
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    currency: items[0]?.currency ?? "INR",
    createdAt: now,
    updatedAt: now,
  });
}

function calculateCartTotals(cart: CartData): CartData {
  const items = cart.items.filter((item) => item.quantity > 0);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const totalItems = items.length;

  const subtotal = items.reduce(
    (total, item) => total + (item.priceEach ?? 0) * item.quantity,
    0,
  );

  return {
    ...cart,
    items,
    totalItems,
    totalQuantity,
    subtotal,
    currency: cart.currency ?? items[0]?.currency ?? "INR",
    updatedAt: new Date().toISOString(),
  };
}

function readGuestCart(): CartData {
  if (!isBrowser()) {
    return createGuestCart();
  }

  try {
    const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);

    if (!stored) {
      return createGuestCart();
    }

    const parsed = JSON.parse(stored) as Partial<CartData>;

    if (!Array.isArray(parsed.items)) {
      return createGuestCart();
    }

    return calculateCartTotals({
      userId: GUEST_CART_USER_ID,
      items: parsed.items,
      totalItems: parsed.totalItems ?? 0,
      totalQuantity: parsed.totalQuantity ?? 0,
      subtotal: parsed.subtotal ?? 0,
      currency: parsed.currency ?? "INR",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to restore guest cart.", error);

    return createGuestCart();
  }
}

function saveGuestCart(cart: CartData): CartData {
  const normalized = calculateCartTotals({
    ...cart,
    userId: GUEST_CART_USER_ID,
  });

  if (!isBrowser()) {
    return normalized;
  }

  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.error("Unable to save guest cart.", error);
  }

  return normalized;
}

export function clearGuestCart(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear guest cart.", error);
  }
}

export function getGuestCart(): CartData {
  return readGuestCart();
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const user = await getCurrentUser();

  return user?.userId ?? null;
}

/*
 * ============================================================
 * GET CART
 * ============================================================
 */

export async function getCart(): Promise<CartData> {
  const userId = await getAuthenticatedUserId();

  /*
   * Guests use the browser-local cart.
   */
  if (!userId) {
    return getGuestCart();
  }

  const response = await clientApiFetch<BackendResponse<CartData>>(
    `/cart?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

/*
 * ============================================================
 * ADD CART ITEM
 * ============================================================
 */

export async function addCartItem(input: AddCartItemInput): Promise<CartData> {
  const userId = await getAuthenticatedUserId();

  /*
   * ==========================================================
   * GUEST CART
   * ==========================================================
   */

  if (!userId) {
    const existing = getGuestCart();

    const items = [...existing.items];

    const index = items.findIndex(
      (item) =>
        item.productId === input.productId &&
        item.variant?.size === input.variant?.size &&
        item.variant?.color === input.variant?.color &&
        item.variant?.material === input.variant?.material,
    );

    if (index >= 0) {
      items[index] = {
        ...items[index],
        quantity: items[index].quantity + input.quantity,
        priceEach: input.priceEach,
        currency: input.currency ?? items[index].currency ?? "INR",
        variant: input.variant,
      };
    } else {
      items.push({
        productId: input.productId,
        quantity: input.quantity,
        priceEach: input.priceEach,
        currency: input.currency ?? "INR",
        variant: input.variant,
      });
    }

    return saveGuestCart({
      ...existing,
      items,
      currency: input.currency ?? existing.currency ?? "INR",
    });
  }

  /*
   * ==========================================================
   * AUTHENTICATED CART
   * ==========================================================
   */

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

/*
 * ============================================================
 * UPDATE CART ITEM
 * ============================================================
 */

export async function updateCartItem(
  input: UpdateCartItemInput,
): Promise<CartData> {
  const userId = await getAuthenticatedUserId();

  /*
   * Guest cart
   */
  if (!userId) {
    const existing = getGuestCart();

    const items = existing.items
      .map((item) => {
        if (
          item.productId === input.productId &&
          item.variant?.size === input.variant?.size &&
          item.variant?.color === input.variant?.color &&
          item.variant?.material === input.variant?.material
        ) {
          return {
            ...item,
            quantity: input.quantity,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    return saveGuestCart({
      ...existing,
      items,
    });
  }

  /*
   * Authenticated cart
   */

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

/*
 * ============================================================
 * REMOVE CART ITEM
 * ============================================================
 */

export async function removeCartItem(
  input: RemoveCartItemInput,
): Promise<CartData> {
  const userId = await getAuthenticatedUserId();

  /*
   * Guest cart
   */
  if (!userId) {
    const existing = getGuestCart();

    const items = existing.items.filter(
      (item) =>
        !(
          item.productId === input.productId &&
          item.variant?.size === input.variant?.size &&
          item.variant?.color === input.variant?.color &&
          item.variant?.material === input.variant?.material
        ),
    );

    return saveGuestCart({
      ...existing,
      items,
    });
  }

  /*
   * Authenticated cart
   */

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

/*
 * ============================================================
 * CLEAR CART
 * ============================================================
 */

export async function clearCart(): Promise<void> {
  const userId = await getAuthenticatedUserId();

  /*
   * Guest cart
   */
  if (!userId) {
    clearGuestCart();

    return;
  }

  await clientApiFetch<BackendResponse<null>>(
    `/cart?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
}

/*
 * ============================================================
 * MERGE GUEST CART
 * ============================================================
 *
 * Called after a guest signs in.
 *
 * Guest items are added to the user's backend cart.
 * The local guest cart is cleared only after the merge succeeds.
 */

export async function mergeGuestCart(): Promise<CartData | null> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const guestCart = getGuestCart();

  if (guestCart.items.length === 0) {
    return getCart();
  }

  /*
   * Add each guest item to the authenticated backend cart.
   *
   * The backend already handles merging quantities
   * for matching product + variant combinations.
   */

  for (const item of guestCart.items) {
    await clientApiFetch<BackendResponse<CartData>>("/cart/items", {
      method: "POST",

      body: JSON.stringify({
        userId,
        productId: item.productId,
        quantity: item.quantity,
        priceEach: item.priceEach,
        currency: item.currency ?? "INR",
        variant: item.variant,
      }),
    });
  }

  clearGuestCart();

  return getCart();
}
