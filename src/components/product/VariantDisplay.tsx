"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, Variant } from "@/types/product";

interface VariantDisplayProps {
  product: Product;
}

export default function VariantDisplay({ product }: VariantDisplayProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    undefined
  );
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Get images for display (variant images take precedence over base)
  const getDisplayImages = (): string[] => {
    if (selectedVariant?.resolved?.images) {
      return selectedVariant.resolved.images;
    }
    if (selectedVariant?.overrides?.images) {
      return selectedVariant.overrides.images;
    }
    // Fallback to product image
    return product.image ? [product.image] : ["/images/hero1.jpg"];
  };

  const displayImages = getDisplayImages();
  const mainImage = displayImages[mainImageIndex] || product.image || "/images/hero1.jpg";

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="relative bg-[#f8f5f2] aspect-[3/4] overflow-hidden">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImageIndex(index)}
              className={`relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity border-2 ${
                mainImageIndex === index ? "border-[#5540b7]" : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="text-center text-sm text-[#6b6b6b]">
          {mainImageIndex + 1} / {displayImages.length}
        </div>
      )}
    </div>
  );
}
