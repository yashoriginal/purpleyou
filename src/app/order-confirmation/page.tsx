"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState({
    orderId: searchParams.get("orderId") || `ORD-${Date.now()}`,
    email: searchParams.get("email") || "your@email.com",
    amount: searchParams.get("amount") || "10,029",
    status: "confirmed",
  });

  useEffect(() => {
    // If no order ID in URL, redirect to home after 10 seconds
    if (!searchParams.get("orderId")) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-[#f8f5f2] to-white border-b border-[#e6e0da]">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20 text-center">
          {/* Success Checkmark */}
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <HiOutlineCheck className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[#6b6b6b] font-light text-lg">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        {/* Order Details Card */}
        <div className="bg-[#f8f5f2] border border-[#e6e0da] rounded-lg p-8 mb-8">
          <h2 className="text-lg font-medium text-[#111111] mb-6 tracking-wide">
            Order Details
          </h2>

          <div className="space-y-6">
            {/* Order ID */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-xl">📦</div>
              <div className="flex-1">
                <p className="text-sm text-[#6b6b6b] font-medium mb-1">
                  Order Number
                </p>
                <p className="text-lg font-medium text-[#111111] font-mono">
                  {orderData.orderId}
                </p>
              </div>
            </div>

            {/* Order Status */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-xl">✅</div>
              <div className="flex-1">
                <p className="text-sm text-[#6b6b6b] font-medium mb-1">
                  Order Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-lg font-medium text-[#111111] capitalize">
                    {orderData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmation Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-[#5540b7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#6b6b6b] font-medium mb-1">
                  Confirmation Email Sent To
                </p>
                <p className="text-lg font-medium text-[#111111]">
                  {orderData.email}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t border-[#e6e0da] pt-6 mt-6">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-[#111111]">
                  Total Amount
                </p>
                <p className="text-2xl font-semibold text-[#5540b7]">
                  ₹{orderData.amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white border border-[#e6e0da] rounded-lg p-8 mb-8">
          <h2 className="text-lg font-medium text-[#111111] mb-6 tracking-wide">
            What's Next?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-lg font-semibold text-[#5540b7] flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-[#111111] mb-1">
                  Check Your Email
                </h3>
                <p className="text-sm text-[#6b6b6b]">
                  We've sent an order confirmation and shipping details to your
                  email address.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-lg font-semibold text-[#5540b7] flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-[#111111] mb-1">
                  Order Processing
                </h3>
                <p className="text-sm text-[#6b6b6b]">
                  Your order will be processed and shipped within 3-5 business
                  days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-lg font-semibold text-[#5540b7] flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-[#111111] mb-1">
                  Track Your Shipment
                </h3>
                <p className="text-sm text-[#6b6b6b]">
                  Once shipped, you'll receive a tracking number to monitor your
                  delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-[#f8f5f2] border border-[#e6e0da] rounded-lg p-8 mb-8">
          <p className="text-sm text-[#6b6b6b] mb-4">
            For questions about your order, shipping, returns, or any concerns,
            please check our:
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shipping-and-delivery"
              className="text-[#5540b7] font-medium text-sm hover:underline"
            >
              Shipping & Delivery Policy
            </Link>
            <span className="text-[#e6e0da]">•</span>
            <Link
              href="/refund-and-cancellation"
              className="text-[#5540b7] font-medium text-sm hover:underline"
            >
              Refund & Cancellation Policy
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account"
            className="flex-1 text-center px-8 py-4 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors rounded-lg"
          >
            View Your Orders
          </Link>
          <Link
            href="/collections/all"
            className="flex-1 text-center px-8 py-4 border-2 border-[#e6e0da] text-[#111111] font-semibold uppercase tracking-wider hover:border-[#5540b7] hover:bg-[#f8f5f2] transition-colors rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-12 pt-8 border-t border-[#e6e0da] text-center">
          <p className="text-[#6b6b6b] font-light mb-4">
            Need help with your order?
          </p>
          <p className="text-sm text-[#6b6b6b] mb-4">
            Contact our customer support team:
          </p>
          <p className="text-lg font-medium text-[#111111]">
            support@purpleyou.com
          </p>
        </div>
      </div>
    </div>
  );
}
