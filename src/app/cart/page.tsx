"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineTrash,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineArrowLeft,
} from "react-icons/hi";

export default function CartPage() {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity } =
    useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shippingCost = totalPrice >= 3000 ? 0 : 99;
  const gst = Math.round(totalPrice * 0.18);
  const totalAmount = totalPrice + shippingCost + gst;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-3">
            Your Bag is Empty
          </h1>
          <p className="text-[#6b6b6b] font-light mb-8 text-lg">
            Add some beautiful pieces to your collection
          </p>
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e6e0da]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide">
                Your Bag
              </h1>
              <p className="text-[#6b6b6b] font-light mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <Link
              href="/collections/all"
              className="text-[#5540b7] font-medium text-sm hover:underline flex items-center gap-1"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 py-6 border-b border-[#e6e0da] last:border-0"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative bg-[#f8f5f2] w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="text-base font-medium text-[#111111] hover:text-[#5540b7] transition-colors cursor-pointer line-clamp-2">
                          {item.productName}
                        </h3>
                      </Link>

                      {/* Variant Details */}
                      {item.selectedVariants &&
                        Object.keys(item.selectedVariants).length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {Object.entries(item.selectedVariants).map(
                              ([key, value]) => (
                                <p
                                  key={key}
                                  className="text-xs text-[#6b6b6b] font-light"
                                >
                                  <span className="font-medium">{key}:</span>{" "}
                                  {value}
                                </p>
                              ),
                            )}
                          </div>
                        )}

                      {/* Price */}
                      <p className="text-base font-semibold text-[#111111] mt-3">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#e6e0da] bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-[#f8f5f2] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <HiOutlineMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium w-10 text-center">
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
                        className="p-2 text-[#6b6b6b] hover:text-red-600 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex flex-col items-end justify-between py-6 flex-shrink-0">
                    <p className="text-base font-semibold text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8f5f2] p-6 sm:p-8 sticky top-20 rounded-lg">
              <h2 className="text-lg font-medium text-[#111111] mb-6 tracking-wide">
                Order Summary
              </h2>

              {/* Pricing Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-[#e6e0da]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6b6b]">Subtotal</span>
                  <span className="text-[#111111] font-medium">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6b6b]">Shipping</span>
                  <span className="text-[#111111] font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6b6b]">Tax (18% GST)</span>
                  <span className="text-[#111111] font-medium">
                    ₹{gst.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xl font-semibold text-[#111111] mb-8">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full px-6 py-4 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </button>

              {/* Info Messages */}
              <div className="mt-6 space-y-4 pt-6 border-t border-[#e6e0da]">
                <p className="text-xs text-[#6b6b6b] text-center font-light">
                  {totalPrice >= 3000
                    ? "✓ Free shipping on your order"
                    : "Add ₹" +
                      (3000 - totalPrice).toLocaleString("en-IN") +
                      " more for free shipping"}
                </p>
                <p className="text-xs text-[#6b6b6b] text-center font-light">
                  🔒 Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
