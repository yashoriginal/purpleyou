import Link from "next/link";

import { WishlistButton } from "@/components/wishlist/wishlist-button";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const primaryImage = product.images[0] ?? null;

  const hoverImage = product.images[1] ?? null;

  const isOutOfStock =
    product.state === "OUT_OF_STOCK" || product.base.stock <= 0;

  const hasDiscount =
    typeof product.base.undiscountedPrice === "number" &&
    product.base.undiscountedPrice > product.base.price;

  const productHref = getProductHref(product);

  return (
    <article className="group relative min-w-0">
      {/* Wishlist */}
      <div
        className="
          absolute
          right-3
          top-3
          z-10
        "
      >
        <WishlistButton productId={product.productId} />
      </div>

      <Link href={productHref} className="block">
        {/* Product image */}
        <div
          className={`
            relative
            mx-auto
            overflow-hidden
            bg-[var(--surface)]

            ${
              compact
                ? "aspect-square w-full max-w-[250px]"
                : "aspect-[4/5] w-full"
            }
          `}
        >
          {primaryImage ? (
            <>
              <div
                role="img"
                aria-label={product.name}
                className="
                  absolute
                  inset-0
                  bg-cover
                  bg-center

                  transition-all
                  duration-500
                  ease-out

                  group-hover:scale-[1.02]
                "
                style={{
                  backgroundImage: `url("${primaryImage}")`,
                }}
              />

              {hoverImage && (
                <div
                  role="img"
                  aria-label={`${product.name} alternate view`}
                  className="
                    absolute
                    inset-0
                    bg-cover
                    bg-center
                    opacity-0

                    transition-all
                    duration-500
                    ease-out

                    group-hover:scale-[1.02]
                    group-hover:opacity-100
                  "
                  style={{
                    backgroundImage: `url("${hoverImage}")`,
                  }}
                />
              )}
            </>
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                px-5
                text-center
              "
            >
              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  text-[var(--muted-foreground)]
                "
              >
                Image unavailable
              </span>
            </div>
          )}

          {/* Sold out */}
          {isOutOfStock && (
            <div
              className="
                absolute
                left-3
                top-3
                bg-[var(--background)]
                px-3
                py-2
                text-[9px]
                uppercase
                tracking-[0.18em]
              "
            >
              Sold Out
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="pt-4">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.22em]
              text-[var(--muted-foreground)]
            "
          >
            {product.category}
          </p>

          <h3
            className="
              mt-2
              line-clamp-2
              text-sm
              font-medium
              leading-5

              sm:text-base
            "
          >
            {product.name}
          </h3>

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span className="text-sm">
              {formatPrice(product.base.price, product.currency)}
            </span>

            {hasDiscount && (
              <span
                className="
                  text-xs
                  text-[var(--muted-foreground)]
                  line-through
                "
              >
                {formatPrice(product.base.undiscountedPrice!, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

function getProductHref(product: Product) {
  const department = product.base.taxonomy?.department?.trim().toLowerCase();

  const baseHref = `/products/${product.slug}`;

  if (department !== "men" && department !== "women") {
    return baseHref;
  }

  return `${baseHref}?department=${department}`;
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
