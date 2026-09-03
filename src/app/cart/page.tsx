import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Your Bag | PurpleYou",
  description: "Review your PurpleYou shopping bag.",
};

export default function CartPage() {
  return (
    <main>
      <header
        className="
          border-b
          border-[var(--border)]
        "
      >
        <div
          className="
            site-container
            py-12
            sm:py-16
            lg:py-20
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-[var(--muted-foreground)]
            "
          >
            PurpleYou
          </p>

          <h1
            className="
              mt-4
              text-4xl
              font-medium
              tracking-[-0.04em]
              sm:text-5xl
              lg:text-6xl
            "
          >
            Your Bag
          </h1>
        </div>
      </header>

      <CartPageContent />
    </main>
  );
}
