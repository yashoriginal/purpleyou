"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlineHeart } from "react-icons/hi";
import { getAllProducts } from "@/services/product.service";
import { Product } from "@/types/product";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToCartId, setAddedToCartId] = useState<number | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Get full product objects for wishlist items
  const wishlistProducts = items
    .map((item) => allProducts.find((p) => p.id === item.productId))
    .filter(Boolean) as Product[];

  const handleAddToCart = (product: Product) => {
    addToCart(product, {}, 1);
    setAddedToCartId(product.id);
    setTimeout(() => setAddedToCartId(null), 2000);
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto border-4 border-[#e6e0da] border-t-[#5540b7] rounded-full animate-spin" />
          </div>
          <h1 className="text-3xl font-light text-[#111111] tracking-wide mb-4">
            Loading Wishlist...
          </h1>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <div className="mb-6">
            <HiOutlineHeart className="w-16 h-16 mx-auto text-[#6b6b6b] opacity-50" />
          </div>
          <h1 className="text-3xl font-light text-[#111111] tracking-wide mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-[#6b6b6b] font-light mb-8">
            Save your favorite pieces for later
          </p>
          <Link
            href="/collections/all"
            className="inline-block px-8 py-4 bg-[#5540b7] text-white font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-2">
          My Wishlist
        </h1>
        <p className="text-[#6b6b6b] font-light">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="border border-[#e6e0da] p-4 hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <Link href={`/products/${product.slug}`}>
              <div className="relative bg-[#f8f5f2] aspect-[3/4] mb-4 overflow-hidden cursor-pointer group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isBestseller && (
                  <div className="absolute top-3 right-3 bg-[#D3C9FF] text-[#111111] text-xs font-semibold px-3 py-1 rounded-full">
                    BESTSELLER
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-3 left-3 bg-[#5540b7] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    NEW
                  </div>
                )}
              </div>
            </Link>

            {/* Product Details */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base font-medium text-[#111111] hover:text-[#5540b7] transition-colors cursor-pointer mb-2">
                {product.name}
              </h3>
            </Link>

            {/* Price */}
            <div className="flex gap-2 items-baseline mb-4">
              <span className="text-lg font-medium text-[#111111]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-[#6b6b6b] line-through">
                  ₹{product.comparePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#6b6b6b] font-light mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  addedToCartId === product.id
                    ? "bg-green-600 text-white"
                    : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
                }`}
              >
                {addedToCartId === product.id ? "✓ Added to Bag" : "Add to Bag"}
              </button>

              <button
                onClick={() => removeFromWishlist(product.id)}
                className="w-full px-4 py-3 border border-[#e6e0da] text-[#6b6b6b] text-sm font-semibold uppercase tracking-wider hover:border-red-400 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Remove
              </button>
            </div>

            {/* View Product Link */}
            <Link href={`/products/${product.slug}`}>
              <p className="text-xs text-[#5540b7] text-center mt-3 hover:underline cursor-pointer">
                View Details
              </p>
            </Link>
          </div>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-16 text-center">
        <Link
          href="/collections/all"
          className="text-[#5540b7] font-medium hover:underline"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* API Integration Placeholder */}
      {/* 
      TODO: API Integration
      When you have a backend, you can implement:

      1. Persistent Wishlist (localStorage or database):
      ```
      useEffect(() => {
        // Load wishlist from localStorage on mount
        const saved = localStorage.getItem('wishlist');
        if (saved) {
          setItems(JSON.parse(saved));
        }
      }, []);

      useEffect(() => {
        // Save wishlist to localStorage on change
        localStorage.setItem('wishlist', JSON.stringify(items));
      }, [items]);
      ```

      2. Share Wishlist via Link:
      ```
      const handleShareWishlist = async () => {
        const response = await fetch('/api/wishlist/create-shareable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(i => i.productId),
          }),
        });
        const { shareUrl } = await response.json();
        navigator.clipboard.writeText(shareUrl);
      };
      ```

      3. Email Wishlist:
      ```
      const handleEmailWishlist = async () => {
        await fetch('/api/wishlist/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: wishlistProducts,
            email: userEmail,
          }),
        });
      };
      ```

      4. Get Price Drop Alerts:
      ```
      const handleSetPriceAlert = async (productId: number, targetPrice: number) => {
        await fetch('/api/wishlist/price-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            targetPrice,
          }),
        });
      };
      ```
      */}
    </section>
  );
}
