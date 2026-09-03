"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { hydrateWishlist } from "@/store/slices/wishlist-slice";

import {
  selectWishlistHydrated,
  selectWishlistIds,
} from "@/store/selectors/wishlist-selectors";

const STORAGE_KEY = "purpleyou-wishlist";

export function WishlistInitializer() {
  const dispatch = useAppDispatch();

  const productIds = useAppSelector(selectWishlistIds);

  const hydrated = useAppSelector(selectWishlistHydrated);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        dispatch(hydrateWishlist([]));

        return;
      }

      const parsed: unknown = JSON.parse(stored);

      dispatch(
        hydrateWishlist(
          Array.isArray(parsed)
            ? parsed.filter(
                (value): value is string => typeof value === "string",
              )
            : [],
        ),
      );
    } catch {
      dispatch(hydrateWishlist([]));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  }, [hydrated, productIds]);

  return null;
}
