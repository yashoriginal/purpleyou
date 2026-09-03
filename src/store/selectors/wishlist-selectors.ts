import type { RootState } from "@/store/store";

export const selectWishlistIds = (state: RootState) =>
  state.wishlist.productIds;

export const selectWishlistCount = (state: RootState) =>
  state.wishlist.productIds.length;

export const selectWishlistHydrated = (state: RootState) =>
  state.wishlist.hydrated;
