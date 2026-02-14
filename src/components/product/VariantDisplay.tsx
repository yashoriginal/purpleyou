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

  // Validate image URLs - only accept absolute URLs or local paths starting with /
  const validateImageUrl = (url: string): string => {
    if (!url) return "/images/hero1.jpg";

    // Already absolute URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Already a local path
    if (url.startsWith("/")) {
      return url;
    }

    // Relative path or invalid - use fallback
    console.warn(`Invalid image URL: ${url}, using fallback`);
    return "/images/hero1.jpg";
  };

  // Get images for display (variant images take precedence over base)
  const getDisplayImages = (): string[] => {
    let images: string[] = [];

    if (selectedVariant?.resolved?.images) {
      images = selectedVariant.resolved.images;
    } else if (selectedVariant?.overrides?.images) {
      images = selectedVariant.overrides.images;
    } else if (product.image) {
      images = [product.image];
    } else {
      images = ["/images/hero1.jpg"];
    }

    // Validate all image URLs
    return images.map(validateImageUrl);
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
