"use client";

import { useSyncExternalStore } from "react";

import type { CartItemVariant } from "@/types/cart";

import { addItemToCart } from "@/store/slices/cart-slice";

import { openCart } from "@/store/slices/ui-slice";

import { selectCartIsMutating } from "@/store/selectors/cart-selectors";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

/* =========================================================
   TYPES
========================================================= */

interface AddToCartButtonProps {
  productId: string;
  priceEach: number;

  quantity?: number;

  currency?: string;

  variant?: CartItemVariant;

  disabled?: boolean;

  className?: string;
}

/* =========================================================
   HYDRATION
========================================================= */

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,

    // Browser after hydration
    () => true,

    // Server + first browser hydration render
    () => false,
  );
}

/* =========================================================
   ADD TO CART BUTTON
========================================================= */

export function AddToCartButton({
  productId,
  priceEach,
  quantity = 1,
  currency = "INR",
  variant,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();

  const isMutating = useAppSelector(selectCartIsMutating);

  const hasHydratedClient = useHasHydratedClient();

  /*
   * Redux cart state may be restored from browser
   * persistence before this component hydrates.
   *
   * Keep server + first client render identical.
   */
  const renderedIsMutating = hasHydratedClient ? isMutating : false;

  /* =======================================================
     ADD TO BAG
  ======================================================= */

  async function handleAddToCart() {
    if (!hasHydratedClient) {
      return;
    }

    if (!productId || priceEach <= 0) {
      return;
    }

    try {
      /*
       * IMPORTANT:
       *
       * Adding to cart does NOT require authentication.
       *
       * Guest users and authenticated users use the same
       * cart action here.
       *
       * Authentication will only be required later when
       * the customer attempts to continue toward payment.
       */
      await dispatch(
        addItemToCart({
          productId,
          quantity,
          priceEach,
          currency,
          variant,
        }),
      ).unwrap();

      /*
       * Open the shopping bag after a successful add
       * for both guests and authenticated customers.
       */
      dispatch(openCart());
    } catch {
      /*
       * Redux cart state already contains the cart error.
       *
       * Do not open authentication here.
       */
    }
  }

  /* =======================================================
     BUTTON STATE
  ======================================================= */

  const buttonDisabled =
    disabled ||
    !hasHydratedClient ||
    renderedIsMutating ||
    !productId ||
    priceEach <= 0;

  return (
    <button
      type="button"
      disabled={buttonDisabled}
      onClick={() => {
        void handleAddToCart();
      }}
      className={`
        flex
        min-h-14
        w-full
        items-center
        justify-center

        bg-[var(--foreground)]

        px-6
        py-4

        text-sm
        font-medium
        uppercase
        tracking-[0.18em]
        text-[var(--background)]

        transition-opacity

        hover:opacity-85

        disabled:cursor-not-allowed
        disabled:opacity-40

        ${className}
      `}
    >
      {renderedIsMutating ? "Adding..." : "Add to Bag"}
    </button>
  );
}
