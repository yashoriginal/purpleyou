"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  AuthServiceError,
  authService,
  type AddressObject,
} from "@/services/auth.service";

type AuthStep = "phone" | "otp" | "profile" | "success";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isLoggedIn,
    verifyOTP: contextVerifyOTP,
    register: contextRegister,
  } = useAuth();

  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Auto-redirect after successful login
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  // Auto-redirect after success screen is shown (after 2 seconds)
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  // Handle Login or Register - Initial step
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
      const formattedMobile = `+91${phoneNumber}`;
      const response = await authService.loginOrRegister(formattedMobile);

      // Check if response data is a string (existing user) or object (new user)
      if (typeof response.data === "string") {
        // Existing user - UUID returned, mark as existing and show OTP form
        setIsNewUser(false);
        setStep("otp");
      } else if (
        typeof response.data === "object" &&
        response.data &&
        "isVerified" in response.data
      ) {
        // New user - user object returned with isVerified=false
        // Still show OTP form, not profile form
        setIsNewUser(true);
        setStep("otp");
      } else {
        throw new Error("Unexpected response format from login endpoint");
      }

      setError("");
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else {
        setError("Failed to process login. Please try again.");
      }
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
      const formattedMobile = `+91${phoneNumber}`;

      // Call context's verifyOTP which updates isLoggedIn and saves tokens
      await contextVerifyOTP(formattedMobile, otp);

      // If we reach here, OTP was verified successfully
      if (isNewUser) {
        // New user - show complete profile form
        setStep("profile");
      } else {
        // Existing user - show success screen and redirect
        setStep("success");
      }

      setError("");
    } catch (err) {
      if (err instanceof AuthServiceError) {
        // Check if it's a "not found" error (new user)
        if (err.statusCode === 401 && err.message.includes("does not exist")) {
          setError("Mobile number not found. Please register first.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
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

    if (!address || !address.trim()) {
      setError("Please enter your address");
      return;
    }

    if (!area || !area.trim()) {
      setError("Please enter your area/city");
      return;
    }

    setIsLoading(true);
    try {
      // Get geolocation for API request
      const position = await new Promise<GeolocationCoordinates>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          () => {
            // If geolocation fails, use default coordinates
            console.warn(
              "Geolocation not available, using default coordinates",
            );
            resolve({
              latitude: 0,
              longitude: 0,
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            } as unknown as GeolocationCoordinates);
          },
        );
      });

      // Step 1: Register the user
      await contextRegister({
        userName: name,
        mobile: `+91${phoneNumber}`,
        latitude: position.latitude.toString(),
        longitude: position.longitude.toString(),
        pincode: pincode,
        address: address,
        area: area,
      });

      // Step 2: Create address object with the entered address as default
      const primaryAddress: AddressObject = {
        addressId: `addr_primary_${Date.now()}`,
        label: "Primary Address",
        address: address,
        area: area,
        pincode: pincode,
        latitude: position.latitude.toString(),
        longitude: position.longitude.toString(),
        isDefault: true,
      };

      // Step 3: Call update-user-details with addresses array
      await authService.updateUserDetails({
        mobile: `+91${phoneNumber}`,
        userName: name,
        address: address,
        pincode: pincode,
        latitude: position.latitude.toString(),
        longitude: position.longitude.toString(),
        area: area,
        addresses: [primaryAddress],
      });

      // Show success screen briefly before redirecting
      setStep("success");
      setError("");
    } catch (err) {
      const errorMessage =
        err instanceof AuthServiceError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create account. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success screen after login
  if (step === "success") {
    const isNew = isNewUser;

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
            {isNew ? "Account Created!" : "Welcome Back!"}
          </h2>
          <p className="text-[#6b6b6b] font-light mb-2">
            Welcome to Purple You
          </p>
          <p className="text-sm text-[#6b6b6b] font-light mb-8">
            +91 {phoneNumber}
          </p>

          {/* Success message */}
          <div className="bg-[#f8f5f2] rounded-lg p-4 mb-8 text-left space-y-2">
            {isNew ? (
              <>
                <p className="text-sm font-medium text-[#111111]">
                  ✓ Account created successfully
                </p>
                <p className="text-sm font-medium text-[#111111]">
                  ✓ Profile information saved
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-[#111111]">
                  ✓ Cart loaded successfully
                </p>
                <p className="text-sm font-medium text-[#111111]">
                  ✓ Wishlist loaded successfully
                </p>
              </>
            )}
          </div>

          <p className="text-xs text-[#6b6b6b] mb-6 font-light">
            Redirecting to your account...
          </p>

          <div className="space-y-3">
            <Link href="/account">
              <button className="w-full bg-[#5540b7] text-white py-3 font-medium uppercase tracking-wide hover:bg-[#3d2d7f] transition-colors rounded-lg">
                Go to Account
              </button>
            </Link>
            <Link href="/collections/all">
              <button className="w-full border border-[#111111] text-[#111111] py-3 font-medium uppercase tracking-wide hover:bg-[#111111] hover:text-white transition-colors rounded-lg">
                Continue Shopping
              </button>
            </Link>
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
            Purple You
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
              <div className="flex items-center border border-[#e6e0da] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5540b7] focus-within:border-transparent">
                <span className="px-4 text-[#6b6b6b] font-medium">+91</span>
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

              {/* Info Help Text */}
              <div className="mt-4 p-3 bg-[#f8f5f2] rounded-lg text-xs text-[#6b6b6b]">
                <p className="font-medium text-[#111111] mb-2">
                  Authentication Flow:
                </p>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Existing Users:</span> Enter
                    phone number and verify with OTP
                  </p>
                  <p>
                    <span className="font-medium">New Users:</span> First
                    register using the signup flow, then use OTP to login
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
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
                className="w-full border border-[#111111] text-[#111111] py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-colors rounded-lg"
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
                className="w-full px-4 py-4 border border-[#e6e0da] text-2xl text-center letter-spacing tracking-widest outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] rounded-lg"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
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

        {/* Profile Collection Step (for new users) */}
        {step === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-[#111111] mb-2">
                Complete Your Profile
              </h2>
              <p className="text-sm text-[#6b6b6b] font-light">
                Help us know you better to personalize your experience
              </p>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-3">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7]"
                required
              />
            </div>

            {/* Pincode Input */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-3">
                Pincode
              </label>
              <input
                type="text"
                placeholder="Enter your 6-digit pincode"
                maxLength={10}
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPincode(value);
                }}
                className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7]"
                required
              />
              <p className="text-xs text-[#6b6b6b] mt-2 font-light">
                This helps us provide accurate shipping estimates
              </p>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-3">
                Address
              </label>
              <textarea
                placeholder="Enter your complete address (street, building, etc.)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7] resize-none"
                required
              />
            </div>

            {/* Area/City Input */}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-3">
                Area / City
              </label>
              <input
                type="text"
                placeholder="e.g., T Nagar, Chennai"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 border border-[#e6e0da] rounded-lg outline-none focus:border-[#5540b7] focus:ring-2 focus:ring-[#5540b7]"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep("otp");
                setName("");
                setPincode("");
                setAddress("");
                setArea("");
                setError("");
              }}
              className="w-full text-[#5540b7] py-3 text-sm font-medium uppercase tracking-wider hover:underline"
            >
              ← Back to OTP
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
