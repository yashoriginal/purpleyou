"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { CheckoutAddressSelector } from "@/components/checkout/checkout-address-selector";
import { CheckoutSummaryItem } from "@/components/checkout/checkout-summary-item";

import {
  getDepartmentCollectionHref,
  normalizeDepartment,
} from "@/lib/departments";
import { getRazorpayKeyId, loadRazorpayScript } from "@/lib/razorpay";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { selectAuthUser } from "@/store/selectors/auth-selectors";

import {
  selectCartData,
  selectCartIsLoading,
  selectCartSubtotal,
  selectCartTotalQuantity,
} from "@/store/selectors/cart-selectors";

import { clearEntireCart } from "@/store/slices/cart-slice";
import { openAuth } from "@/store/slices/ui-slice";

import { createOrder, verifyRazorpayPayment } from "@/services/order.service";

import type { CheckoutAddress } from "@/types/address";

const SHIPPING_COST = 30;

const SHOP_ID = "purple_you";

/* =========================================================
   CHECKOUT CONTENT
========================================================= */

export function CheckoutContent() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();

  const user = useAppSelector(selectAuthUser);

  const cart = useAppSelector(selectCartData);

  const loading = useAppSelector(selectCartIsLoading);

  const subtotal = useAppSelector(selectCartSubtotal);

  const totalQuantity = useAppSelector(selectCartTotalQuantity);

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [selectedAddress, setSelectedAddress] =
    useState<CheckoutAddress | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const [checkoutActionError, setCheckoutActionError] = useState<string | null>(
    null,
  );

  /* =======================================================
     DEPARTMENT
  ======================================================= */

  const department = normalizeDepartment(searchParams.get("department"));

  const cartHref = `/cart?department=${department}`;

  const shopHref = getDepartmentCollectionHref(department, "all");

  /* =======================================================
     TOTALS
  ======================================================= */

  const shipping = cart && cart.items.length > 0 ? SHIPPING_COST : 0;

  const total = subtotal + shipping;

  /* =======================================================
     CHECKOUT ELIGIBILITY
  ======================================================= */

  const hasDevelopmentProducts =
    cart?.items.some((item) => item.productId.startsWith("DEV-")) ?? false;

  const isLoggedIn = Boolean(user?.userId);

  const hasSelectedAddress = selectedAddress !== null;

  /*
   * IMPORTANT:
   *
   * Guests are allowed to:
   *
   * - Browse products
   * - Add to cart
   * - Open cart
   * - Open checkout
   * - View order summary
   * - View shipping and total
   *
   * Authentication is required only when
   * the customer tries to continue toward
   * real payment.
   *
   * Therefore login is intentionally NOT
   * included in canClickContinue.
   */

  const canClickContinue =
    Boolean(cart?.items.length) && !hasDevelopmentProducts;

  /* =======================================================
     CONTINUE TO PAYMENT
     create PurpleYou order -> Razorpay popup -> verify
  ======================================================= */

  async function handleContinueToPayment() {
    setCheckoutActionError(null);

    if (hasDevelopmentProducts) {
      setCheckoutActionError(
        "Local test products cannot be submitted as a real order.",
      );

      return;
    }

    if (!isLoggedIn || !user?.userId) {
      dispatch(openAuth());

      return;
    }

    if (!hasSelectedAddress || !selectedAddress) {
      setCheckoutActionError(
        "Select or add a delivery address before continuing.",
      );

      return;
    }

    if (!cart || cart.items.length === 0 || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const userId = user.userId;

      const deliveryAddress = [
        selectedAddress.building,
        selectedAddress.street,
        selectedAddress.area,
        selectedAddress.city,
        selectedAddress.state,
        selectedAddress.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      const phoneNumber =
        selectedAddress.phoneNumber ||
        selectedAddress.deliveryContactNumber ||
        "";

      const order = await createOrder({
        userId,
        shopId: SHOP_ID,
        status: "pending",
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.priceEach ?? 0,
        })),
        orderDetails: {
          totalQuantity,
          totalPrice: total,
          paymentMethod: "razorpay",
        },
        deliveryDetails: {
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          deliveryAddress: deliveryAddress || selectedAddress.address,
          phoneNumber,
        },
      });

      const razorpayOrder = order.razorpayOrder;

      if (!razorpayOrder?.id) {
        throw new Error("Payment order was not created. Please try again.");
      }

      await loadRazorpayScript();

      const key = getRazorpayKeyId();

      const RazorpayCheckout = window.Razorpay;

      if (!RazorpayCheckout) {
        throw new Error("Razorpay SDK not loaded.");
      }

      const checkout = new RazorpayCheckout({
        key,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: "INR",
        prefill: {
          name: selectedAddress.fullName || selectedAddress.name || "",
          email: selectedAddress.email || "",
          contact: phoneNumber,
        },
        theme: { color: "#5540b7" },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setCheckoutActionError("Payment cancelled. Please try again.");
          },
        },
        handler: (response) => {
          void (async () => {
            try {
              await verifyRazorpayPayment({
                orderId: order.orderId,
                userId,
                shopId: SHOP_ID,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: total,
                currency: cart.currency ?? "INR",
                payment_method: "razorpay",
              });

              await dispatch(clearEntireCart()).unwrap();

              const params = new URLSearchParams({
                orderId: order.orderId,
                paymentId: response.razorpay_payment_id,
                amount: String(total),
              });

              router.push(`/order-confirmation?${params.toString()}`);
            } catch (error) {
              setCheckoutActionError(
                error instanceof Error
                  ? error.message
                  : "Payment verification failed.",
              );
              setIsProcessing(false);
            }
          })();
        },
      });

      checkout.on("payment.failed", (response: unknown) => {
        const description =
          response &&
          typeof response === "object" &&
          "error" in response &&
          response.error &&
          typeof response.error === "object" &&
          "description" in response.error
            ? String(response.error.description)
            : "Payment failed. Please try again.";

        setCheckoutActionError(description);
        setIsProcessing(false);
      });

      checkout.open();
    } catch (error) {
      setCheckoutActionError(
        error instanceof Error ? error.message : "Payment failed. Please try again.",
      );
      setIsProcessing(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <CheckoutLoading />;
  }

  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (!cart || cart.items.length === 0) {
    return <EmptyCheckout shopHref={shopHref} />;
  }

  return (
    <>
      {/* ===================================================
          CHECKOUT HEADER
      =================================================== */}

      <header
        className="
          border-b
          border-[var(--border)]
          bg-[var(--background)]
        "
      >
        <div
          className="
            site-container

            flex
            min-h-[86px]
            items-center
            justify-between
            gap-4

            lg:min-h-[104px]
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-[var(--muted-foreground)]
              "
            >
              PurpleYou
            </p>

            <h1
              className="
                mt-1

                text-2xl
                font-medium
                tracking-[-0.03em]

                sm:text-3xl
              "
            >
              Checkout
            </h1>
          </div>

          <Link
            href={cartHref}
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[var(--muted-foreground)]

              transition-colors

              hover:text-[var(--foreground)]
            "
          >
            ← Back to Bag
          </Link>
        </div>
      </header>

      {/* ===================================================
          CHECKOUT BODY
      =================================================== */}

      <section
        className="
          site-container

          py-7

          sm:py-10

          lg:py-14
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10

            lg:grid-cols-[minmax(0,1fr)_420px]
            lg:gap-16
          "
        >
          {/* ===============================================
              LEFT — CHECKOUT STEPS
          =============================================== */}

          <div className="min-w-0">
            <CheckoutProgress />

            {/* =============================================
                DELIVERY ADDRESS
            ============================================= */}

            <CheckoutSection
              number="01"
              eyebrow="Delivery"
              title="Delivery Address"
            >
              <CheckoutAddressSelector
                userId={user?.userId ?? null}
                selectedAddressId={selectedAddress?.addressId ?? null}
                onSelect={(address) => {
                  setSelectedAddress(address);

                  setCheckoutActionError(null);
                }}
              />
            </CheckoutSection>

            {/* =============================================
                DELIVERY METHOD
            ============================================= */}

            <CheckoutSection
              number="02"
              eyebrow="Shipping"
              title="Delivery Method"
            >
              <div
                className="
                  flex
                  items-start
                  gap-4

                  border
                  border-[var(--foreground)]

                  p-5
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    mt-1

                    flex
                    h-4
                    w-4
                    shrink-0
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[var(--foreground)]

                    after:h-2
                    after:w-2
                    after:rounded-full
                    after:bg-[var(--foreground)]
                  "
                />

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
                      gap-5
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Standard Shipping
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs
                          leading-5
                          text-[var(--muted-foreground)]
                        "
                      >
                        Delivered within 7 days
                      </p>
                    </div>

                    <span
                      className="
                        shrink-0

                        text-sm
                        font-medium
                      "
                    >
                      ₹30
                    </span>
                  </div>
                </div>
              </div>
            </CheckoutSection>

            {/* =============================================
                PAYMENT
            ============================================= */}

            <CheckoutSection number="03" eyebrow="Payment" title="Payment">
              <div
                className="
                  border
                  border-[var(--border)]

                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-5
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      Secure Online Payment
                    </p>

                    <p
                      className="
                        mt-1

                        text-xs
                        leading-5
                        text-[var(--muted-foreground)]
                      "
                    >
                      Pay securely using Razorpay.
                    </p>
                  </div>

                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-[var(--muted-foreground)]
                    "
                  >
                    Razorpay
                  </span>
                </div>
              </div>
            </CheckoutSection>
          </div>

          {/* ===============================================
              RIGHT — ORDER SUMMARY
          =============================================== */}

          <aside
            className="
              h-fit

              border
              border-[var(--border)]

              lg:sticky
              lg:top-28
            "
          >
            {/* =============================================
                SUMMARY HEADER
            ============================================= */}

            <div
              className="
                border-b
                border-[var(--border)]

                px-5
                py-5

                sm:px-6
              "
            >
              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.25em]
                      text-[var(--muted-foreground)]
                    "
                  >
                    Your Bag
                  </p>

                  <h2
                    className="
                      mt-1

                      text-xl
                      font-medium
                    "
                  >
                    Order Summary
                  </h2>
                </div>

                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.16em]
                    text-[var(--muted-foreground)]
                  "
                >
                  {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>

            {/* =============================================
                PRODUCTS
            ============================================= */}

            <div
              className="
                max-h-[320px]
                overflow-y-auto

                border-b
                border-[var(--border)]
              "
            >
              {cart.items.map((item) => (
                <CheckoutSummaryItem
                  key={createItemKey(item)}
                  item={item}
                  fallbackCurrency={cart.currency}
                />
              ))}
            </div>

            {/* =============================================
                TOTALS
            ============================================= */}

            <div
              className="
                px-5
                py-5

                sm:px-6
              "
            >
              <div
                className="
                  space-y-3
                  text-sm
                "
              >
                <SummaryRow
                  label="Subtotal"
                  value={formatPrice(subtotal, cart.currency)}
                />

                <SummaryRow label="Standard Shipping" value="₹30" />
              </div>

              <div
                className="
                  mt-5

                  flex
                  items-center
                  justify-between
                  gap-5

                  border-t
                  border-[var(--border)]

                  pt-5
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-[0.14em]
                    "
                  >
                    Total
                  </p>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      text-[var(--muted-foreground)]
                    "
                  >
                    INR
                  </p>
                </div>

                <strong
                  className="
                    text-2xl
                    font-medium
                  "
                >
                  {formatPrice(total, cart.currency)}
                </strong>
              </div>

              {/* ===========================================
                  CONTINUE TO PAYMENT
              =========================================== */}

              <button
                type="button"
                disabled={!canClickContinue || isProcessing}
                onClick={() => {
                  void handleContinueToPayment();
                }}
                className="
                  mt-6

                  flex
                  min-h-14
                  w-full
                  items-center
                  justify-center

                  bg-[var(--foreground)]

                  px-6

                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[var(--background)]

                  transition-opacity

                  hover:opacity-85

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {isProcessing ? "Processing Payment..." : "Continue to Payment"}
              </button>

              {/* ===========================================
                  GUEST MESSAGE
              =========================================== */}

              {!isLoggedIn && !hasDevelopmentProducts && (
                <p
                  className="
                      mt-3

                      text-center
                      text-[10px]
                      leading-5
                      text-[var(--muted-foreground)]
                    "
                >
                  You&apos;ll be asked to sign in before payment.
                </p>
              )}

              {/* ===========================================
                  DEV PRODUCT BLOCK
              =========================================== */}

              {hasDevelopmentProducts && (
                <p
                  className="
                    mt-3

                    text-center
                    text-[10px]
                    leading-5
                    text-[var(--muted-foreground)]
                  "
                >
                  Local test products cannot be submitted as a real order.
                </p>
              )}

              {/* ===========================================
                  ACTION ERROR
              =========================================== */}

              {checkoutActionError && (
                <p
                  role="alert"
                  className="
                    mt-3

                    text-center
                    text-[10px]
                    leading-5
                    text-red-600
                  "
                >
                  {checkoutActionError}
                </p>
              )}

              {/* ===========================================
                  SECURE CHECKOUT NOTE
              =========================================== */}

              <div
                className="
                  mt-4
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    leading-5
                    tracking-[0.13em]
                    text-[var(--muted-foreground)]
                  "
                >
                  Secure checkout · Standard shipping ₹30
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   CHECKOUT PROGRESS
========================================================= */

function CheckoutProgress() {
  return (
    <div
      className="
        mb-8

        grid
        grid-cols-3

        border-y
        border-[var(--border)]
      "
    >
      <ProgressItem number="01" label="Delivery" active />

      <ProgressItem number="02" label="Review" />

      <ProgressItem number="03" label="Payment" />
    </div>
  );
}

/* =========================================================
   PROGRESS ITEM
========================================================= */

function ProgressItem({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
        relative

        py-4

        ${
          active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
        }
      `}
    >
      <p
        className="
          text-[8px]
          uppercase
          tracking-[0.18em]
        "
      >
        {number}
      </p>

      <p
        className="
          mt-1

          text-[10px]
          font-medium
          uppercase
          tracking-[0.12em]
        "
      >
        {label}
      </p>

      {active && (
        <span
          aria-hidden="true"
          className="
            absolute
            bottom-[-1px]
            left-0

            h-[2px]
            w-12

            bg-[var(--foreground)]
          "
        />
      )}
    </div>
  );
}

/* =========================================================
   CHECKOUT SECTION
========================================================= */

function CheckoutSection({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        border-b
        border-[var(--border)]

        py-8

        first:pt-0
      "
    >
      <div
        className="
          mb-5

          flex
          items-start
          gap-4
        "
      >
        <span
          className="
            pt-1

            text-[9px]
            text-[var(--muted-foreground)]
          "
        >
          {number}
        </span>

        <div>
          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.24em]
              text-[var(--muted-foreground)]
            "
          >
            {eyebrow}
          </p>

          <h2
            className="
              mt-1

              text-2xl
              font-medium
              tracking-[-0.03em]
            "
          >
            {title}
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        flex
        justify-between
        gap-5
      "
    >
      <span
        className="
          text-[var(--muted-foreground)]
        "
      >
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}

/* =========================================================
   EMPTY CHECKOUT
========================================================= */

function EmptyCheckout({ shopHref }: { shopHref: string }) {
  return (
    <section
      className="
        site-container

        flex
        min-h-[60vh]
        items-center
        justify-center

        py-16

        text-center
      "
    >
      <div className="max-w-md">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.28em]
            text-[var(--muted-foreground)]
          "
        >
          Checkout
        </p>

        <h1
          className="
            mt-4

            text-4xl
            font-medium
            tracking-[-0.04em]
          "
        >
          Your bag is empty.
        </h1>

        <p
          className="
            mt-4

            text-sm
            leading-7
            text-[var(--muted-foreground)]
          "
        >
          Add something to your bag before continuing to checkout.
        </p>

        <Link
          href={shopHref}
          className="
            mt-8

            inline-flex
            min-h-12
            items-center
            justify-center

            bg-[var(--foreground)]

            px-7

            text-[10px]
            font-medium
            uppercase
            tracking-[0.2em]
            text-[var(--background)]
          "
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

/* =========================================================
   LOADING
========================================================= */

function CheckoutLoading() {
  return (
    <div
      className="
        site-container

        flex
        min-h-[60vh]
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
        Loading checkout...
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function createItemKey(item: {
  productId: string;
  quantity: number;

  variant?: {
    size?: string;
    color?: string;
    material?: string;
  };
}) {
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
