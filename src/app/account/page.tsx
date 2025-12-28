"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/lib/data";
import {
  sendOTP,
  verifyOTP,
  fetchUserCart,
  fetchUserWishlist,
  saveProfile,
} from "@/lib/dummyApi";

type AuthStep = "phone" | "otp" | "profile" | "success";

export default function AccountPage() {
  const router = useRouter();
  const { isLoggedIn, user, login, logout } = useAuth();
  const { addToCart, clearCart } = useCart();
  const { addToWishlist, clearWishlist } = useWishlist();

  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Auto-redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/collections/all");
    }
  }, [isLoggedIn, router]);

  // Handle OTP sending
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(phoneNumber);
      if (result.sent) {
        setStep("otp");
        setError("");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification and login
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate OTP
    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(phoneNumber, otp);
      if (result.isValid) {
        // Check if new user
        if (result.new_user) {
          // New user - show profile collection screen
          setIsNewUser(true);
          setStep("profile");
          setError("");
        } else {
          // Existing user - fetch cart/wishlist and login
          await handleExistingUserLogin();
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to login existing user with cart/wishlist
  const handleExistingUserLogin = async () => {
    try {
      // Login successful - set auth state
      login({
        phoneNumber: phoneNumber,
        name: `User ${phoneNumber.slice(-4)}`,
      });

      // Fetch and populate cart data
      try {
        const cartData = await fetchUserCart(phoneNumber);
        clearCart(); // Clear existing cart
        cartData.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            addToCart(product, item.selectedVariants, item.quantity);
          }
        });
      } catch (cartErr) {
        console.error("Failed to load cart:", cartErr);
      }

      // Fetch and populate wishlist data
      try {
        const wishlistData = await fetchUserWishlist(phoneNumber);
        clearWishlist(); // Clear existing wishlist
        wishlistData.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            addToWishlist(product);
          }
        });
      } catch (wishlistErr) {
        console.error("Failed to load wishlist:", wishlistErr);
      }

      setStep("success");
      setError("");
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error(err);
    }
  };

  // Handle profile submission for new users
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!name || !name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!pincode || pincode.length < 6) {
      setError("Please enter a valid pincode (minimum 6 digits)");
      return;
    }

    setIsLoading(true);
    try {
      // Save profile to backend
      const saveResult = await saveProfile(phoneNumber, name, pincode);
      if (saveResult.saved) {
        // Login with profile data
        login({
          phoneNumber: phoneNumber,
          name: name,
          pincode: pincode,
        });

        setStep("success");
        setError("");
      } else {
        setError(saveResult.message);
      }
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    clearCart();
    clearWishlist();
    setPhoneNumber("");
    setOtp("");
    setStep("phone");
  };

  // Show success screen after login
  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full px-4 py-8 text-center">
          <div className="w-16 h-16 bg-[#D3C9FF] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-[#5540b7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-[#111111] mb-3">
            Login Successful!
          </h2>
          <p className="text-[#6b6b6b] font-light mb-2">
            Welcome back to PURPLE YOU
          </p>
          <p className="text-sm text-[#6b6b6b] font-light mb-8">
            +91 {phoneNumber}
          </p>

          {/* Cart and Wishlist loaded message */}
          <div className="bg-[#f8f5f2] rounded-lg p-4 mb-8 text-left space-y-2">
            <p className="text-sm font-medium text-[#111111]">
              ✓ Cart loaded successfully
            </p>
            <p className="text-sm font-medium text-[#111111]">
              ✓ Wishlist loaded successfully
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/collections/all">
              <button className="w-full bg-[#5540b7] text-white py-3 font-medium uppercase tracking-wide hover:bg-[#3d2d7f] transition-colors">
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full border border-[#111111] text-[#111111] py-3 font-medium uppercase tracking-wide hover:bg-[#111111] hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-2">
            PURPLE YOU
          </h1>
          <p className="text-[#6b6b6b] font-light">Sign in to your account</p>
        </div>


        {/* Form */}
        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-3">
                Phone Number
              </label>
              <div className="flex items-center border border-[#e6e0da] rounded">
                <span className="px-4 text-[#6b6b6b]">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setPhoneNumber(value);
                  }}
                  className="flex-1 px-4 py-3 outline-none text-[#111111] placeholder-[#6b6b6b]"
                  required
                />
              </div>
              <p className="text-xs text-[#6b6b6b] mt-2 font-light">
                We'll send you a One-Time Password to verify your number
              </p>

              {/* Test Credentials Help Text */}
              <div className="mt-4 p-3 bg-[#f8f5f2] rounded text-xs text-[#6b6b6b]">
                <p className="font-medium text-[#111111] mb-1">
                  Test Credentials:
                </p>
                <p>Phone: 9999999999</p>
                <p>OTP: 9999</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>

            {/* Continue as Guest */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e6e0da]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6b6b6b]">OR</span>
              </div>
            </div>

            <Link href="/collections/all">
              <button
                type="button"
                className="w-full border border-[#111111] text-[#111111] py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-colors"
              >
                Continue as Guest
              </button>
            </Link>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-3">
                Enter OTP
              </label>
              <p className="text-sm text-[#6b6b6b] font-light mb-4">
                Enter the 4-digit OTP sent to <strong>+91 {phoneNumber}</strong>
              </p>
              <input
                type="text"
                placeholder="0000"
                maxLength={4}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setOtp(value);
                }}
                className="w-full px-4 py-4 border border-[#e6e0da] text-2xl text-center letter-spacing tracking-widest outline-none focus:border-[#5540b7] focus:ring-1 focus:ring-[#5540b7]"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="w-full text-[#5540b7] py-3 text-sm font-medium uppercase tracking-wider hover:underline"
            >
              ← Back to Phone Number
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
