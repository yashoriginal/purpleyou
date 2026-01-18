"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  authService,
  AuthUser,
  RegisterRequest,
  AuthServiceError,
  UpdateUserDetailsRequest,
} from "@/services/auth.service";

export interface User {
  userId?: string;
  phoneNumber: string;
  name?: string;
  pincode?: string;
  userName?: string;
  mobile?: string;
  address?: string;
  area?: string;
  latitude?: string;
  longitude?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOTP: (mobile: string, otp: string) => Promise<void>;
  login: (phoneNumber: string) => Promise<void>;
  updateUserDetails: (data: UpdateUserDetailsRequest) => Promise<string>;
  logout: () => void;
  clearError: () => void;
  restoreSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Convert AuthUser from API to our User interface
 */
function convertAuthUserToUser(authUser: AuthUser): User {
  return {
    userId: authUser._id || authUser.id || authUser.userId,
    phoneNumber: authUser.mobile,
    name: authUser.userName,
    userName: authUser.userName,
    mobile: authUser.mobile,
    pincode: authUser.pincode,
    address: authUser.address,
    area: authUser.area,
    latitude: authUser.latitude,
    longitude: authUser.longitude,
    isAdmin: authUser.isAdmin,
    isVerified: authUser.isVerified,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Restore session from localStorage on mount
   */
  useEffect(() => {
    restoreSession();
  }, []);

  /**
   * Restore existing session from localStorage
   */
  const restoreSession = () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(convertAuthUserToUser(currentUser));
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
      // Clear corrupted session
      authService.logout();
    }
  };

  /**
   * Verify OTP and login user
   */
  const verifyOTP = async (mobile: string, otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const credentials = await authService.verifyOTP(mobile, otp);
      setUser(convertAuthUserToUser(credentials.user));
      setIsLoggedIn(true);

      // Trigger cart fetch after successful login
      // This will be picked up by CartContext through the userId change
      window.dispatchEvent(new Event("auth-success"));
    } catch (err) {
      const errorMessage =
        err instanceof AuthServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : "OTP verification failed. Please try again.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const credentials = await authService.register(data);
      setUser(convertAuthUserToUser(credentials.user));
      setIsLoggedIn(true);
    } catch (err) {
      const errorMessage =
        err instanceof AuthServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(phoneNumber);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(convertAuthUserToUser(currentUser));
        setIsLoggedIn(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof AuthServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Login failed. Please try again.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user details
   */
  const updateUserDetails = async (
    data: UpdateUserDetailsRequest,
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = await authService.updateUserDetails(data);

      // Update local user state with new data
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(convertAuthUserToUser(currentUser));
      }

      return userId;
    } catch (err) {
      const errorMessage =
        err instanceof AuthServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update profile. Please try again.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setIsLoading(true);
    try {
      authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    isLoading,
    error,
    register,
    verifyOTP,
    login,
    updateUserDetails,
    logout,
    clearError,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
