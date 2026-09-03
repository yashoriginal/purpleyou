import { clientApiFetch } from "@/services/client-api";

import type { BackendResponse, LoginOrRegisterData } from "@/types/auth";

import type { User } from "@/types/user";

const AUTH_USER_STORAGE_KEY = "auth_user";

export function normalizeMobileNumber(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (value.startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }

  throw new Error("Enter a valid mobile number.");
}

function saveCurrentUser(user: User): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Unable to save authenticated user.", error);
  }
}

function readCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!value) {
      return null;
    }

    const user = JSON.parse(value) as User;

    if (!user?.userId && !user?.mobile) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unable to restore authenticated user.", error);

    localStorage.removeItem(AUTH_USER_STORAGE_KEY);

    return null;
  }
}

function clearCurrentUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_USER_STORAGE_KEY);

  /*
   * Remove legacy auth values too.
   *
   * This prevents old/stale PurpleYou
   * authentication state from affecting V2.
   */
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
}

export async function loginOrRegister(mobile: string): Promise<string> {
  const formattedMobile = normalizeMobileNumber(mobile);

  const response = await clientApiFetch<BackendResponse<LoginOrRegisterData>>(
    "/users/auth/login-or-register",
    {
      method: "POST",

      body: JSON.stringify({
        mobile: formattedMobile,
      }),
    },
  );

  if (!response.success) {
    throw new Error(response.error ?? "Unable to send OTP.");
  }

  return formattedMobile;
}

export async function verifyOtp(mobile: string, otp: string): Promise<User> {
  const formattedMobile = normalizeMobileNumber(mobile);

  const trimmedOtp = otp.trim();

  if (!trimmedOtp) {
    throw new Error("OTP is required.");
  }

  if (!/^\d{4}$/.test(trimmedOtp)) {
    throw new Error("Enter the 4-digit OTP.");
  }

  const response = await clientApiFetch<BackendResponse<User>>(
    "/users/auth/verifyOTP",
    {
      method: "POST",

      body: JSON.stringify({
        mobile: formattedMobile,
        otp: trimmedOtp,
      }),
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.error ?? "OTP verification failed.");
  }

  /*
   * Legacy PurpleYou session behavior:
   *
   * Keep the authenticated user in
   * localStorage so V2 can restore the
   * session without requiring /users/me.
   */
  saveCurrentUser(response.data);

  return response.data;
}

export async function resendOtp(mobile: string): Promise<void> {
  const formattedMobile = normalizeMobileNumber(mobile);

  const response = await clientApiFetch<BackendResponse<string>>(
    "/users/auth/resendOTP",
    {
      method: "POST",

      body: JSON.stringify({
        mobile: formattedMobile,
      }),
    },
  );

  if (!response.success) {
    throw new Error(response.error ?? "Unable to resend OTP.");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return readCurrentUser();
}

export async function logout(): Promise<void> {
  /*
   * V2 currently follows the original
   * PurpleYou frontend session approach.
   *
   * No /users/me or cookie-based session
   * is required for restoring auth.
   */
  clearCurrentUser();
}
