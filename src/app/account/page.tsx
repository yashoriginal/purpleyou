"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  HiOutlineHeart,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import EditProfileForm from "@/components/profile/EditProfileForm";
import * as orderService from "@/services/order.service";
import * as authService from "@/services/auth.service";
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

interface WishlistItem {
  id: string;
  productId: number;
  productName: string;
  price: number;
  image: string;
  addedDate: string;
}

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

const DUMMY_ADDRESSES: Address[] = [
  {
    id: "1",
    fullName: "Uvan Shankar",
    street: "123 Luxury Lane, Apartment 5B",
    city: "New York",
    state: "NY",
    pinCode: "10001",
    phone: "9999999999",
    isDefault: true,
  },
  {
    id: "2",
    fullName: "Uvan Shankar",
    street: "456 Park Avenue, Suite 200",
    city: "Manhattan",
    state: "NY",
    pinCode: "10022",
    phone: "9999999999",
    isDefault: false,
  },
];

const DUMMY_WISHLIST: WishlistItem[] = [
  {
    id: "1",
    productId: 1,
    productName: "Diamond Pendant",
    price: 12999,
    image: "/images/hero1.jpg",
    addedDate: "2025-01-01",
  },
  {
    id: "2",
    productId: 2,
    productName: "Pearl Necklace",
    price: 9999,
    image: "/images/hero1.jpg",
    addedDate: "2024-12-28",
  },
  {
    id: "3",
    productId: 3,
    productName: "Rose Gold Ring",
    price: 7999,
    image: "/images/hero1.jpg",
    addedDate: "2024-12-20",
  },
  {
    id: "4",
    productId: 4,
    productName: "Sapphire Earrings",
    price: 14999,
    image: "/images/hero1.jpg",
    addedDate: "2024-12-15",
  },
  {
    id: "5",
    productId: 5,
    productName: "Emerald Bracelet",
    price: 10999,
    image: "/images/hero1.jpg",
    addedDate: "2024-12-10",
  },
];

const ITEMS_PER_PAGE = 2;

type Tab = "profile" | "orders" | "addresses" | "wishlist";

export default function AccountPage() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [ordersPage, setOrdersPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Fetch user orders from API
  useEffect(() => {
    if (isLoggedIn && user?.userId) {
      loadUserOrders(user.userId);
    }
  }, [isLoggedIn, user?.userId]);

  const loadUserOrders = async (userId: string) => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const apiOrders = await orderService.getUserOrders(userId);

      // Map API orders to the Order interface
      const mappedOrders: Order[] = apiOrders.map((apiOrder) => ({
        id: apiOrder.orderId,
        orderNumber: apiOrder.orderId.substring(0, 20), // Use order ID as order number
        date: apiOrder.createdAt,
        total: apiOrder.orderDetails.totalPrice,
        status: (apiOrder.status.toLowerCase() as any) || "confirmed",
        items: apiOrder.items.map((item) => ({
          productName: `Product ${item.productId.substring(0, 8)}...`,
          quantity: item.quantity,
          price: item.pricePerUnit,
          image: "/images/hero1.jpg",
        })),
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
  const totalWishlistPages = Math.ceil(DUMMY_WISHLIST.length / ITEMS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ITEMS_PER_PAGE,
    ordersPage * ITEMS_PER_PAGE,
  );

  const paginatedWishlist = DUMMY_WISHLIST.slice(
    (wishlistPage - 1) * ITEMS_PER_PAGE,
    wishlistPage * ITEMS_PER_PAGE,
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

                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "wishlist"
                      ? "bg-white text-[#5540b7]"
                      : "text-[#111111] hover:bg-white hover:text-[#5540b7]"
                  }`}
                >
                  <HiOutlineHeart className="w-5 h-5" />
                  <span className="text-sm font-medium">Wishlist</span>
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
                                  <div className="relative w-16 h-16 bg-[#f8f5f2] rounded flex-shrink-0 overflow-hidden">
                                    <Image
                                      src={item.image}
                                      alt={item.productName}
                                      fill
                                      className="object-cover"
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
                    <button className="px-4 py-2 bg-[#5540b7] text-white text-sm font-medium rounded hover:bg-[#3d2d7f] transition-colors">
                      Add New Address
                    </button>
                  </div>

                  {DUMMY_ADDRESSES.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[#6b6b6b] font-light mb-4">
                        No addresses saved yet
                      </p>
                      <button className="text-[#5540b7] font-medium hover:underline">
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {DUMMY_ADDRESSES.map((address) => (
                        <div
                          key={address.id}
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
                            {address.fullName}
                          </h3>
                          <p className="text-sm text-[#6b6b6b] mb-1">
                            {address.street}
                          </p>
                          <p className="text-sm text-[#6b6b6b] mb-1">
                            {address.city}, {address.state} {address.pinCode}
                          </p>
                          <p className="text-sm text-[#6b6b6b] mb-4">
                            Phone: {address.phone}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <button className="text-[#5540b7] font-medium hover:underline">
                              Edit
                            </button>
                            <button className="text-red-600 font-medium hover:underline">
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

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-light text-[#111111] mb-6 tracking-wide">
                    Your Wishlist
                  </h2>

                  {DUMMY_WISHLIST.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[#6b6b6b] font-light mb-4">
                        Your wishlist is empty
                      </p>
                      <Link
                        href="/collections/all"
                        className="text-[#5540b7] font-medium hover:underline"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {paginatedWishlist.map((item) => (
                          <div
                            key={item.id}
                            className="border border-[#e6e0da] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="relative w-full h-48 bg-[#f8f5f2] overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="text-base font-medium text-[#111111] mb-2">
                                {item.productName}
                              </h3>
                              <p className="text-xs text-[#6b6b6b] mb-3">
                                Added on{" "}
                                {new Date(item.addedDate).toLocaleDateString(
                                  "en-IN",
                                )}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold text-[#111111]">
                                  ₹{item.price.toLocaleString("en-IN")}
                                </p>
                                <button className="px-4 py-2 bg-[#5540b7] text-white text-xs font-medium rounded hover:bg-[#3d2d7f] transition-colors">
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalWishlistPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                          <button
                            onClick={() =>
                              setWishlistPage((p) => Math.max(1, p - 1))
                            }
                            disabled={wishlistPage === 1}
                            className="flex items-center gap-1 px-3 py-2 border border-[#e6e0da] text-[#111111] rounded hover:bg-[#f8f5f2] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <HiOutlineChevronLeft className="w-4 h-4" />
                            Previous
                          </button>

                          <div className="text-sm text-[#6b6b6b]">
                            Page {wishlistPage} of {totalWishlistPages}
                          </div>

                          <button
                            onClick={() =>
                              setWishlistPage((p) =>
                                Math.min(totalWishlistPages, p + 1),
                              )
                            }
                            disabled={wishlistPage === totalWishlistPages}
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
          </div>
        </div>
      </div>
    </div>
  );
}
