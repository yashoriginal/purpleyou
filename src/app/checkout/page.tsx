"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineChevronLeft, HiOutlineCheck } from "react-icons/hi";
import RazorpayCheckout from "@/components/checkout/RazorpayCheckout";
import Link from "next/link";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Daman & Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<"address" | "payment">(
    "address",
  );
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    mobileNumber: "",
    building: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const shippingCost = totalPrice >= 3000 ? 0 : 99;
  const gst = Math.round(totalPrice * 0.18);
  const totalAmount = totalPrice + shippingCost + gst;

  const validateForm = () => {
    const newErrors: Partial<AddressForm> = {};

    if (!address.fullName.trim()) newErrors.fullName = "Name required";
    if (address.mobileNumber.length !== 10)
      newErrors.mobileNumber = "10-digit mobile required";
    if (!address.building.trim())
      newErrors.building = "Building/House required";
    if (!address.street.trim()) newErrors.street = "Street/Locality required";
    if (!address.city.trim()) newErrors.city = "City required";
    if (!address.state) newErrors.state = "State required";
    if (address.pinCode.length !== 6)
      newErrors.pinCode = "6-digit PIN code required";
    if (!address.email.includes("@")) newErrors.email = "Valid email required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep("payment");
    }
  };

  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-light text-[#111111] tracking-wide mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-[#6b6b6b] font-light mb-8">
            Please add items to your cart before checking out
          </p>
          <Link
            href="/collections/all"
            className="inline-block px-8 py-4 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e6e0da]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <button
            onClick={() =>
              currentStep === "payment"
                ? setCurrentStep("address")
                : router.back()
            }
            className="flex items-center gap-2 text-[#5540b7] font-medium mb-4 hover:underline"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-[#f8f5f2] border-b border-[#e6e0da]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-12">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  currentStep === "address"
                    ? "bg-[#5540b7] text-white"
                    : "bg-[#e6e0da] text-[#111111]"
                }`}
              >
                {currentStep === "payment" ? (
                  <HiOutlineCheck className="w-5 h-5" />
                ) : (
                  "1"
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-[#6b6b6b]">Step 1</p>
                <p className="font-medium text-[#111111]">Delivery Address</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block flex-1 h-0.5 bg-[#e6e0da]" />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  currentStep === "payment"
                    ? "bg-[#5540b7] text-white"
                    : "bg-[#e6e0da] text-[#111111]"
                }`}
              >
                2
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-[#6b6b6b]">Step 2</p>
                <p className="font-medium text-[#111111]">Payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === "address" ? (
              <div className="bg-white border border-[#e6e0da] p-6 sm:p-8 rounded-lg">
                <h2 className="text-2xl font-light text-[#111111] tracking-wide mb-8">
                  Delivery Address
                </h2>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                        errors.fullName ? "border-red-500" : "border-[#e6e0da]"
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email & Mobile - 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                          errors.email ? "border-red-500" : "border-[#e6e0da]"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Mobile Number (10 digits) *
                      </label>
                      <input
                        type="tel"
                        value={address.mobileNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "mobileNumber",
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                          errors.mobileNumber
                            ? "border-red-500"
                            : "border-[#e6e0da]"
                        }`}
                        placeholder="10-digit number"
                        maxLength={10}
                      />
                      {errors.mobileNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Building/House */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      House/Flat/Building *
                    </label>
                    <input
                      type="text"
                      value={address.building}
                      onChange={(e) =>
                        handleInputChange("building", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                        errors.building ? "border-red-500" : "border-[#e6e0da]"
                      }`}
                      placeholder="House/Flat no., Building name"
                    />
                    {errors.building && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.building}
                      </p>
                    )}
                  </div>

                  {/* Street/Locality */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Street/Locality *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                        errors.street ? "border-red-500" : "border-[#e6e0da]"
                      }`}
                      placeholder="Road/Locality name"
                    />
                    {errors.street && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                        errors.city ? "border-red-500" : "border-[#e6e0da]"
                      }`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State & PIN Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        State *
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                          errors.state ? "border-red-500" : "border-[#e6e0da]"
                        }`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    {/* PIN Code */}
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="tel"
                        value={address.pinCode}
                        onChange={(e) =>
                          handleInputChange(
                            "pinCode",
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        className={`w-full px-4 py-3 border rounded text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#5540b7] focus:border-transparent transition-all ${
                          errors.pinCode ? "border-red-500" : "border-[#e6e0da]"
                        }`}
                        placeholder="6-digit PIN"
                        maxLength={6}
                      />
                      {errors.pinCode && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.pinCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5540b7] text-white py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors mt-8 rounded-lg"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-[#e6e0da] p-6 sm:p-8 rounded-lg">
                <h2 className="text-2xl font-light text-[#111111] tracking-wide mb-8">
                  Payment Method
                </h2>
                <RazorpayCheckout
                  amount={totalPrice}
                  orderId={`order-${Date.now()}`}
                  customerEmail={address.email}
                  customerPhone={address.mobileNumber}
                  items={items}
                  address={address}
                  totalPrice={totalPrice}
                  shippingCost={shippingCost}
                  gst={gst}
                  onSuccess={clearCart}
                />
              </div>
            )}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8f5f2] p-6 sm:p-8 rounded-lg sticky top-20">
              <h3 className="text-lg font-medium text-[#111111] mb-6 tracking-wide">
                Order Summary
              </h3>

              {/* Cart Items */}
              <div className="mb-6 pb-6 border-b border-[#e6e0da] space-y-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] line-clamp-2">
                        {item.productName}
                      </p>
                      <p className="text-xs text-[#6b6b6b] mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[#111111] ml-2 flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-[#6b6b6b]">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6b6b]">
                  <span>Shipping</span>
                  <span
                    className={
                      shippingCost === 0 ? "text-green-600 font-medium" : ""
                    }
                  >
                    {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6b6b]">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-[#e6e0da] pt-3 flex justify-between font-semibold text-lg text-[#111111]">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <p className="text-xs text-[#6b6b6b] text-center">
                🔒 Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
