"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import EditProfileForm from "@/components/profile/EditProfileForm";
import MapPicker from "@/components/address/MapPicker";
import * as orderService from "@/services/order.service";
import * as authService from "@/services/auth.service";
import * as productService from "@/services/product.service";
import { AddressObject } from "@/services/auth.service";

// Dummy data types
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "confirmed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

// Using AddressObject from auth.service

// Dummy data - API placeholders
const DUMMY_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    date: "2025-01-02",
    total: 10029,
    status: "delivered",
    items: [
      {
        productName: "Layering Necklace Set",
        quantity: 1,
        price: 8499,
        image: "/images/hero1.jpg",
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    date: "2024-12-28",
    total: 5999,
    status: "shipped",
    items: [
      {
        productName: "Minimalist Stud Earrings",
        quantity: 1,
        price: 4499,
        image: "/images/hero1.jpg",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-2025-003",
    date: "2024-12-15",
    total: 8999,
    status: "delivered",
    items: [
      {
        productName: "Statement Gold Hoops",
        quantity: 1,
        price: 8999,
        image: "/images/hero1.jpg",
      },
    ],
  },
  {
    id: "4",
    orderNumber: "ORD-2025-004",
    date: "2024-12-10",
    total: 4499,
    status: "delivered",
    items: [
      {
        productName: "Gold Chain Bracelet",
        quantity: 1,
        price: 4499,
        image: "/images/hero1.jpg",
      },
    ],
  },
];

const ITEMS_PER_PAGE = 2;

type Tab = "profile" | "orders" | "addresses";

export default function AccountPage() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [ordersPage, setOrdersPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Address states
  const [addresses, setAddresses] = useState<AddressObject[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressObject | null>(
    null,
  );
  const [addressFormLoading, setAddressFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    area: "",
    pincode: "",
    latitude: "",
    longitude: "",
    isDefault: false,
  });

  // Delete confirmation states
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    addressId: string | null;
    addressLabel: string;
  }>({
    show: false,
    addressId: null,
    addressLabel: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Map picker states
  const [showMapPicker, setShowMapPicker] = useState(false);

  // Fetch user orders and addresses from API
  useEffect(() => {
    if (isLoggedIn && user?.userId) {
      loadUserOrders(user.userId);
      loadAddresses(user.userId);
    }
  }, [isLoggedIn, user?.userId]);

  const loadUserOrders = async (userId: string) => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const apiOrders = await orderService.getUserOrders(userId);

      // Fetch all products to map names and images
      const allProducts = await productService.getAllProducts();
      const productMap = new Map<string, any>();
      allProducts.forEach((product) => {
        productMap.set(product.productId, product);
      });

      // Map API orders to the Order interface
      const mappedOrders: Order[] = apiOrders.map((apiOrder) => ({
        id: apiOrder.orderId,
        orderNumber: apiOrder.orderId.substring(0, 20), // Use order ID as order number
        date: apiOrder.createdAt,
        total: apiOrder.orderDetails.totalPrice,
        status: (apiOrder.status.toLowerCase() as any) || "confirmed",
        items: apiOrder.items.map((item) => {
          const product = productMap.get(item.productId);
          return {
            productName: product?.name || `Product ${item.productId.substring(0, 8)}...`,
            quantity: item.quantity,
            price: item.pricePerUnit,
            image: product?.image || "/images/hero1.jpg",
          };
        }),
      }));

      setOrders(mappedOrders);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to load orders";
      setOrdersError(errorMsg);
      console.error("Failed to load orders:", error);
      // Fall back to empty orders (not dummy data)
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadAddresses = async (userId: string) => {
    setAddressesLoading(true);
    setAddressesError(null);

    try {
      const apiAddresses = await authService.getAddresses(userId);
      if (apiAddresses && apiAddresses.length > 0) {
        setAddresses(apiAddresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to load addresses";
      setAddressesError(errorMsg);

      // If it's a 401 error, redirect to login
      if (errorMsg.includes("session has expired") || errorMsg.includes("No authentication token")) {
        router.push("/login?redirect=/account");
        return;
      }

      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user?.userId) return;

    // Validate required fields
    if (!formData.label?.trim()) {
      alert("Please enter an address label (e.g., Home, Office)");
      return;
    }

    if (!formData.address?.trim()) {
      alert("Please enter the address");
      return;
    }

    if (!formData.area?.trim()) {
      alert("Please enter the area/city");
      return;
    }

    if (!formData.pincode?.trim()) {
      alert("Please enter the pincode");
      return;
    }

    if (!formData.latitude?.trim() || !formData.longitude?.trim()) {
      alert("Please enter latitude and longitude");
      return;
    }

    setAddressFormLoading(true);
    try {
      // Add the address
      await authService.addAddress(user.userId, {
        label: formData.label.trim(),
        address: formData.address.trim(),
        area: formData.area.trim(),
        pincode: formData.pincode.trim(),
        latitude: formData.latitude.trim(),
        longitude: formData.longitude.trim(),
        isDefault: formData.isDefault,
      });

      // Reload addresses to refresh the list
      await loadAddresses(user.userId);

      // Reset form and close modal
      setFormData({
        label: "",
        address: "",
        area: "",
        pincode: "",
        latitude: "",
        longitude: "",
        isDefault: false,
      });
      setShowAddressForm(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to add address";
      alert(`Error: ${errorMsg}`);
    } finally {
      setAddressFormLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!user?.userId || !editingAddress?.addressId) return;

    setAddressFormLoading(true);
    try {
      await authService.updateAddress(user.userId, editingAddress.addressId, {
        label: formData.label,
        address: formData.address,
        area: formData.area,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        isDefault: formData.isDefault,
      });

      // Reload addresses
      await loadAddresses(user.userId);

      // Reset form and close modal
      setFormData({
        label: "",
        address: "",
        area: "",
        pincode: "",
        latitude: "",
        longitude: "",
        isDefault: false,
      });
      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update address";
      alert(`Error: ${errorMsg}`);
    } finally {
      setAddressFormLoading(false);
    }
  };

  const handleDeleteAddress = (address: AddressObject) => {
    setDeleteConfirmation({
      show: true,
      addressId: address.addressId || null,
      addressLabel: address.label,
    });
  };

  const confirmDeleteAddress = async () => {
    if (!user?.userId || !deleteConfirmation.addressId) return;

    setDeleteLoading(true);
    try {
      await authService.deleteAddress(user.userId, deleteConfirmation.addressId);
      // Reload addresses
      await loadAddresses(user.userId);

      // Close confirmation modal
      setDeleteConfirmation({
        show: false,
        addressId: null,
        addressLabel: "",
      });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete address";
      alert(`Error: ${errorMsg}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteAddress = () => {
    setDeleteConfirmation({
      show: false,
      addressId: null,
      addressLabel: "",
    });
  };

  const handleMapLocationSelect = (latitude: string, longitude: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
    setShowMapPicker(false);
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setFormData({
      label: "",
      address: "",
      area: "",
      pincode: "",
      latitude: "",
      longitude: "",
      isDefault: false,
    });
    setShowAddressForm(true);
  };

  const openEditForm = (address: AddressObject) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      address: address.address,
      area: address.area,
      pincode: address.pincode,
      latitude: address.latitude,
      longitude: address.longitude,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/account");
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Pagination calculations
  const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ITEMS_PER_PAGE,
    ordersPage * ITEMS_PER_PAGE,
  );

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-[#f8f5f2] text-[#6b6b6b]";
    }
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e6e0da]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide">
            My Account
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8f5f2] rounded-lg p-6 sticky top-24">
              {/* User Info */}
              <div className="mb-8 pb-8 border-b border-[#e6e0da]">
                <p className="text-sm text-[#6b6b6b] font-light">Welcome</p>
                <h2 className="text-xl font-medium text-[#111111]">
                  {user.name || `+91 ${user.phoneNumber}`}
                </h2>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-white text-[#5540b7]"
                      : "text-[#111111] hover:bg-white hover:text-[#5540b7]"
                  }`}
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-white text-[#5540b7]"
                      : "text-[#111111] hover:bg-white hover:text-[#5540b7]"
                  }`}
                >
                  <span className="text-lg">📦</span>
                  <span className="text-sm font-medium">Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "addresses"
                      ? "bg-white text-[#5540b7]"
                      : "text-[#111111] hover:bg-white hover:text-[#5540b7]"
                  }`}
                >
                  <span className="text-lg">📍</span>
                  <span className="text-sm font-medium">Addresses</span>
                </button>
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 mt-8 px-4 py-3 border border-[#111111] text-[#111111] rounded-lg hover:bg-[#111111] hover:text-white transition-colors text-sm font-medium"
              >
                <span className="text-lg">🚪</span>
                Log Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg border border-[#e6e0da] p-6 sm:p-8">
                <EditProfileForm onCancel={() => setActiveTab("orders")} />
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-light text-[#111111] mb-6 tracking-wide">
                    Your Orders
                  </h2>

                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="mb-4 flex justify-center">
                        <div className="w-10 h-10 border-4 border-[#e6e0da] border-t-[#5540b7] rounded-full animate-spin" />
                      </div>
                      <p className="text-[#6b6b6b] font-light">
                        Loading orders...
                      </p>
                    </div>
                  ) : ordersError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 font-light mb-4">
                        {ordersError}
                      </p>
                      <button
                        onClick={() =>
                          user?.userId && loadUserOrders(user.userId)
                        }
                        className="text-[#5540b7] font-medium hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[#6b6b6b] font-light mb-4">
                        You haven't placed any orders yet
                      </p>
                      <Link
                        href="/collections/all"
                        className="text-[#5540b7] font-medium hover:underline"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {paginatedOrders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-[#e6e0da] rounded-lg p-6"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-medium text-[#111111]">
                                  {order.orderNumber}
                                </h3>
                                <p className="text-sm text-[#6b6b6b]">
                                  {new Date(order.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                              <span
                                className={`mt-2 sm:mt-0 inline-block px-4 py-2 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </div>

                            <div className="border-t border-[#e6e0da] pt-4">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-4 mb-4 last:mb-0"
                                >
                                  <div className="w-16 h-16 flex-shrink-0 bg-[#f0ede9] rounded overflow-hidden">
                                    <img
                                      src={item.image}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-[#111111]">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-[#6b6b6b]">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-[#111111]">
                                    ₹{item.price.toLocaleString("en-IN")}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-[#e6e0da] pt-4 mt-4 flex justify-between">
                              <span className="text-sm text-[#6b6b6b]">
                                Order Total
                              </span>
                              <span className="text-lg font-semibold text-[#111111]">
                                ₹{order.total.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalOrderPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                          <button
                            onClick={() =>
                              setOrdersPage((p) => Math.max(1, p - 1))
                            }
                            disabled={ordersPage === 1}
                            className="flex items-center gap-1 px-3 py-2 border border-[#e6e0da] text-[#111111] rounded hover:bg-[#f8f5f2] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <HiOutlineChevronLeft className="w-4 h-4" />
                            Previous
                          </button>

                          <div className="text-sm text-[#6b6b6b]">
                            Page {ordersPage} of {totalOrderPages}
                          </div>

                          <button
                            onClick={() =>
                              setOrdersPage((p) =>
                                Math.min(totalOrderPages, p + 1),
                              )
                            }
                            disabled={ordersPage === totalOrderPages}
                            className="flex items-center gap-1 px-3 py-2 border border-[#e6e0da] text-[#111111] rounded hover:bg-[#f8f5f2] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                            <HiOutlineChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-[#111111] tracking-wide">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={openAddForm}
                      className="px-4 py-2 bg-[#5540b7] text-white text-sm font-medium rounded hover:bg-[#3d2d7f] transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>

                  {addressesLoading ? (
                    <div className="text-center py-12">
                      <div className="mb-4 flex justify-center">
                        <div className="w-10 h-10 border-4 border-[#e6e0da] border-t-[#5540b7] rounded-full animate-spin" />
                      </div>
                      <p className="text-[#6b6b6b] font-light">
                        Loading addresses...
                      </p>
                    </div>
                  ) : addressesError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 font-light mb-4">
                        {addressesError}
                      </p>
                      <button
                        onClick={() =>
                          user?.userId && loadAddresses(user.userId)
                        }
                        className="text-[#5540b7] font-medium hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[#6b6b6b] font-light mb-4">
                        No addresses saved yet
                      </p>
                      <button
                        onClick={openAddForm}
                        className="text-[#5540b7] font-medium hover:underline"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div
                          key={address.addressId}
                          className={`border-2 rounded-lg p-6 ${
                            address.isDefault
                              ? "border-[#5540b7] bg-[#D3C9FF]/5"
                              : "border-[#e6e0da]"
                          }`}
                        >
                          {address.isDefault && (
                            <span className="inline-block px-3 py-1 bg-[#5540b7] text-white text-xs font-medium rounded mb-3">
                              Default Address
                            </span>
                          )}
                          <h3 className="text-lg font-medium text-[#111111] mb-3">
                            {address.label}
                          </h3>
                          <p className="text-sm text-[#6b6b6b] mb-1">
                            {address.address}
                          </p>
                          <p className="text-sm text-[#6b6b6b] mb-1">
                            {address.area}, {address.pincode}
                          </p>
                          <p className="text-sm text-[#6b6b6b] mb-4">
                            Coords: {address.latitude}, {address.longitude}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <button
                              onClick={() => openEditForm(address)}
                              className="text-[#5540b7] font-medium hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address)}
                              className="text-red-600 font-medium hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#e6e0da] p-6 flex items-center justify-between">
              <h2 className="text-2xl font-light text-[#111111]">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setFormData({
                    label: "",
                    address: "",
                    area: "",
                    pincode: "",
                    latitude: "",
                    longitude: "",
                    isDefault: false,
                  });
                }}
                className="text-[#6b6b6b] hover:text-[#111111]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Label (e.g., Home, Office)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#e6e0da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                  placeholder="Home"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-[#e6e0da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                  placeholder="221B Baker Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#e6e0da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                    placeholder="Marylebone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#e6e0da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                    placeholder="NW16XE"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Location Coordinates *
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="w-full mb-4 px-4 py-2 bg-[#D3C9FF] text-[#5540b7] rounded-lg font-medium hover:bg-[#c8b8ff] transition-colors text-sm"
                >
                  📍 Pick Location from Map
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#e6e0da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                    placeholder="51.5237"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#e6e0da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                    placeholder="-0.1585"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[#e6e0da] focus:ring-[#5540b7]"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 text-sm font-medium text-[#111111]"
                >
                  Set as default address
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#e6e0da] p-6 flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setFormData({
                    label: "",
                    address: "",
                    area: "",
                    pincode: "",
                    latitude: "",
                    longitude: "",
                    isDefault: false,
                  });
                }}
                className="px-6 py-2 border border-[#e6e0da] text-[#111111] rounded-lg hover:bg-[#f8f5f2] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingAddress ? handleUpdateAddress : handleAddAddress
                }
                disabled={addressFormLoading}
                className="px-6 py-2 bg-[#5540b7] text-white rounded-lg hover:bg-[#3d2d7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addressFormLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {editingAddress ? "Update Address" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#e6e0da] p-6 flex items-center justify-between">
              <h2 className="text-2xl font-light text-[#111111]">
                Select Location on Map
              </h2>
              <button
                onClick={() => setShowMapPicker(false)}
                className="text-[#6b6b6b] hover:text-[#111111]"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <MapPicker
                onSelectLocation={handleMapLocationSelect}
                initialLatitude={formData.latitude}
                initialLongitude={formData.longitude}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-light text-[#111111] mb-2">
                Delete Address
              </h2>
              <p className="text-[#6b6b6b] mb-6">
                Are you sure you want to delete "{deleteConfirmation.addressLabel}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4 justify-end p-6 border-t border-[#e6e0da]">
              <button
                onClick={cancelDeleteAddress}
                disabled={deleteLoading}
                className="px-6 py-2 border border-[#e6e0da] text-[#111111] rounded-lg hover:bg-[#f8f5f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                disabled={deleteLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Delete Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
