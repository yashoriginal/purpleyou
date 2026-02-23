"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CartItem } from "@/context/CartContext";
import { getProductById } from "@/services/product.service";
import { normalizeImageUrl } from "@/lib/image";

interface CartProductImageProps {
  item: CartItem;
}

export default function CartProductImage({ item }: CartProductImageProps) {
  const [variantImage, setVariantImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        if (!item.selectedVariants || Object.keys(item.selectedVariants).length === 0) {
          // No variants selected, use base image
          setVariantImage(item.image);
          setIsLoading(false);
          return;
        }

        // Fetch the product to get variant images
        const product = await getProductById(item.productId);
        if (!product) {
          setVariantImage(item.image);
          setIsLoading(false);
          return;
        }

        // Find variant matching the selected variants
        if (product.variants && product.variants.length > 0) {
          const matchedVariant = product.variants.find((variant) => {
            // Check if all selected variant attributes match
            return Object.entries(item.selectedVariants || {}).every(([key, value]) => {
              return variant.attributes[key] === value;
            });
          });

          // Use matched variant's image if available
          if (matchedVariant) {
            const variantImageUrl =
              matchedVariant.resolved?.images?.[0] ||
              matchedVariant.overrides?.images?.[0];

            if (variantImageUrl) {
              setVariantImage(normalizeImageUrl(variantImageUrl));
              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback to base product image
        setVariantImage(item.image);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product for cart image:", error);
        setVariantImage(item.image);
        setIsLoading(false);
      }
    };

    fetchProductImage();
  }, [item.productId, item.selectedVariants, item.image]);

  const displayImage = variantImage || item.image || "/images/hero1.jpg";

  if (isLoading) {
    return (
      <div className="relative bg-[#f8f5f2] w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 overflow-hidden animate-pulse">
        <div className="w-full h-full bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative bg-[#f8f5f2] w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
      <Image
        src={displayImage}
        alt={item.productName}
        fill
        className="object-cover"
      />
    </div>
  );
}
