import type { RootState } from "@/store/store";

export const selectCartData = (state: RootState) => state.cart.data;

export const selectCartItems = (state: RootState) =>
  state.cart.data?.items ?? [];

export const selectCartTotalItems = (state: RootState) =>
  state.cart.data?.totalItems ?? 0;

export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.data?.totalQuantity ?? 0;

export const selectCartSubtotal = (state: RootState) =>
  state.cart.data?.subtotal ?? 0;

export const selectCartCurrency = (state: RootState) =>
  state.cart.data?.currency;

export const selectCartIsLoading = (state: RootState) => state.cart.isLoading;

export const selectCartError = (state: RootState) => state.cart.error;

export const selectCartIsMutating = (state: RootState) => state.cart.isMutating;
