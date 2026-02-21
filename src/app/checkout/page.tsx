"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Link from "next/link";
import * as orderService from "@/services/order.service";
import * as authService from "@/services/auth.service";
import { AddressObject } from "@/services/auth.service";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Address states
  const [savedAddresses, setSavedAddresses] = useState<AddressObject[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const shippingCost = totalPrice >= 3000 ? 0 : 1;
  const gst = Math.round(totalPrice * 0.18);
  const totalAmount = totalPrice + shippingCost + gst;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      setPaymentError("Failed to load Razorpay. Please refresh and try again.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load saved addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setAddressesLoading(true);
    try {
      const userStr = localStorage.getItem("auth_user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const userId = user._id || user.id || user.userId;
      if (!userId) return;

      const addresses = await authService.getAddresses(userId);
      setSavedAddresses(addresses);
    } catch (error) {
      console.error("Failed to load addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSelectAddress = (savedAddress: AddressObject) => {
    setSelectedAddressId(savedAddress.addressId || null);
    setShowNewAddressForm(false);

    // Parse building and street from the address string
    // For now, we'll split by comma
    const addressParts = savedAddress.address.split(",").map((p) => p.trim());

    // Get user data for email and phone
    const userStr = localStorage.getItem("auth_user");
    const user = userStr ? JSON.parse(userStr) : null;
    const userPhone = user?.mobile
      ? user.mobile.replace(/\D/g, "").slice(-10)
      : "";

    setAddress({
      fullName: user?.userName || user?.name || "",
      mobileNumber: userPhone,
      building: addressParts[0] || savedAddress.address,
      street: addressParts[1] || "",
      city: savedAddress.area,
      state: "",
      pinCode: savedAddress.pincode,
      email: user?.email || "",
    });
  };

  const validateForm = (isSelectedAddress: boolean = false) => {
    const newErrors: Partial<AddressForm> = {};

    // For selected saved addresses, only validate essential fields
    if (isSelectedAddress) {
      if (address.mobileNumber.length !== 10)
        newErrors.mobileNumber = "10-digit mobile required";
      if (!address.pinCode) newErrors.pinCode = "PIN code required";
    } else {
      // For new address entry, validate all fields
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
      if (!address.email.includes("@"))
        newErrors.email = "Valid email required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const isSelectedAddress = selectedAddressId !== null;
    if (!validateForm(isSelectedAddress)) return;

    setPaymentError("");
    setIsProcessing(true);

    try {
      // Get userId from localStorage
      const userStr = localStorage.getItem("auth_user");
      if (!userStr) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const user = JSON.parse(userStr);
      const userId = user._id || user.id || user.userId;
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Create order on backend
      const orderPayload: orderService.CreateOrderPayload = {
        userId,
        shopId: "purple_you",
        status: "pending",
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.price,
        })),
        orderDetails: {
          totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: totalPrice,
          paymentMethod: "razorpay",
        },
        deliveryDetails: {
          deliveryDate: new Date().toISOString(),
          deliveryAddress: `${address.building}, ${address.street}, ${address.city}, ${address.state} ${address.pinCode}`,
          phoneNumber: address.mobileNumber,
        },
      };

      const orderResponse = await orderService.createOrder(orderPayload);
      const razorpayOrder = orderResponse.razorpayOrder;

      // Initialize Razorpay with default UI
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: "INR",
        handler: async (response: any) => {
          try {
            // Get userId from localStorage
            const userStr = localStorage.getItem("auth_user");
            if (!userStr) {
              throw new Error("User not authenticated. Please log in again.");
            }

            const user = JSON.parse(userStr);
            const userId = user._id || user.id || user.userId;
            if (!userId) {
              throw new Error("User ID not found. Please log in again.");
            }

            // Verify payment on backend server
            const verifyResponse = await fetch(
              "https://purpleoneservice.onrender.com/api/v1/orders/payment/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: orderResponse.orderId,
                  userId: userId,
                  shopId: "purple_you",
                  razorpay_order_id: razorpayOrder.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: totalAmount,
                  currency: "INR",
                  payment_method: "razorpay",
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              throw new Error(
                verifyData.error || "Payment verification failed",
              );
            }

            // Payment successful
            clearCart();

            // Redirect to order confirmation
            const params = new URLSearchParams({
              orderId: orderResponse.orderId,
              paymentId: response.razorpay_payment_id,
              email: address.email,
              amount: totalAmount.toLocaleString("en-IN"),
            });

            router.push(`/order-confirmation?${params.toString()}`);
          } catch (verifyError) {
            const errorMessage =
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed";
            setPaymentError(errorMessage);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.mobileNumber,
        },
        theme: {
          color: "#5540b7",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentError("Payment cancelled. Please try again.");
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);

      razorpay.on("payment.failed", (response: any) => {
        setPaymentError(
          `Payment failed: ${response.error?.description || "Unknown error"}`,
        );
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setPaymentError(errorMessage);
      setIsProcessing(false);
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
            onClick={() => router.back()}
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#e6e0da] p-6 sm:p-8 rounded-lg">
              <h2 className="text-2xl font-light text-[#111111] tracking-wide mb-8">
                Delivery Address
              </h2>

              {/* Saved Addresses Section */}
              {savedAddresses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[#111111] mb-4">
                    Your Saved Addresses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {savedAddresses.map((savedAddress) => (
                      <div
                        key={savedAddress.addressId}
                        onClick={() => handleSelectAddress(savedAddress)}
                        className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAddressId === savedAddress.addressId
                            ? "border-[#5540b7] bg-[#D3C9FF]/5"
                            : "border-[#e6e0da] hover:border-[#5540b7]"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Header with Label and Default Badge */}
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#111111] text-base">
                              {savedAddress.label}
                            </p>
                            {savedAddress.isDefault && (
                              <span className="text-xs bg-[#5540b7] text-white px-3 py-1 rounded-full whitespace-nowrap">
                                Default
                              </span>
                            )}
                          </div>

                          {/* Address Details */}
                          <div className="space-y-2 text-sm">
                            {/* Full Address */}
                            <div>
                              <p className="text-[#6b6b6b] font-medium text-xs uppercase tracking-wide">
                                Address
                              </p>
                              <p className="text-[#111111]">
                                {savedAddress.address}
                              </p>
                            </div>

                            {/* Area and City */}
                            <div>
                              <p className="text-[#6b6b6b] font-medium text-xs uppercase tracking-wide">
                                Area/City
                              </p>
                              <p className="text-[#111111]">
                                {savedAddress.area}
                              </p>
                            </div>

                            {/* Postal Code */}
                            <div>
                              <p className="text-[#6b6b6b] font-medium text-xs uppercase tracking-wide">
                                Postal Code
                              </p>
                              <p className="text-[#111111]">
                                {savedAddress.pincode}
                              </p>
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-[#6b6b6b] font-medium text-xs uppercase tracking-wide">
                                  Latitude
                                </p>
                                <p className="text-[#111111] text-xs">
                                  {savedAddress.latitude}
                                </p>
                              </div>
                              <div>
                                <p className="text-[#6b6b6b] font-medium text-xs uppercase tracking-wide">
                                  Longitude
                                </p>
                                <p className="text-[#111111] text-xs">
                                  {savedAddress.longitude}
                                </p>
                              </div>
                            </div>

                            {/* Timestamps */}
                            {savedAddress.createdAt && (
                              <div className="pt-2 border-t border-[#e6e0da]">
                                <p className="text-[#6b6b6b] text-xs">
                                  Added on{" "}
                                  {new Date(
                                    savedAddress.createdAt,
                                  ).toLocaleDateString("en-IN")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewAddressForm(true);
                        setSelectedAddressId(null);
                        setAddress({
                          fullName: "",
                          mobileNumber: "",
                          building: "",
                          street: "",
                          city: "",
                          state: "",
                          pinCode: "",
                          email: "",
                        });
                      }}
                      className="text-[#5540b7] font-medium hover:underline text-sm"
                    >
                      + Use a different address
                    </button>

                    {selectedAddressId && (
                      <button
                        onClick={handleAddressSubmit}
                        disabled={isProcessing || !razorpayLoaded}
                        className={`py-2 px-6 text-sm font-semibold rounded-lg transition-all ${
                          isProcessing || !razorpayLoaded
                            ? "bg-[#d0c0e0] text-[#6b6b6b] cursor-not-allowed"
                            : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
                        }`}
                      >
                        {isProcessing ? "Processing..." : "Continue to Payment"}
                      </button>
                    )}
                  </div>
                  <div className="mt-6 border-t border-[#e6e0da] pt-6"></div>
                </div>
              )}

              {/* Show message if loading addresses */}
              {addressesLoading && (
                <div className="mb-6 p-4 bg-[#f8f5f2] rounded-lg text-sm text-[#6b6b6b]">
                  Loading saved addresses...
                </div>
              )}

              {/* When no saved addresses and form not shown */}
              {!showNewAddressForm &&
                savedAddresses.length === 0 &&
                !addressesLoading && (
                  <div className="mb-8 p-6 bg-[#f8f5f2] rounded-lg text-center">
                    <p className="text-[#6b6b6b] font-light mb-4">
                      No saved addresses yet
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(true)}
                      className="px-4 py-2 bg-[#5540b7] text-white text-sm font-medium rounded hover:bg-[#3d2d7f] transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                )}

              {/* New address form title and form - only show on demand */}
              {showNewAddressForm && (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#111111]">
                      {savedAddresses.length > 0
                        ? "Enter New Address"
                        : "Add Delivery Address"}
                    </h3>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewAddressForm(false);
                          if (savedAddresses.length > 0 && !selectedAddressId) {
                            handleSelectAddress(savedAddresses[0]);
                          }
                        }}
                        className="text-[#5540b7] font-medium hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

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
                          errors.fullName
                            ? "border-red-500"
                            : "border-[#e6e0da]"
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
                          errors.building
                            ? "border-red-500"
                            : "border-[#e6e0da]"
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
                        <p className="text-xs text-red-500 mt-1">
                          {errors.city}
                        </p>
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
                            errors.pinCode
                              ? "border-red-500"
                              : "border-[#e6e0da]"
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

                    {paymentError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {paymentError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing || !razorpayLoaded}
                      className={`w-full py-4 text-sm font-semibold uppercase tracking-wider mt-8 rounded-lg transition-all flex items-center justify-center gap-2 ${
                        isProcessing || !razorpayLoaded
                          ? "bg-[#d0c0e0] text-[#6b6b6b] cursor-not-allowed"
                          : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
                      }`}
                    >
                      <span className="text-base">🔒</span>
                      {isProcessing
                        ? "Processing Payment..."
                        : "Continue to Payment"}
                    </button>
                  </form>
                </>
              )}
            </div>
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
                    className="flex justify-between items-start gap-3"
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 flex-shrink-0 bg-[#f0ede9] rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] line-clamp-2">
                        {item.productName}
                      </p>
                      <p className="text-xs text-[#6b6b6b] mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
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

declare global {
  interface Window {
    Razorpay: any;
  }
}
