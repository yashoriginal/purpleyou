"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  getDepartmentCollectionHref,
  normalizeDepartment,
} from "@/lib/departments";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();

  const department = normalizeDepartment(searchParams.get("department"));

  const orderId = searchParams.get("orderId") ?? "";
  const paymentId = searchParams.get("paymentId") ?? "";
  const amount = searchParams.get("amount") ?? "";

  const shopHref = getDepartmentCollectionHref(department, "all");

  return (
    <section className="site-container flex min-h-[60vh] items-center justify-center py-16 text-center">
      <div className="max-w-md">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
          PurpleYou
        </p>

        <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em]">
          Order confirmed.
        </h1>

        <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
          Thank you for shopping with PurpleYou. Your payment was verified
          successfully.
        </p>

        {(orderId || paymentId || amount) && (
          <div className="mt-8 border border-[var(--border)] p-5 text-left text-xs leading-6">
            {orderId && (
              <p>
                <span className="text-[var(--muted-foreground)]">Order ID: </span>
                {orderId}
              </p>
            )}
            {paymentId && (
              <p>
                <span className="text-[var(--muted-foreground)]">
                  Payment ID:{" "}
                </span>
                {paymentId}
              </p>
            )}
            {amount && (
              <p>
                <span className="text-[var(--muted-foreground)]">
                  Amount paid:{" "}
                </span>
                ₹{amount}
              </p>
            )}
          </div>
        )}

        <Link
          href={shopHref}
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-[var(--foreground)] px-7 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--background)]"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="site-container py-16">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
