"use client";

import { useSyncExternalStore } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectWishlistHydrated,
  selectWishlistIds,
} from "@/store/selectors/wishlist-selectors";

import { toggleWishlist } from "@/store/slices/wishlist-slice";

interface WishlistButtonProps {
  productId: string;
}

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,

    // Client snapshot
    () => true,

    // Server + first hydration snapshot
    () => false,
  );
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const dispatch = useAppDispatch();

  const productIds = useAppSelector(selectWishlistIds);

  const hydrated = useAppSelector(selectWishlistHydrated);

  const hasHydratedClient = useHasHydratedClient();

  const isWishlisted = productIds.includes(productId);

  /*
   * Server and first client render must match.
   *
   * The wishlist is restored from localStorage
   * by WishlistInitializer, so don't render
   * saved state until hydration has completed.
   */
  const renderedIsWishlisted =
    hasHydratedClient && hydrated ? isWishlisted : false;

  return (
    <button
      type="button"
      aria-label={
        renderedIsWishlisted ? "Remove from wishlist" : "Add to wishlist"
      }
      aria-pressed={renderedIsWishlisted}
      onClick={() => dispatch(toggleWishlist(productId))}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)]
        bg-[var(--background)]
        transition
        hover:scale-105
      "
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        fill={renderedIsWishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    </button>
  );
}
