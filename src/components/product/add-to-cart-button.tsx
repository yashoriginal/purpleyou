"use client";

import { useSyncExternalStore } from "react";

import type { CartItemVariant } from "@/types/cart";

import { addItemToCart } from "@/store/slices/cart-slice";

import { openAuth, openCart } from "@/store/slices/ui-slice";

import { selectAuthStatus } from "@/store/selectors/auth-selectors";

import { selectCartIsMutating } from "@/store/selectors/cart-selectors";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface AddToCartButtonProps {
  productId: string;
  priceEach: number;

  quantity?: number;

  currency?: string;

  variant?: CartItemVariant;

  disabled?: boolean;

  className?: string;
}

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

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

  const authStatus = useAppSelector(selectAuthStatus);

  const isMutating = useAppSelector(selectCartIsMutating);

  const hasHydratedClient = useHasHydratedClient();

  const isAuthenticated = hasHydratedClient && authStatus === "authenticated";

  const isAuthLoading =
    !hasHydratedClient || authStatus === "idle" || authStatus === "restoring";

  /*
   * Keep the server render and first client render identical.
   *
   * Cart/auth state may already be restored from localStorage
   * before this component itself hydrates.
   */
  const renderedIsMutating = hasHydratedClient ? isMutating : false;

  const handleAddToCart = async () => {
    if (!hasHydratedClient || isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      dispatch(openAuth());

      return;
    }

    try {
      await dispatch(
        addItemToCart({
          productId,
          quantity,
          priceEach,
          currency,
          variant,
        }),
      ).unwrap();

      dispatch(openCart());
    } catch {
      // Redux cart state already contains
      // the API error.
    }
  };

  const buttonDisabled =
    disabled ||
    renderedIsMutating ||
    isAuthLoading ||
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
        flex min-h-14
        w-full
        items-center
        justify-center
        bg-[var(--foreground)]
        px-6 py-4
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
