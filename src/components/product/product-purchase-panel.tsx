"use client";

import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";

import type { CartItemVariant } from "@/types/cart";

interface ProductPurchasePanelProps {
  productId: string;
  price: number;
  currency?: string;
  stock: number;
  isOutOfStock: boolean;
  variantSchema?: Record<string, unknown>;
}

export function ProductPurchasePanel({
  productId,
  price,
  currency = "INR",
  stock,
  isOutOfStock,
  variantSchema,
}: ProductPurchasePanelProps) {
  const options = useMemo(
    () => normalizeVariantSchema(variantSchema),
    [variantSchema],
  );

  const [quantity, setQuantity] = useState(1);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      options.map(([name, values]) => [
        name,
        values.length === 1 ? values[0] : "",
      ]),
    ),
  );

  const allRequiredSelected = options.every(([name]) =>
    Boolean(selectedVariants[name]),
  );

  const variant: CartItemVariant = {
    size: selectedVariants.size ?? selectedVariants.Size,

    color: selectedVariants.color ?? selectedVariants.Color,

    material: selectedVariants.material ?? selectedVariants.Material,
  };

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(Math.max(stock, 1), current + 1));
  }

  return (
    <div className="mt-8">
      {options.length > 0 && (
        <div className="space-y-7">
          {options.map(([name, values]) => (
            <div key={name}>
              <div className="mb-3 flex items-center justify-between">
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.22em]
                  "
                >
                  {formatOptionName(name)}
                </p>

                {selectedVariants[name] && (
                  <span
                    className="
                      text-xs
                      text-[var(--muted-foreground)]
                    "
                  >
                    {selectedVariants[name]}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const selected = selectedVariants[name] === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelectedVariants((current) => ({
                          ...current,
                          [name]: value,
                        }))
                      }
                      className={`
                        min-w-14
                        border
                        px-4
                        py-3
                        text-xs
                        uppercase
                        tracking-[0.12em]
                        transition
                        ${
                          selected
                            ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                            : "border-[var(--border)] hover:border-[var(--foreground)]"
                        }
                      `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="
          mt-8
          border-t
          border-[var(--border)]
          pt-7
        "
      >
        <p
          className="
            mb-3
            text-[10px]
            uppercase
            tracking-[0.22em]
          "
        >
          Quantity
        </p>

        <div
          className="
            inline-flex
            h-12
            items-center
            border
            border-[var(--border)]
          "
        >
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="
              flex
              h-full
              w-12
              items-center
              justify-center
              text-lg
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            −
          </button>

          <span className="min-w-10 text-center text-sm">{quantity}</span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={isOutOfStock || quantity >= stock}
            aria-label="Increase quantity"
            className="
              flex
              h-full
              w-12
              items-center
              justify-center
              text-lg
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-7">
        <AddToCartButton
          productId={productId}
          priceEach={price}
          currency={currency}
          quantity={quantity}
          variant={variant}
          disabled={isOutOfStock || !allRequiredSelected}
          className="
            flex
            min-h-14
            w-full
            items-center
            justify-center
            bg-[var(--foreground)]
            px-6
            text-xs
            font-medium
            uppercase
            tracking-[0.2em]
            text-[var(--background)]
            transition-opacity
            hover:opacity-85
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        />
      </div>

      {!allRequiredSelected && !isOutOfStock && (
        <p
          className="
              mt-3
              text-xs
              text-[var(--muted-foreground)]
            "
        >
          Select all available options before adding this piece to your bag.
        </p>
      )}
    </div>
  );
}

function normalizeVariantSchema(
  schema?: Record<string, unknown>,
): [string, string[]][] {
  if (!schema) {
    return [];
  }

  return Object.entries(schema)
    .map(([name, rawValue]) => {
      const values = Array.isArray(rawValue)
        ? rawValue.filter(
            (value): value is string =>
              typeof value === "string" && value.trim().length > 0,
          )
        : typeof rawValue === "string" && rawValue.trim().length > 0
          ? [rawValue]
          : [];

      return [name, values] as [string, string[]];
    })
    .filter(([, values]) => values.length > 0);
}

function formatOptionName(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}
