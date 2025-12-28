"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";

export default function CartPage() {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      // TODO: API Integration - Checkout Flow
      // Replace the following with actual checkout backend call:
      /*
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedVariants: item.selectedVariants,
          })),
          totalPrice,
          currency: 'INR',
          // Add user info if authenticated:
          // userId: currentUser.id,
          // email: currentUser.email,
        }),
      });

      if (!response.ok) throw new Error('Checkout failed');
      const orderData = await response.json();

      // Redirect to payment gateway (e.g., Razorpay, Stripe):
      window.location.href = orderData.checkoutUrl;
      */

      // For now, just show a message and redirect
      alert(
        "Checkout flow not yet implemented. Please implement the backend integration."
      );
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to proceed to checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-light text-[#111111] tracking-wide mb-4">
            Your Bag is Empty
          </h1>
          <p className="text-[#6b6b6b] font-light mb-8">
            Add some beautiful pieces to your collection
          </p>
          <Link
            href="/collections/all"
            className="inline-block px-8 py-4 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-[#111111] tracking-wide">
          Your Bag
        </h1>
        <p className="text-[#6b6b6b] font-light mt-2">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2">
          <div className="space-y-6 border-b border-[#e6e0da] pb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 py-6 border-b border-[#e6e0da] last:border-0 last:pb-0 last:py-0"
              >
                {/* Product Image */}
                <Link href={`/products/${item.productId}`}>
                  <div className="relative bg-[#f8f5f2] w-24 h-32 flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="text-base font-medium text-[#111111] hover:text-[#5540b7] transition-colors cursor-pointer">
                        {item.productName}
                      </h3>
                    </Link>

                    {/* Variant Details */}
                    {item.selectedVariants &&
                      Object.keys(item.selectedVariants).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(item.selectedVariants).map(
                            ([key, value]) => (
                              <p
                                key={key}
                                className="text-xs text-[#6b6b6b] font-light"
                              >
                                <span className="font-medium">{key}:</span>{" "}
                                {value}
                              </p>
                            )
                          )}
                        </div>
                      )}

                    {/* Price */}
                    <p className="text-base font-medium text-[#111111] mt-3">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#e6e0da]">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-[#f8f5f2] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <HiOutlineMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-[#f8f5f2] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <HiOutlinePlus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-2 text-[#6b6b6b] hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="flex flex-col items-end justify-between py-6 flex-shrink-0">
                  <p className="text-base font-medium text-[#111111]">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-8">
            <Link
              href="/collections/all"
              className="text-[#5540b7] font-medium hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#f8f5f2] p-8 sticky top-24">
            <h2 className="text-lg font-medium text-[#111111] mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-[#e6e0da]">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6b6b]">Subtotal</span>
                <span className="text-[#111111] font-medium">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* TODO: API Integration - Calculate Shipping */}
              {/* Once you have a backend, fetch shipping based on cart items:
              const shippingResponse = await fetch('/api/shipping/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                  deliveryPin: userPin, // Get this from user input
                }),
              });
              const { shippingCost } = await shippingResponse.json();
              */}

              <div className="flex justify-between text-sm">
                <span className="text-[#6b6b6b]">Shipping</span>
                <span className="text-[#111111] font-medium">
                  {totalPrice >= 3000 ? "Free" : "₹99"}
                </span>
              </div>

              {/* TODO: API Integration - Calculate Tax/GST */}
              {/* Once you have a backend, calculate tax based on items and location:
              const taxResponse = await fetch('/api/tax/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  subtotal: totalPrice,
                  state: userState, // Get from user
                }),
              });
              const { taxAmount } = await taxResponse.json();
              */}

              <div className="flex justify-between text-sm">
                <span className="text-[#6b6b6b]">Tax (18% GST)</span>
                <span className="text-[#111111] font-medium">
                  ₹{Math.round(totalPrice * 0.18).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold text-[#111111] mb-6">
              <span>Total</span>
              <span>
                ₹
                {(
                  totalPrice +
                  (totalPrice >= 3000 ? 0 : 99) +
                  Math.round(totalPrice * 0.18)
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full px-6 py-3 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>

            <p className="text-xs text-[#6b6b6b] text-center mt-4 font-light">
              Free shipping on orders above ₹3000
            </p>

            {/* Secure Checkout Message */}
            <div className="mt-6 pt-6 border-t border-[#e6e0da]">
              <p className="text-xs text-[#6b6b6b] text-center font-light">
                ✓ Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {/* TODO: Fetch recommended products based on cart items from API */}
      {/* 
      const recommendedResponse = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map(i => i.productId),
          limit: 4,
        }),
      });
      const { products: recommendedProducts } = await recommendedResponse.json();
      */}
    </section>
  );
}
