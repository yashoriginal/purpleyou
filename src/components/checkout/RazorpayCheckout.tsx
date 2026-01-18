"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineCheck } from "react-icons/hi";
import * as orderService from "@/services/order.service";
import { CartItem } from "@/context/CartContext";

interface AddressForm {
  fullName: string;
  mobileNumber: string;
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  email: string;
}

interface CheckoutProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  address: AddressForm;
  totalPrice: number;
  shippingCost: number;
  gst: number;
  onSuccess?: () => void;
}

type PaymentMethod = "upi" | "card" | "netbanking" | null;

export default function RazorpayCheckout({
  amount,
  orderId,
  customerEmail,
  customerPhone,
  items,
  address,
  totalPrice,
  shippingCost,
  gst,
  onSuccess,
}: CheckoutProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load Razorpay. Please refresh and try again.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const gst = Math.round(amount * 0.18);
  const shippingCost = amount >= 3000 ? 0 : 99;
  const total = amount + shippingCost + gst;

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }

    if (selectedMethod === "upi" && !upiId.trim()) {
      setError("Please enter UPI ID");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total, // Total amount in rupees (will be converted to paise on backend)
          currency: "INR",
          receipt: `receipt_${orderId}`,
          notes: {
            orderId,
            paymentMethod: selectedMethod,
          },
          customerEmail,
          customerPhone,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(
          errorData.error || "Failed to create order. Please try again."
        );
      }

      const { order } = await orderResponse.json();

      // Step 2: Open Razorpay checkout
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public key
        amount: order.amount, // Amount in paise
        currency: "INR",
        name: "AURA New York",
        description: "Premium Jewelry Purchase",
        order_id: order.id,
        handler: async (response: any) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: order.id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(
                errorData.error || "Payment verification failed"
              );
            }

            // Payment successful
            if (onSuccess) {
              onSuccess();
            }

            // Redirect to order confirmation
            const params = new URLSearchParams({
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              email: customerEmail,
              amount: total.toLocaleString("en-IN"),
            });

            router.push(`/order-confirmation?${params.toString()}`);
          } catch (verifyError) {
            const errorMessage =
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed";
            setError(errorMessage);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerEmail,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          orderId,
          paymentMethod: selectedMethod,
        },
        theme: {
          color: "#5540b7",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError("Payment cancelled. Please try again.");
          },
        },
      };

      // Map selected method to Razorpay method
      if (selectedMethod === "upi") {
        (razorpayOptions as any).method = "upi";
        (razorpayOptions as any).upi_link = true;
      } else if (selectedMethod === "card") {
        (razorpayOptions as any).method = "card";
      } else if (selectedMethod === "netbanking") {
        (razorpayOptions as any).method = "netbanking";
      }

      const razorpay = new window.Razorpay(razorpayOptions);

      razorpay.on("payment.failed", (response: any) => {
        setError(
          `Payment failed: ${response.error?.description || "Unknown error"}`
        );
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!razorpayLoaded) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6b6b6b]">Loading payment gateway...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Payment Methods */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
          Select Payment Method
        </h3>

        {/* UPI */}
        <label className="block">
          <input
            type="radio"
            name="payment-method"
            value="upi"
            checked={selectedMethod === "upi"}
            onChange={() => setSelectedMethod("upi")}
            className="hidden"
          />
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === "upi"
                ? "border-[#5540b7] bg-[#D3C9FF]/10"
                : "border-[#e6e0da] hover:border-[#5540b7]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#111111]">UPI Payments</span>
              {selectedMethod === "upi" && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b] mb-3">
              Google Pay, PhonePe, Paytm, BHIM, WhatsApp Pay & more
            </p>
          </div>
        </label>

        {/* Cards */}
        <label className="block">
          <input
            type="radio"
            name="payment-method"
            value="card"
            checked={selectedMethod === "card"}
            onChange={() => setSelectedMethod("card")}
            className="hidden"
          />
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === "card"
                ? "border-[#5540b7] bg-[#D3C9FF]/10"
                : "border-[#e6e0da] hover:border-[#5540b7]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#111111]">
                Credit/Debit Card
              </span>
              {selectedMethod === "card" && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b] mb-3">
              Visa, Mastercard, RuPay, AmEx & all major cards
            </p>
          </div>
        </label>

        {/* Net Banking */}
        <label className="block">
          <input
            type="radio"
            name="payment-method"
            value="netbanking"
            checked={selectedMethod === "netbanking"}
            onChange={() => setSelectedMethod("netbanking")}
            className="hidden"
          />
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === "netbanking"
                ? "border-[#5540b7] bg-[#D3C9FF]/10"
                : "border-[#e6e0da] hover:border-[#5540b7]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#111111]">Net Banking</span>
              {selectedMethod === "netbanking" && (
                <HiOutlineCheck className="w-5 h-5 text-[#5540b7]" />
              )}
            </div>
            <p className="text-xs text-[#6b6b6b]">
              ICICI, HDFC, Axis, IDBI, SBI & all major Indian banks
            </p>
          </div>
        </label>

        {/* COD Info */}
        <div className="p-4 bg-[#f8f5f2] rounded-lg border border-[#e6e0da]">
          <p className="text-xs text-[#6b6b6b] flex items-start gap-2">
            <span className="text-[#5540b7] font-bold mt-0.5">ℹ</span>
            <span>Cash on Delivery available on select locations</span>
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || !selectedMethod || !razorpayLoaded}
        className={`w-full py-4 text-sm font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
          isProcessing || !selectedMethod || !razorpayLoaded
            ? "bg-[#d0c0e0] text-[#6b6b6b] cursor-not-allowed"
            : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
        }`}
      >
        <span className="text-base">🔒</span>
        {isProcessing ? "Processing Payment..." : `Pay ₹${total.toLocaleString("en-IN")}`}
      </button>

      {/* Security Note */}
      <p className="text-xs text-[#6b6b6b] text-center mt-4">
        🔒 Secure payment powered by Razorpay
      </p>
    </div>
  );
}

// Type augmentation for Razorpay SDK
declare global {
  interface Window {
    Razorpay: any;
  }
}
