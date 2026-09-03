import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

export async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    const result = await getProducts({
      limit: 8,
    });

    products = result.products.slice(0, 4);
  } catch (error) {
    console.error("Unable to load featured products:", error);

    return null;
  }

  if (products.length === 0) {
    return null;
  }

  const editorialImage =
    products[0]?.images[1] ?? products[0]?.images[0] ?? null;

  return (
    <section
      className="
        relative
        grid
        h-full
        min-h-0
        grid-rows-[43%_57%]
        overflow-hidden
        bg-[#080808]
        text-white
      "
    >
      {/* Editorial top half */}
      <div className="relative min-h-0 overflow-hidden">
        {editorialImage ? (
          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              transition-transform
              duration-[1200ms]
            "
            style={{
              backgroundImage: `url("${editorialImage}")`,
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-[#151515]
            "
          />
        )}

        {/* Cinematic shading */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/80
            via-black/35
            to-black/20
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-transparent
            to-black/20
          "
        />

        {/* PurpleYou signature */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_75%_20%,rgba(150,82,194,0.24),transparent_40%)]
          "
        />

        {/* Editorial content */}
        <div
          className="
            site-container
            relative
            z-10
            flex
            h-full
            items-end
            justify-between
            gap-8
            pb-7
            sm:pb-9
            lg:pb-10
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.32em]
                text-[#c58ae8]
                sm:text-[10px]
              "
            >
              PurpleYou Edit
            </p>

            <h2
              className="
                mt-3
                max-w-[720px]
                text-[clamp(2.2rem,5vw,5rem)]
                font-medium
                leading-[0.92]
                tracking-[-0.05em]
                text-[#f5f1ed]
              "
            >
              Pieces worth
              <br />
              noticing.
            </h2>
          </div>

          <Link
            href="/collections/all"
            className="
              group
              hidden
              shrink-0
              items-center
              gap-4
              pb-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-white/80
              transition-colors
              hover:text-[#c58ae8]
              sm:flex
            "
          >
            View Collection
            <span
              aria-hidden="true"
              className="
                text-lg
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Product strip */}
      <div
        className="
          relative
          min-h-0
          border-t
          border-white/10
          bg-[#090909]
        "
      >
        <div
          className="
            site-container
            flex
            h-full
            min-h-0
            flex-col
            justify-center
            py-4
            lg:py-5
          "
        >
          <div
            className="
              grid
              min-h-0
              grid-cols-2
              justify-center
              gap-4
              md:grid-cols-4
              lg:gap-6
            "
          >
            {products.map((product, index) => (
              <div
                key={product.productId}
                className={`
                  min-w-0

                  ${index >= 2 ? "hidden md:block" : ""}
                `}
              >
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>

          <Link
            href="/collections/all"
            className="
              mt-3
              inline-flex
              items-center
              justify-center
              gap-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-white/70
              sm:hidden
            "
          >
            View Collection
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
