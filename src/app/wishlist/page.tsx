import type { Metadata } from "next";

import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist | PurpleYou",
  description: "Your saved PurpleYou jewelry.",
};

export default function WishlistPage() {
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
            pb-10
            pt-14
            sm:pb-14
            sm:pt-18
            lg:pb-16
            lg:pt-20
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
              mt-5
              text-5xl
              font-medium
              tracking-[-0.045em]
              sm:text-6xl
              lg:text-7xl
            "
          >
            Wishlist
          </h1>

          <p
            className="
              mt-5
              max-w-lg
              text-sm
              leading-7
              text-[var(--muted-foreground)]
            "
          >
            A place for the pieces you don&apos;t want to forget.
          </p>
        </div>
      </header>

      <section
        className="
          site-container
          py-8
          sm:py-10
          lg:py-14
        "
      >
        <WishlistContent />
      </section>
    </main>
  );
}
