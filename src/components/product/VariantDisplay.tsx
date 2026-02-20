"use client";

import { useState } from "react";
import { Product, Variant } from "@/types/product";
import { normalizeImageUrl } from "@/lib/image";
import DynamicAspectImage from "@/components/DynamicAspectImage";
import Image from "next/image";

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

    // Normalize all image URLs
    return images.map(normalizeImageUrl);
  };

  const displayImages = getDisplayImages();
  const mainImage = displayImages[mainImageIndex] || normalizeImageUrl(product.image);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <DynamicAspectImage
        src={mainImage}
        alt={product.name}
        defaultAspectRatio={0.75}
        containerClassName="relative bg-[#f8f5f2] overflow-hidden"
        imageClassName="object-cover"
      />

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImageIndex(index)}
              className={`cursor-pointer hover:opacity-70 transition-opacity border-2 ${
                mainImageIndex === index ? "border-[#5540b7]" : "border-transparent"
              }`}
            >
              <DynamicAspectImage
                src={image}
                alt={`Thumbnail ${index + 1}`}
                defaultAspectRatio={1}
                containerClassName="relative bg-[#f8f5f2] overflow-hidden"
                imageClassName="object-cover"
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
