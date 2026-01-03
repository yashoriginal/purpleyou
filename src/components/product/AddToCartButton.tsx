"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineHeart, HiOutlineFire } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/data";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const { addToCart, removeFromCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [isInCart, setIsInCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  // Check if product is in cart
  useEffect(() => {
    const variantString = selectedVariants
      ? Object.entries(selectedVariants)
          .sort()
          .map(([key, value]) => `${key}:${value}`)
          .join("|")
      : "";
    const itemId = `${product.id}_${variantString}`;
    const productInCart = items.some((item) => item.id === itemId);
    setIsInCart(productInCart);
  }, [items, product.id, selectedVariants]);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const generateCartItemId = (variants?: Record<string, string>): string => {
    const variantString = variants
      ? Object.entries(variants)
          .sort()
          .map(([key, value]) => `${key}:${value}`)
          .join("|")
      : "";
    return `${product.id}_${variantString}`;
  };

  const handleAddToCart = () => {
    if (isInCart) {
      // Remove from cart
      const itemId = generateCartItemId(selectedVariants);
      removeFromCart(itemId);
      // Also remove from wishlist when removing from bag
      removeFromWishlist(product.id);
    } else {
      // Add to cart
      addToCart(product, selectedVariants, 1);
    }
  };

  const handleBuyNow = () => {
    // TODO: Implement checkout flow
    // Once you have a checkout backend:
    // 1. Add item to cart using addToCart()
    // 2. Redirect to checkout: window.location.href = '/checkout';
  };

  return (
    <>
      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="py-6 border-b border-[#e6e0da]">
          {product.variants.map((variant, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <label className="block text-sm font-medium text-[#111111] mb-3">
                {variant.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleVariantSelect(variant.name, option)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      selectedVariants[variant.name] === option
                        ? "border-[#5540b7] bg-[#5540b7] text-white"
                        : "border-[#e6e0da] text-[#111111] hover:border-[#5540b7] hover:text-[#5540b7]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Benefits */}
      <div className="py-6 space-y-3">
        <div className="flex items-start gap-3">
          <HiOutlineFire className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
          <span className="text-sm text-[#6b6b6b] font-light">
            Free shipping on orders above ₹3000
          </span>
        </div>
        <div className="flex items-start gap-3">
          <HiOutlineFire className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
          <span className="text-sm text-[#6b6b6b] font-light">
            Secure checkout with Razorpay (UPI, Cards, Netbanking)
          </span>
        </div>
        <div className="flex items-start gap-3">
          <HiOutlineFire className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
          <span className="text-sm text-[#6b6b6b] font-light">
            GST included • 15-day returns
          </span>
        </div>
        <div className="flex items-start gap-3">
          <HiOutlineFire className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
          <span className="text-sm text-[#6b6b6b] font-light">
            COD available on select locations
          </span>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="border-t border-[#e6e0da] pt-6 space-y-3">
        <button
          onClick={handleAddToCart}
          className={`w-full px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
            isInCart
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[#5540b7] text-white hover:bg-[#3d2d7f]"
          }`}
        >
          {isInCart ? "Remove from Bag" : "Add to Bag"}
        </button>
        {!isInCart && (
          <button
            onClick={handleBuyNow}
            className="w-full border border-[#111111] text-[#111111] px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-colors"
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="mt-6 pt-6 border-t border-[#e6e0da]">
        <button
          onClick={() => {
            if (isWishlisted) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product);
            }
          }}
          className="flex items-center justify-center gap-2 w-full text-sm font-medium text-[#6b6b6b] hover:text-[#5540b7] transition-colors"
        >
          <HiOutlineHeart
            className={`w-5 h-5 ${isWishlisted ? "fill-current text-[#5540b7]" : ""}`}
          />
          {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </>
  );
}
