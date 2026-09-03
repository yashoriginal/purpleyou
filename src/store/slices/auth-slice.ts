import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as authService from "@/services/auth.service";

import type { User } from "@/types/user";

export type AuthStatus =
  | "idle"
  | "restoring"
  | "guest"
  | "requestingOtp"
  | "awaitingOtp"
  | "verifying"
  | "authenticated"
  | "loggingOut";

interface AuthState {
  user: User | null;

  mobile: string | null;

  status: AuthStatus;

  isResendingOtp: boolean;

  error: string | null;
}

const initialState: AuthState = {
  user: null,
  mobile: null,

  status: "idle",

  isResendingOtp: false,

  error: null,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (mobile: string, { rejectWithValue }) => {
    try {
      return await authService.loginOrRegister(mobile);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    {
      mobile,
      otp,
    }: {
      mobile: string;
      otp: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await authService.verifyOtp(mobile, otp);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (mobile: string, { rejectWithValue }) => {
    try {
      await authService.resendOtp(mobile);

      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError(state) {
      state.error = null;
    },

    resetOtpFlow(state) {
      state.mobile = null;
      state.error = null;

      if (!state.user) {
        state.status = "guest";
      }
    },
  },

  extraReducers: (builder) => {
    builder

      // Restore session

      .addCase(restoreSession.pending, (state) => {
        state.status = "restoring";
        state.error = null;
      })

      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;

        state.status = action.payload ? "authenticated" : "guest";

        state.mobile = action.payload?.mobile ?? null;

        state.error = null;
      })

      .addCase(restoreSession.rejected, (state, action) => {
        state.user = null;
        state.status = "guest";

        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Unable to restore session.";
      })

      // Request OTP

      .addCase(requestOtp.pending, (state) => {
        state.status = "requestingOtp";

        state.error = null;
      })

      .addCase(requestOtp.fulfilled, (state, action) => {
        state.mobile = action.payload;

        state.status = "awaitingOtp";

        state.error = null;
      })

      .addCase(requestOtp.rejected, (state, action) => {
        state.status = "guest";

        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Unable to send OTP.";
      })

      // Verify OTP

      .addCase(verifyOtp.pending, (state) => {
        state.status = "verifying";
        state.error = null;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.user = action.payload;

        state.mobile = action.payload.mobile;

        state.status = "authenticated";

        state.error = null;
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "awaitingOtp";

        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "OTP verification failed.";
      })

      // Resend OTP

      .addCase(resendOtp.pending, (state) => {
        state.isResendingOtp = true;
        state.error = null;
      })

      .addCase(resendOtp.fulfilled, (state) => {
        state.isResendingOtp = false;
      })

      .addCase(resendOtp.rejected, (state, action) => {
        state.isResendingOtp = false;

        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Unable to resend OTP.";
      })

      // Logout

      .addCase(logoutUser.pending, (state) => {
        state.status = "loggingOut";

        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.mobile = null;

        state.status = "guest";
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.status = state.user ? "authenticated" : "guest";

        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Logout failed.";
      });
  },
});

export const { clearAuthError, resetOtpFlow } = authSlice.actions;

export default authSlice.reducer;
