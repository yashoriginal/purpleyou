import { products } from "./data";
import { Product } from "@/types/product";

/**
 * Dummy API to fetch user's cart items
 * For the test user (9999999999), returns a pre-populated cart
 *
 * TODO: Replace with actual backend API call
 * Example:
 * const response = await fetch('/api/user/cart', {
 *   headers: { Authorization: `Bearer ${authToken}` }
 * });
 * return await response.json();
 */
export async function fetchUserCart(phoneNumber: string): Promise<
  Array<{
    productId: number;
    quantity: number;
    selectedVariants?: Record<string, string>;
  }>
> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return demo cart for test user
  if (phoneNumber === "9999999999") {
    return [
      {
        productId: 3, // Stackable Minimal Ring
        quantity: 1,
        selectedVariants: { Size: "8" },
      },
      {
        productId: 5, // Tennis Bracelet
        quantity: 1,
        selectedVariants: { Length: "7.5 inches" },
      },
    ];
  }

  // Empty cart for other users
  return [];
}

/**
 * Dummy API to fetch user's wishlist items
 * For the test user (9999999999), returns a pre-populated wishlist
 *
 * TODO: Replace with actual backend API call
 * Example:
 * const response = await fetch('/api/user/wishlist', {
 *   headers: { Authorization: `Bearer ${authToken}` }
 * });
 * return await response.json();
 */
export async function fetchUserWishlist(
  phoneNumber: string,
): Promise<Array<{ productId: number }>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return demo wishlist for test user
  if (phoneNumber === "9999999999") {
    return [
      { productId: 1 }, // Minimalist Stud Earrings
      { productId: 2 }, // Layering Necklace Set
      { productId: 4 }, // Statement Gold Hoop
      { productId: 6 }, // Gold Drop Earrings
    ];
  }

  // Empty wishlist for other users
  return [];
}

/**
 * Dummy API to validate OTP
 * Test credentials:
 * - Existing User: Phone 9999999999 + OTP 9999
 * - New User: Phone 8888888888 + OTP 8888
 *
 * TODO: Replace with actual backend OTP verification
 * Example:
 * const response = await fetch('/api/auth/verify-otp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ phoneNumber, otp }),
 * });
 * const { isValid, new_user, token } = await response.json();
 */
export async function verifyOTP(
  phoneNumber: string,
  otp: string,
): Promise<{ isValid: boolean; new_user: boolean; message: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Existing user test credentials
  if (phoneNumber === "9999999999" && otp === "9999") {
    return {
      isValid: true,
      new_user: false, // Existing user
      message: "OTP verified successfully",
    };
  }

  // New user test credentials
  if (phoneNumber === "8888888888" && otp === "8888") {
    return {
      isValid: true,
      new_user: true, // New user
      message: "OTP verified successfully",
    };
  }

  return {
    isValid: false,
    new_user: false,
    message: "Invalid OTP. Please try again.",
  };
}

/**
 * Dummy API to save user profile data (for new users)
 * Called after profile step collection (Name and Pincode)
 *
 * TODO: Replace with actual backend API
 * Example:
 * const response = await fetch('/api/auth/save-profile', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ phoneNumber, name, pincode }),
 * });
 * const { saved } = await response.json();
 */
export async function saveProfile(
  phoneNumber: string,
  name: string,
  pincode: string,
): Promise<{ saved: boolean; message: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validate inputs
  if (!name || !name.trim()) {
    return {
      saved: false,
      message: "Name is required",
    };
  }

  if (!pincode || pincode.length < 6) {
    return {
      saved: false,
      message: "Please enter a valid pincode",
    };
  }

  // In a real app, save to database
  return {
    saved: true,
    message: "Profile saved successfully",
  };
}

/**
 * Dummy API to send OTP to phone number
 *
 * Test credentials:
 * - Phone: any 10-digit number (e.g., 9042278688)
 * - Any OTP will be accepted for demo purposes
 *
 * TODO: Replace with actual backend OTP sending service
 * Example:
 * const response = await fetch('https://purpleoneservice.onrender.com/api/v1/users/auth/send-otp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ mobile: phoneNumber }),
 * });
 * const { sent } = await response.json();
 */
export async function sendOTP(
  phoneNumber: string,
): Promise<{ sent: boolean; message: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Accept any 10-digit phone number for demo
  if (phoneNumber && phoneNumber.length === 10) {
    return {
      sent: true,
      message: `OTP sent to +91${phoneNumber}. For testing: use any 4-digit OTP`,
    };
  }

  return {
    sent: false,
    message: "Invalid phone number",
  };
}
