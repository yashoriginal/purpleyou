import type { User } from "@/types/user";

export interface BackendResponse<T> {
  data: T;
  success: boolean;
  statusCode: number;
  error: string | null;
}

export interface LoginOrRegisterRequest {
  mobile: string;
}

export type LoginOrRegisterData = string | User;

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface ResendOtpRequest {
  mobile: string;
}
