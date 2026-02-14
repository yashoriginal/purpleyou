"use client";

import { useState, useMemo, useEffect } from "react";
import { Product, Variant, VariantAttribute } from "@/types/product";

interface VariantSelectorProps {
  product: Product;
  onVariantSelect: (variant: Variant | null, attributes: VariantAttribute) => void;
}

export default function VariantSelector({
  product,
  onVariantSelect,
}: VariantSelectorProps) {
  // Initialize with first available option for each variant key
  const getDefaultAttributes = useMemo(() => {
    const defaults: VariantAttribute = {};
    const variantKeys = Object.keys(product.variantSchema || {});
    const availableOptions: Record<string, Set<string>> = {};

    variantKeys.forEach((key) => {
      availableOptions[key] = new Set<string>();
    });

    // Collect all available options
    product.variants?.forEach((variant) => {
      variantKeys.forEach((key) => {
        if (variant.attributes[key]) {
          availableOptions[key].add(variant.attributes[key]);
        }
      });
    });

    // Set first option for each key
    variantKeys.forEach((key) => {
      const options = Array.from(availableOptions[key] || []).sort();
      if (options.length > 0) {
        defaults[key] = options[0];
      }
    });

    return defaults;
  }, [product.variantSchema, product.variants]);

  const [selectedAttributes, setSelectedAttributes] = useState<VariantAttribute>(
    getDefaultAttributes
  );

  // Get variant schema keys (like "color", "size", "material")
  const variantKeys = useMemo(() => {
    return Object.keys(product.variantSchema || {});
  }, [product.variantSchema]);

  // Get only the available options that exist in the variants array
  const availableOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    variantKeys.forEach((key) => {
      options[key] = new Set<string>();
    });

    // Add only options that are present in actual variants
    product.variants?.forEach((variant) => {
      variantKeys.forEach((key) => {
        if (variant.attributes[key]) {
          options[key].add(variant.attributes[key]);
        }
      });
    });

    return options;
  }, [product.variants, variantKeys]);

  // Find matching variant based on selected attributes
  const selectedVariant = useMemo(() => {
    if (variantKeys.length === 0) return null;

    // Check if all attributes are selected
    const allSelected = variantKeys.every((key) => selectedAttributes[key]);
    if (!allSelected) return null;

    // Find variant that matches selected attributes
    return (
      product.variants?.find((v) => {
        return variantKeys.every((key) => v.attributes[key] === selectedAttributes[key]);
      }) || null
    );
  }, [selectedAttributes, variantKeys, product.variants]);

  // Call callback when variant changes
  const handleAttributeChange = (key: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [key]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variant and notify parent
    const allSelected = variantKeys.every((k) => newAttributes[k]);
    if (allSelected) {
      const matching = product.variants?.find((v) => {
        return variantKeys.every((k) => v.attributes[k] === newAttributes[k]);
      });
      onVariantSelect(matching || null, newAttributes);
    } else {
      onVariantSelect(null, newAttributes);
    }
  };

  // Call parent callback with default selected variant on mount
  useEffect(() => {
    if (variantKeys.length > 0) {
      const allSelected = variantKeys.every((key) => selectedAttributes[key]);
      if (allSelected) {
        const matchingVariant = product.variants?.find((v) => {
          return variantKeys.every((k) => v.attributes[k] === selectedAttributes[k]);
        });
        onVariantSelect(matchingVariant || null, selectedAttributes);
      }
    }
  }, []); // Run only on mount

  // Don't render if no variants
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 py-6 border-y border-[#e6e0da]">
      {variantKeys.map((key) => {
        const options = Array.from(availableOptions[key] || []).sort();
        const selectedValue = selectedAttributes[key];

        return (
          <div key={key}>
            <label className="block text-sm font-medium text-[#111111] mb-3 capitalize">
              {key}
            </label>
            <div className="flex flex-wrap gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAttributeChange(key, option)}
                  className={`px-4 py-2 text-sm border transition-all ${
                    selectedValue === option
                      ? "border-[#5540b7] bg-[#5540b7] text-white"
                      : "border-[#d0cccc] text-[#111111] hover:border-[#5540b7]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Stock and Price Info */}
      {selectedVariant && (
        <div className="mt-6 pt-6 border-t border-[#e6e0da]">
          <div className="space-y-2">
            {selectedVariant.overrides?.stock !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6b6b]">Stock:</span>
                <span
                  className={
                    selectedVariant.overrides.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {selectedVariant.overrides.stock > 0
                    ? `${selectedVariant.overrides.stock} available`
                    : "Out of stock"}
                </span>
              </div>
            )}
            {selectedVariant.overrides?.price !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6b6b]">Variant Price:</span>
                <span className="font-medium text-[#111111]">
                  ₹{selectedVariant.overrides.price.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
