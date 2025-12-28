import { Product, products } from "./data";

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
 * - Phone: 9999999999 (existing user)
 * - Phone: any other 10-digit (new user)
 * - OTP: 9999
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

  // Test credentials
  if (phoneNumber === "9999999999" && otp === "9999") {
    return {
      isValid: true,
      new_user: false, // Existing user - return false
      message: "OTP verified successfully",
    };
  }

  // Any other 10-digit number with correct OTP is a new user
  if (phoneNumber && phoneNumber.length === 10 && otp === "9999") {
    return {
      isValid: true,
      new_user: true, // New user - return true
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
 * TODO: Replace with actual backend OTP sending service
 * Example:
 * const response = await fetch('/api/auth/send-otp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ phoneNumber }),
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
      message: `OTP sent to +91${phoneNumber}. For testing: use OTP 9999`,
    };
  }

  return {
    sent: false,
    message: "Invalid phone number",
  };
}
