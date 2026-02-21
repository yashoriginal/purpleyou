"use client";

import { useState } from "react";
import { Product, Variant, VariantAttribute } from "@/types/product";
import VariantSelector from "./VariantSelector";
import VariantDisplay from "./VariantDisplay";
import AddToCartButton from "./AddToCartButton";
import QuantitySelector from "./QuantitySelector";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined);
  const [selectedAttributes, setSelectedAttributes] = useState<VariantAttribute>({});
  const [quantity, setQuantity] = useState(1);

  const handleVariantSelect = (variant: Variant | null, attributes: VariantAttribute) => {
    setSelectedVariant(variant || undefined);
    setSelectedAttributes(attributes);
  };

  // Use selected variant price or default to base price
  const displayPrice = selectedVariant?.resolved?.price || selectedVariant?.overrides?.price || product.base?.price;
  const displayStock = selectedVariant?.resolved?.stock || selectedVariant?.overrides?.stock || product.base?.stock;

  return (
    <>
      {/* Media Gallery - Client Component */}
      <VariantDisplay product={product} />

      {/* Right Column - Purchase Panel */}
      <div className="flex flex-col">
        {/* Product Header */}
        <div className="pb-6 border-b border-[#e6e0da]">
          <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide mb-3">
            {product.name}
          </h1>

          {/* Price & Rating */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-light text-[#111111]">
              ₹{displayPrice?.toLocaleString("en-IN") || "Price on request"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variant Selector - Client Component */}
        {product.variantSchema && Object.keys(product.variantSchema).length > 0 && (
          <VariantSelector
            product={product}
            onVariantSelect={handleVariantSelect}
          />
        )}

        {/* Stock Info */}
        <div className="py-6 border-b border-[#e6e0da]">
          {displayStock > 3 ? (
            <span className="text-sm text-green-600">
              In stock
            </span>
          ) : displayStock > 0 ? (
            <span className="text-sm text-red-600">
              {displayStock} in stock
            </span>
          ) : (
            <span className="text-sm text-red-600">Out of stock</span>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="py-6 border-b border-[#e6e0da]">
          <label className="text-sm font-medium text-[#111111] block mb-3">
            Quantity
          </label>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            maxQuantity={Math.min(10, displayStock || 10)}
            disabled={!displayStock || displayStock === 0}
          />
        </div>

        {/* Add to Cart Button - Client Component */}
        <AddToCartButton product={product} quantity={quantity} />
      </div>
    </>
  );
}
