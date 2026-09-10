import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout | PurpleYou",
  description: "Complete your PurpleYou order.",
};

export default function CheckoutPage() {
  return (
    <main>
      <Suspense fallback={<CheckoutPageLoading />}>
        <CheckoutClient />
      </Suspense>
    </main>
  );
}

function CheckoutPageLoading() {
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
