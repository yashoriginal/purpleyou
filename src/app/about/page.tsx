import type { Metadata } from "next";
import Link from "next/link";

import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "About | PurpleYou",
  description:
    "Discover PurpleYou — jewelry designed for everyday expression, memorable moments, and modern style.",
};

export default async function AboutPage() {
  const images = await loadAboutImages();

  return (
    <main>
      {/* Intro */}
      <section
        className="
          border-b
          border-[var(--border)]
        "
      >
        <div
          className="
            site-container
            py-16
            sm:py-20
            lg:py-28
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.32em]
              text-[var(--muted-foreground)]
            "
          >
            About PurpleYou
          </p>

          <h1
            className="
              mt-6
              max-w-5xl
              text-[clamp(3.4rem,8vw,7.5rem)]
              font-medium
              leading-[0.9]
              tracking-[-0.055em]
            "
          >
            Jewelry for the way
            <br />
            you choose to show up.
          </h1>

          <p
            className="
              mt-8
              max-w-2xl
              text-sm
              leading-7
              text-[var(--muted-foreground)]
              sm:text-base
            "
          >
            PurpleYou brings together bold details, versatile silhouettes, and
            modern jewelry designed to become part of your everyday style.
          </p>
        </div>
      </section>

      {/* Editorial story */}
      <section
        className="
          grid
          grid-cols-1
          border-b
          border-[var(--border)]
          lg:grid-cols-2
        "
      >
        <AboutImage image={images[0]} label="PurpleYou Jewelry" />

        <div
          className="
            flex
            items-center
            px-[var(--page-padding-mobile)]
            py-16
            sm:px-[var(--page-padding-tablet)]
            lg:px-16
            lg:py-24
          "
        >
          <div className="max-w-xl">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-[var(--muted-foreground)]
              "
            >
              Our Point of View
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-medium
                leading-[1.05]
                tracking-[-0.04em]
                sm:text-5xl
              "
            >
              Style should feel personal.
            </h2>

            <p
              className="
                mt-7
                text-sm
                leading-7
                text-[var(--muted-foreground)]
                sm:text-base
              "
            >
              We believe jewelry should do more than complete an outfit. It
              should reflect mood, confidence, personality, and the moments you
              want to remember.
            </p>

            <p
              className="
                mt-5
                text-sm
                leading-7
                text-[var(--muted-foreground)]
                sm:text-base
              "
            >
              That is why PurpleYou focuses on pieces that can move from
              everyday wear to occasions without losing their identity.
            </p>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section
        className="
          border-b
          border-[var(--border)]
        "
      >
        <div
          className="
            site-container
            py-20
            sm:py-24
            lg:py-32
          "
        >
          <p
            className="
              max-w-5xl
              text-4xl
              font-medium
              leading-[1.08]
              tracking-[-0.045em]
              sm:text-5xl
              lg:text-6xl
            "
          >
            Made to be worn your way. Layer it, simplify it, make it the
            statement — the piece belongs to you.
          </p>
        </div>
      </section>

      {/* Second image/story */}
      <section
        className="
          grid
          grid-cols-1
          border-b
          border-[var(--border)]
          lg:grid-cols-2
        "
      >
        <div
          className="
            order-2
            flex
            items-center
            px-[var(--page-padding-mobile)]
            py-16
            sm:px-[var(--page-padding-tablet)]
            lg:order-1
            lg:px-16
            lg:py-24
          "
        >
          <div className="max-w-xl">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-[var(--muted-foreground)]
              "
            >
              PurpleYou
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-medium
                tracking-[-0.04em]
                sm:text-5xl
              "
            >
              Versatility without compromise.
            </h2>

            <p
              className="
                mt-7
                text-sm
                leading-7
                text-[var(--muted-foreground)]
                sm:text-base
              "
            >
              From subtle everyday pieces to jewelry that takes over the room,
              our collection is built around choice.
            </p>

            <Link
              href="/collections/all"
              className="
                mt-9
                inline-flex
                min-h-13
                items-center
                justify-center
                bg-[var(--foreground)]
                px-7
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-[var(--background)]
                transition-opacity
                hover:opacity-85
              "
            >
              Explore The Collection
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <AboutImage image={images[1]} label="PurpleYou Collection" />
        </div>
      </section>
    </main>
  );
}

function AboutImage({ image, label }: { image: string | null; label: string }) {
  return (
    <div
      className="
        relative
        min-h-[520px]
        overflow-hidden
        bg-[var(--surface)]
        lg:min-h-[720px]
      "
    >
      {image ? (
        <div
          role="img"
          aria-label={label}
          className="
            absolute
            inset-0
            bg-contain
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage: `url("${image}")`,
          }}
        />
      ) : (
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-[var(--muted-foreground)]
            "
          >
            PurpleYou
          </span>
        </div>
      )}
    </div>
  );
}

async function loadAboutImages(): Promise<[string | null, string | null]> {
  let products: Product[] = [];

  try {
    const result = await getProducts({
      limit: 16,
    });

    products = result.products.filter((product) => product.images.length > 0);
  } catch (error) {
    console.error("Unable to load About imagery:", error);
  }

  return [
    products[0]?.images[0] ?? null,
    products[1]?.images[0] ?? products[0]?.images[1] ?? null,
  ];
}
