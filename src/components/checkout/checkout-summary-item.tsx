"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getCartProductSummary,
  type CartProductSummary,
} from "@/services/cart-product.service";

import type { CartApiItem } from "@/types/cart";

interface CheckoutSummaryItemProps {
  item: CartApiItem;
  fallbackCurrency?: string;
}

export function CheckoutSummaryItem({
  item,
  fallbackCurrency = "INR",
}: CheckoutSummaryItemProps) {
  const [productState, setProductState] = useState<{
    productId: string;
    product: CartProductSummary | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getCartProductSummary(item.productId)
      .then((product) => {
        if (cancelled) {
          return;
        }

        setProductState({
          productId: item.productId,

          product,
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setProductState({
          productId: item.productId,

          product: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [item.productId]);

  const loaded = productState?.productId === item.productId;

  const product = loaded ? productState.product : null;

  const productHref = product
    ? product.department
      ? `/products/${product.slug}?department=${product.department}`
      : `/products/${product.slug}`
    : null;

  const productName =
    product?.name ?? (loaded ? "Product unavailable" : "Loading product...");

  const image = (
    <div
      className="
        h-[72px]
        w-[72px]
        shrink-0
        overflow-hidden
        bg-[var(--surface)]
      "
    >
      {product?.imageUrl ? (
        <div
          role="img"
          aria-label={productName}
          className="
            h-full
            w-full
            bg-contain
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage: `url("${product.imageUrl}")`,
          }}
        />
      ) : (
        <div
          className="
            flex
            h-full
            items-center
            justify-center

            px-2

            text-center
            text-[8px]
            uppercase
            tracking-[0.12em]
            text-[var(--muted-foreground)]
          "
        >
          {loaded ? "No image" : "Loading"}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="
        border-b
        border-[var(--border)]

        px-5
        py-5

        last:border-b-0

        sm:px-6
      "
    >
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        {/* IMAGE */}

        {productHref ? (
          <Link href={productHref} aria-label={`View ${productName}`}>
            {image}
          </Link>
        ) : (
          image
        )}

        {/* DETAILS */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div className="min-w-0">
              {productHref ? (
                <Link
                  href={productHref}
                  className="
                    block
                    transition-opacity

                    hover:opacity-60
                  "
                >
                  <p
                    className="
                      line-clamp-2
                      text-xs
                      font-medium
                      leading-5
                    "
                  >
                    {productName}
                  </p>
                </Link>
              ) : (
                <p
                  className="
                    line-clamp-2
                    text-xs
                    font-medium
                    leading-5
                  "
                >
                  {productName}
                </p>
              )}

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[var(--muted-foreground)]
                "
              >
                Qty: {item.quantity}
              </p>

              <CheckoutSummaryVariant item={item} />
            </div>

            <span
              className="
                shrink-0
                text-xs
                font-medium
              "
            >
              {formatPrice(
                (item.priceEach ?? 0) * item.quantity,

                item.currency ?? fallbackCurrency,
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VARIANT
========================================================= */

function CheckoutSummaryVariant({ item }: { item: CartApiItem }) {
  const values = [
    item.variant?.size ? `Size: ${item.variant.size}` : null,

    item.variant?.color ? `Color: ${item.variant.color}` : null,

    item.variant?.material ? `Material: ${item.variant.material}` : null,
  ].filter(Boolean);

  if (values.length === 0) {
    return null;
  }

  return (
    <p
      className="
        mt-1
        text-[9px]
        leading-4
        text-[var(--muted-foreground)]
      "
    >
      {values.join(" · ")}
    </p>
  );
}

/* =========================================================
   PRICE
========================================================= */

function formatPrice(value: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}
