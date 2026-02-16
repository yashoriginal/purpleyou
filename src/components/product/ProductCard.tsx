"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { normalizeImageUrl } from "@/lib/image";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovering, setIsHovering] = useState(false);

  // Get hover image (prefer secondary variant image, then product hoverImage)
  const hoverImageOption =
    product.variants?.[1]?.overrides?.images?.[0] ||
    product.variants?.[1]?.resolved?.images?.[0] ||
    product.hoverImage;

  // Only use hover image if it exists and is different from main image
  const rawDisplayImage =
    isHovering && hoverImageOption && hoverImageOption !== product.image
      ? hoverImageOption
      : product.image || "/images/hero1.jpg";

  // Normalize the image URL
  const displayImage = normalizeImageUrl(rawDisplayImage);

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="product-card group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative overflow-hidden bg-[#f8f5f2] aspect-[3/4] mb-4">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
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

        <div>
          <h3 className="text-sm font-medium text-[#111111] tracking-wide line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-[#6b6b6b] mt-2 font-light line-clamp-2">
            {product.description}
          </p>

          {/* Variant options display */}
          {product.variantSchema && Object.keys(product.variantSchema).length > 0 && (
            <div className="mt-2 text-xs text-[#6b6b6b]">
              {Object.entries(product.variantSchema)
                .slice(0, 2)
                .map(([key, options]) => (
                  <div key={key} className="capitalize">
                    <span className="font-medium">{key}:</span> {options.join(", ")}
                  </div>
                ))}
            </div>
          )}

          <div className="mt-3 flex gap-2 items-baseline">
            <span className="text-lg font-medium text-[#111111]">
              ₹{(product.price || product.base?.price || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
