"use client";

import { useState } from "react";
import Link from "next/link";

type AuthStep = "phone" | "otp" | "success";

export default function AccountPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Mock API call to send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1500);
  };

  // Mock API call to verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate OTP
    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1500);
  };

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
            {isRegister ? "Account Created!" : "Login Successful!"}
          </h2>
          <p className="text-[#6b6b6b] font-light mb-8">
            Welcome to PURPLE YOU. Your{" "}
            {isRegister ? "account has been created" : "login was successful"}.
          </p>
          <div className="space-y-3">
            <Link href="/collections/all">
              <button className="w-full bg-[#5540b7] text-white py-3 font-medium uppercase tracking-wide hover:bg-[#3d2d7f] transition-colors">
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={() => {
                setStep("phone");
                setPhoneNumber("");
                setOtp("");
                setUserName("");
                setIsRegister(false);
              }}
              className="w-full border border-[#111111] text-[#111111] py-3 font-medium uppercase tracking-wide hover:bg-[#111111] hover:text-white transition-colors"
            >
              Sign In with Different Number
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      {/* Header */}
      <div className="bg-white border-b border-[#e6e0da]">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/">
            <span className="text-lg font-light text-[#5540b7] tracking-wide">
              PURPLE YOU
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          {/* Sign In / Register Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
              className={`flex-1 py-3 font-medium tracking-wide uppercase text-sm border-b-2 transition-colors ${
                !isRegister
                  ? "border-[#5540b7] text-[#5540b7]"
                  : "border-transparent text-[#6b6b6b]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
              className={`flex-1 py-3 font-medium tracking-wide uppercase text-sm border-b-2 transition-colors ${
                isRegister
                  ? "border-[#5540b7] text-[#5540b7]"
                  : "border-transparent text-[#6b6b6b]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Phone Number Step */}
          {step === "phone" && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wide mb-2">
                  Phone Number
                </label>
                <div className="flex items-center border border-[#e6e0da]">
                  <span className="px-4 text-[#6b6b6b] font-light">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setPhoneNumber(value);
                    }}
                    maxLength={10}
                    className="flex-1 px-4 py-3 bg-white focus:outline-none font-light"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wide mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e6e0da] focus:outline-none font-light"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-light">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 font-medium uppercase tracking-wide transition-colors ${
                  isLoading
                    ? "bg-[#D3C9FF] text-[#6b6b6b] cursor-not-allowed"
                    : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
                }`}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>

              <p className="text-center text-xs text-[#6b6b6b] font-light">
                We'll send you a One-Time Password to verify your number
              </p>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <p className="text-sm text-[#6b6b6b] font-light mb-4">
                  Enter the 4-digit OTP sent to{" "}
                  <strong>+91 {phoneNumber}</strong>
                </p>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wide mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  placeholder="0000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setOtp(value);
                  }}
                  maxLength={4}
                  className="w-full px-4 py-3 border border-[#e6e0da] text-center text-2xl tracking-widest focus:outline-none focus:border-[#5540b7]"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-light">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 font-medium uppercase tracking-wide transition-colors ${
                  isLoading
                    ? "bg-[#D3C9FF] text-[#6b6b6b] cursor-not-allowed"
                    : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-center text-sm text-[#5540b7] font-light hover:underline"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#e6e0da]"></div>
            <span className="text-xs text-[#6b6b6b] font-light">OR</span>
            <div className="flex-1 h-px bg-[#e6e0da]"></div>
          </div>

          {/* Continue as Guest */}
          <Link href="/collections/all">
            <button className="w-full border border-[#e6e0da] text-[#111111] py-3 font-medium uppercase tracking-wide hover:bg-[#f8f5f2] transition-colors">
              Continue as Guest
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
