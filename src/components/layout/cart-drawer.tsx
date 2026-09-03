"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CloseIcon } from "@/components/ui/icons";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { closeCart, openAuth } from "@/store/slices/ui-slice";

import {
  getCartProductSummary,
  type CartProductSummary,
} from "@/services/cart-product.service";

import {
  removeItemFromCart,
  updateCartQuantity,
} from "@/store/slices/cart-slice";

import {
  selectCartData,
  selectCartError,
  selectCartIsLoading,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalQuantity,
  selectCartIsMutating,
} from "@/store/selectors/cart-selectors";

import { selectAuthStatus } from "@/store/selectors/auth-selectors";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const isMutating = useAppSelector(selectCartIsMutating);

  const isOpen = useAppSelector((state) => state.ui.cartOpen);

  const authStatus = useAppSelector(selectAuthStatus);

  const cart = useAppSelector(selectCartData);

  const items = useAppSelector(selectCartItems);

  const totalQuantity = useAppSelector(selectCartTotalQuantity);

  const subtotal = useAppSelector(selectCartSubtotal);

  const isLoading = useAppSelector(selectCartIsLoading);

  const error = useAppSelector(selectCartError);

  const isAuthenticated = authStatus === "authenticated";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(closeCart());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dispatch]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleSignIn = () => {
    dispatch(closeCart());
    dispatch(openAuth());
  };

  return (
    <div
      className="fixed inset-0 z-[100]"
      aria-modal="true"
      role="dialog"
      aria-label="Shopping bag"
    >
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={handleClose}
        className="absolute inset-0 bg-black/70"
      />

      <aside
        className="
          absolute right-0 top-0
          flex h-full
          w-full max-w-[480px]
          flex-col
          border-l border-[var(--border)]
          bg-[var(--background)]
        "
      >
        <header
          className="
            flex min-h-[88px]
            items-center justify-between
            border-b border-[var(--border)]
            px-5 sm:px-7
          "
        >
          <div>
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.3em]
                text-[var(--muted-foreground)]
              "
            >
              PurpleYou
            </p>

            <h2 className="mt-1 text-lg font-medium">
              Shopping Bag
              {totalQuantity > 0 ? ` (${totalQuantity})` : ""}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close shopping bag"
            className="
              flex h-11 w-11
              items-center justify-center
              transition-opacity
              hover:opacity-60
            "
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          {!isAuthenticated ? (
            <GuestCart onSignIn={handleSignIn} onClose={handleClose} />
          ) : isLoading && !cart ? (
            <CartLoading />
          ) : error && !cart ? (
            <CartError message={error} />
          ) : items.length === 0 ? (
            <EmptyCart onClose={handleClose} />
          ) : (
            <>
              <div
                className="
                  flex-1 overflow-y-auto
                  px-5 py-2 sm:px-7
                "
              >
                {items.map((item) => (
                  <CartItemRow
                    key={[
                      item.productId,
                      item.variant?.size ?? "",
                      item.variant?.color ?? "",
                      item.variant?.material ?? "",
                    ].join("-")}
                    productId={item.productId}
                    quantity={item.quantity}
                    priceEach={item.priceEach}
                    currency={item.currency ?? cart?.currency}
                    size={item.variant?.size}
                    color={item.variant?.color}
                    material={item.variant?.material}
                    disabled={isMutating}
                    onDecrease={() => {
                      void dispatch(
                        updateCartQuantity({
                          productId: item.productId,
                          quantity: item.quantity - 1,
                          variant: item.variant,
                        }),
                      );
                    }}
                    onIncrease={() => {
                      void dispatch(
                        updateCartQuantity({
                          productId: item.productId,
                          quantity: item.quantity + 1,
                          variant: item.variant,
                        }),
                      );
                    }}
                    onRemove={() => {
                      void dispatch(
                        removeItemFromCart({
                          productId: item.productId,
                          variant: item.variant,
                        }),
                      );
                    }}
                  />
                ))}
              </div>

              <CartSummary subtotal={subtotal} currency={cart?.currency} />
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

interface GuestCartProps {
  onSignIn: () => void;
  onClose: () => void;
}

function GuestCart({ onSignIn, onClose }: GuestCartProps) {
  return (
    <div
      className="
        flex flex-1 flex-col
        items-center justify-center
        px-7 text-center
      "
    >
      <p
        className="
          text-xs uppercase
          tracking-[0.28em]
          text-[var(--muted-foreground)]
        "
      >
        Your Bag
      </p>

      <h3 className="mt-4 text-2xl font-medium">Sign in to view your bag</h3>

      <p
        className="
          mt-3 max-w-sm
          text-sm leading-6
          text-[var(--muted-foreground)]
        "
      >
        Your PurpleYou shopping bag is connected to your account.
      </p>

      <button
        type="button"
        onClick={onSignIn}
        className="
          mt-8 w-full max-w-sm
          bg-[var(--foreground)]
          px-6 py-4
          text-sm font-medium
          uppercase tracking-[0.2em]
          text-[var(--background)]
          transition-opacity
          hover:opacity-85
        "
      >
        Sign In
      </button>

      <Link
        href="/collections/all"
        onClick={onClose}
        className="
          mt-4 w-full max-w-sm
          border border-[var(--border)]
          px-6 py-4
          text-sm
          uppercase tracking-[0.2em]
          transition-colors
          hover:bg-[var(--surface)]
        "
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function CartLoading() {
  return (
    <div
      className="
        flex flex-1
        items-center justify-center
        px-7
      "
    >
      <p
        className="
          text-xs uppercase
          tracking-[0.28em]
          text-[var(--muted-foreground)]
        "
      >
        Loading your bag...
      </p>
    </div>
  );
}

interface CartErrorProps {
  message: string;
}

function CartError({ message }: CartErrorProps) {
  return (
    <div
      className="
        flex flex-1 flex-col
        items-center justify-center
        px-7 text-center
      "
    >
      <h3 className="text-xl font-medium">Unable to load your bag</h3>

      <p
        className="
          mt-3 text-sm
          text-[var(--muted-foreground)]
        "
      >
        {message}
      </p>
    </div>
  );
}

interface EmptyCartProps {
  onClose: () => void;
}

function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div
      className="
        flex flex-1 flex-col
        items-center justify-center
        px-7 text-center
      "
    >
      <p
        className="
          text-xs uppercase
          tracking-[0.28em]
          text-[var(--muted-foreground)]
        "
      >
        Your Bag
      </p>

      <h3 className="mt-4 text-2xl font-medium">Your bag is empty</h3>

      <p
        className="
          mt-3 text-sm leading-6
          text-[var(--muted-foreground)]
        "
      >
        Discover something made to become part of your everyday.
      </p>

      <Link
        href="/collections/all"
        onClick={onClose}
        className="
          mt-8 w-full max-w-sm
          bg-[var(--foreground)]
          px-6 py-4
          text-sm font-medium
          uppercase tracking-[0.2em]
          text-[var(--background)]
          transition-opacity
          hover:opacity-85
        "
      >
        Shop All
      </Link>
    </div>
  );
}

interface CartItemRowProps {
  productId: string;
  quantity: number;
  priceEach?: number;
  currency?: string;
  size?: string;
  color?: string;
  material?: string;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

function CartItemRow({
  productId,
  quantity,
  priceEach,
  currency,
  size,
  color,
  material,
  disabled,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemRowProps) {
  const [productState, setProductState] = useState<{
    productId: string;
    product: CartProductSummary | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getCartProductSummary(productId)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setProductState({
          productId,
          product: result,
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setProductState({
          productId,
          product: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const productLoaded = productState?.productId === productId;

  const product = productLoaded ? productState.product : null;

  const variantDetails = [
    size ? `Size: ${size}` : null,
    color ? `Color: ${color}` : null,
    material ? `Material: ${material}` : null,
  ].filter(Boolean);

  const productName =
    product?.name ??
    (productLoaded ? "Product unavailable" : "Loading product...");

  return (
    <article
      className="
        border-b
        border-[var(--border)]
        py-6
      "
    >
      <div className="flex gap-4">
        <div
          className="
            flex h-[120px]
            w-[96px]
            shrink-0
            items-center
            justify-center
            overflow-hidden
            bg-[var(--surface)]
            bg-cover
            bg-center
          "
          style={
            product?.imageUrl
              ? {
                  backgroundImage: `url("${product.imageUrl}")`,
                }
              : undefined
          }
          role={product?.imageUrl ? "img" : undefined}
          aria-label={product?.imageUrl ? productName : undefined}
        >
          {!product?.imageUrl && productLoaded && (
            <span
              className="
                  px-2
                  text-center
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  text-[var(--muted-foreground)]
                "
            >
              No image
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              justify-between
              gap-4
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  text-[var(--muted-foreground)]
                "
              >
                PurpleYou
              </p>

              <h3
                className="
                  mt-2
                  text-sm
                  font-medium
                  leading-5
                "
              >
                {productName}
              </h3>
            </div>

            {typeof priceEach === "number" && (
              <p className="shrink-0 text-sm">
                {formatMoney(priceEach * quantity, currency)}
              </p>
            )}
          </div>

          {variantDetails.length > 0 && (
            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[var(--muted-foreground)]
              "
            >
              {variantDetails.join(" · ")}
            </p>
          )}

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                border
                border-[var(--border)]
              "
            >
              <button
                type="button"
                onClick={onDecrease}
                disabled={disabled || quantity <= 1}
                aria-label="Decrease quantity"
                className="
                  flex h-9 w-9
                  items-center
                  justify-center
                  transition-colors
                  hover:bg-[var(--surface)]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                −
              </button>

              <span
                className="
                  min-w-9
                  text-center
                  text-xs
                "
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={disabled}
                aria-label="Increase quantity"
                className="
                  flex h-9 w-9
                  items-center
                  justify-center
                  transition-colors
                  hover:bg-[var(--surface)]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[var(--muted-foreground)]
                underline
                underline-offset-4
                transition-opacity
                hover:opacity-60
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
interface CartSummaryProps {
  subtotal: number;
  currency?: string;
}

function CartSummary({ subtotal, currency }: CartSummaryProps) {
  const dispatch = useAppDispatch();
  return (
    <footer
      className="
        border-t border-[var(--border)]
        bg-[var(--background)]
        px-5 py-6 sm:px-7
      "
    >
      <div
        className="
          flex items-center
          justify-between gap-4
        "
      >
        <span
          className="
            text-xs uppercase
            tracking-[0.2em]
            text-[var(--muted-foreground)]
          "
        >
          Subtotal
        </span>

        <strong className="text-lg font-medium">
          {formatMoney(subtotal, currency)}
        </strong>
      </div>

      <p
        className="
          mt-2 text-xs
          text-[var(--muted-foreground)]
        "
      >
        Shipping and taxes are calculated at checkout.
      </p>
      <Link
        href="/cart"
        onClick={() => dispatch(closeCart())}
        className="
    mt-5
    flex
    min-h-12
    w-full
    items-center
    justify-center
    border
    border-[var(--border)]
    px-5
    text-[10px]
    font-medium
    uppercase
    tracking-[0.2em]
    transition-colors
    hover:border-[var(--foreground)]
  "
      >
        View Bag
      </Link>

      <button
        type="button"
        disabled
        className="
          mt-5 w-full
          bg-[var(--foreground)]
          px-6 py-4
          text-sm font-medium
          uppercase tracking-[0.2em]
          text-[var(--background)]
          opacity-50
        "
      >
        Checkout
      </button>
    </footer>
  );
}

function formatMoney(amount: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}
