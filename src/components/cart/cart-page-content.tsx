"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { EmptyCart } from "@/components/cart/empty-cart";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectCartData,
  selectCartIsLoading,
  selectCartIsMutating,
  selectCartSubtotal,
  selectCartTotalQuantity,
} from "@/store/selectors/cart-selectors";

import {
  removeItemFromCart,
  updateCartQuantity,
} from "@/store/slices/cart-slice";

import {
  getCartProductSummary,
  type CartProductSummary,
} from "@/services/cart-product.service";

import type { CartApiItem } from "@/types/cart";

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,

    // Client snapshot
    () => true,

    // Server + first hydration snapshot
    () => false,
  );
}

export function CartPageContent() {
  const hasHydratedClient = useHasHydratedClient();

  const cart = useAppSelector(selectCartData);

  const loading = useAppSelector(selectCartIsLoading);

  const mutating = useAppSelector(selectCartIsMutating);

  const subtotal = useAppSelector(selectCartSubtotal);

  const quantity = useAppSelector(selectCartTotalQuantity);

  if (!hasHydratedClient) {
    return <CartLoading />;
  }

  if (loading) {
    return <CartLoading />;
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section
      className="
        site-container
        py-8
        sm:py-10
        lg:py-14
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-12
          lg:grid-cols-[minmax(0,1fr)_380px]
          lg:gap-16
        "
      >
        {/* Items */}
        <div>
          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              border-b
              border-[var(--border)]
              pb-5
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.22em]
                text-[var(--muted-foreground)]
              "
            >
              {quantity} {quantity === 1 ? "Item" : "Items"}
            </p>
          </div>

          <div>
            {cart.items.map((item) => (
              <CartPageItem
                key={createCartItemKey(item)}
                item={item}
                disabled={mutating}
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        <aside
          className="
            h-fit
            border
            border-[var(--border)]
            p-6
            lg:sticky
            lg:top-28
          "
        >
          <h2
            className="
              text-lg
              font-medium
            "
          >
            Order Summary
          </h2>

          <div
            className="
              mt-6
              space-y-4
              border-b
              border-[var(--border)]
              pb-6
            "
          >
            <div
              className="
                flex
                justify-between
                gap-5
                text-sm
              "
            >
              <span
                className="
                  text-[var(--muted-foreground)]
                "
              >
                Subtotal
              </span>

              <span>{formatPrice(subtotal, cart.currency)}</span>
            </div>

            <div
              className="
                flex
                justify-between
                gap-5
                text-sm
              "
            >
              <span
                className="
                  text-[var(--muted-foreground)]
                "
              >
                Shipping
              </span>

              <span>Calculated at checkout</span>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              gap-5
              py-6
            "
          >
            <span
              className="
                text-sm
                font-medium
                uppercase
                tracking-[0.12em]
              "
            >
              Total
            </span>

            <span
              className="
                text-xl
                font-medium
              "
            >
              {formatPrice(subtotal, cart.currency)}
            </span>
          </div>

          <button
            type="button"
            disabled
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
              opacity-50
            "
          >
            Checkout Coming Soon
          </button>

          <Link
            href="/collections/all"
            className="
              mt-5
              flex
              justify-center
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-[var(--muted-foreground)]
              underline
              underline-offset-4
            "
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

function CartPageItem({
  item,
  disabled,
}: {
  item: CartApiItem;
  disabled: boolean;
}) {
  const dispatch = useAppDispatch();

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

  function decrease() {
    if (item.quantity <= 1) {
      return;
    }

    void dispatch(
      updateCartQuantity({
        productId: item.productId,
        quantity: item.quantity - 1,
        variant: item.variant,
      }),
    );
  }

  function increase() {
    void dispatch(
      updateCartQuantity({
        productId: item.productId,
        quantity: item.quantity + 1,
        variant: item.variant,
      }),
    );
  }

  function remove() {
    void dispatch(
      removeItemFromCart({
        productId: item.productId,
        variant: item.variant,
      }),
    );
  }

  return (
    <article
      className="
        grid
        grid-cols-[110px_minmax(0,1fr)]
        gap-5
        border-b
        border-[var(--border)]
        py-6
        sm:grid-cols-[150px_minmax(0,1fr)]
        sm:gap-7
      "
    >
      <div
        className="
          aspect-square
          overflow-hidden
          bg-[var(--surface)]
        "
      >
        {product?.imageUrl ? (
          <div
            role="img"
            aria-label={product.name}
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
              text-[9px]
              uppercase
              tracking-[0.16em]
              text-[var(--muted-foreground)]
            "
          >
            {loaded ? "Image unavailable" : "Loading"}
          </div>
        )}
      </div>

      <div
        className="
          flex
          min-w-0
          flex-col
        "
      >
        <h2
          className="
            text-sm
            font-medium
            sm:text-base
          "
        >
          {product?.name ??
            (loaded ? "Product unavailable" : "Loading product...")}
        </h2>

        <CartVariant item={item} />

        <p
          className="
            mt-3
            text-sm
          "
        >
          {formatPrice(item.priceEach ?? 0, item.currency)}
        </p>

        <div
          className="
            mt-auto
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
            pt-5
          "
        >
          <div
            className="
              inline-flex
              h-10
              items-center
              border
              border-[var(--border)]
            "
          >
            <button
              type="button"
              disabled={disabled || item.quantity <= 1}
              onClick={decrease}
              className="
                h-full
                w-10
                disabled:opacity-30
              "
            >
              −
            </button>

            <span
              className="
                min-w-9
                text-center
                text-sm
              "
            >
              {item.quantity}
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={increase}
              className="
                h-full
                w-10
                disabled:opacity-30
              "
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={remove}
            className="
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-[var(--muted-foreground)]
              underline
              underline-offset-4
              disabled:opacity-40
            "
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

function CartVariant({ item }: { item: CartApiItem }) {
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
        mt-2
        text-xs
        leading-5
        text-[var(--muted-foreground)]
      "
    >
      {values.join(" · ")}
    </p>
  );
}

function CartLoading() {
  return (
    <div
      className="
        site-container
        flex
        min-h-[50vh]
        items-center
        justify-center
      "
    >
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-[var(--muted-foreground)]
        "
      >
        Loading your bag...
      </p>
    </div>
  );
}

function createCartItemKey(item: CartApiItem) {
  return [
    item.productId,
    item.variant?.size ?? "",
    item.variant?.color ?? "",
    item.variant?.material ?? "",
  ].join("-");
}

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
