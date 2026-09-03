import type { RootState } from "@/store/store";

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthMobile = (state: RootState) => state.auth.mobile;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === "authenticated" && Boolean(state.auth.user);

export const selectIsAuthLoading = (state: RootState) =>
  state.auth.status === "restoring" ||
  state.auth.status === "requestingOtp" ||
  state.auth.status === "verifying" ||
  state.auth.status === "loggingOut";

export const selectIsResendingOtp = (state: RootState) =>
  state.auth.isResendingOtp;
