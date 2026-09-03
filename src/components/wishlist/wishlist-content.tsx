"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { EmptyWishlist } from "@/components/wishlist/empty-wishlist";
import { WishlistButton } from "@/components/wishlist/wishlist-button";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectWishlistHydrated,
  selectWishlistIds,
} from "@/store/selectors/wishlist-selectors";

import { clearWishlist } from "@/store/slices/wishlist-slice";

import {
  getWishlistProduct,
  type WishlistProductSummary,
} from "@/services/wishlist-product.service";

interface ProductState {
  key: string;
  products: WishlistProductSummary[];
}

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,

    // Client snapshot
    () => true,

    // Server + initial hydration snapshot
    () => false,
  );
}

export function WishlistContent() {
  const dispatch = useAppDispatch();

  const hasHydratedClient = useHasHydratedClient();

  const productIds = useAppSelector(selectWishlistIds);

  const hydrated = useAppSelector(selectWishlistHydrated);

  const [productState, setProductState] = useState<ProductState | null>(null);

  const requestKey = useMemo(() => productIds.join("|"), [productIds]);

  useEffect(() => {
    if (!hasHydratedClient || !hydrated || productIds.length === 0) {
      return;
    }

    let cancelled = false;

    void Promise.all(
      productIds.map(async (productId) => {
        try {
          return await getWishlistProduct(productId);
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (cancelled) {
        return;
      }

      setProductState({
        key: requestKey,

        products: results.filter(
          (product): product is WishlistProductSummary => product !== null,
        ),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [hasHydratedClient, hydrated, productIds, requestKey]);

  /*
   * Important:
   *
   * Server render      -> WishlistLoading
   * First client render -> WishlistLoading
   *
   * Only after hydration do we inspect the
   * localStorage-backed Redux wishlist state.
   *
   * This prevents server/client HTML mismatch.
   */
  if (!hasHydratedClient || !hydrated) {
    return <WishlistLoading />;
  }

  if (productIds.length === 0) {
    return <EmptyWishlist />;
  }

  const productsReady = productState?.key === requestKey;

  if (!productsReady) {
    return <WishlistLoading />;
  }

  if (productState.products.length === 0) {
    return <UnavailableWishlist />;
  }

  return (
    <>
      <div
        className="
          mb-8
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
          {productState.products.length}{" "}
          {productState.products.length === 1 ? "Saved Piece" : "Saved Pieces"}
        </p>

        <button
          type="button"
          onClick={() => dispatch(clearWishlist())}
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-[var(--muted-foreground)]
            underline
            underline-offset-4
            transition
            hover:text-[var(--foreground)]
          "
        >
          Clear Wishlist
        </button>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-10
          sm:gap-x-5
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {productState.products.map((product) => (
          <WishlistProductCard key={product.productId} product={product} />
        ))}
      </div>
    </>
  );
}

function WishlistProductCard({ product }: { product: WishlistProductSummary }) {
  const hasDiscount =
    typeof product.undiscountedPrice === "number" &&
    product.undiscountedPrice > product.price;

  const isOutOfStock = product.state === "OUT_OF_STOCK" || product.stock <= 0;

  return (
    <article
      className="
        group
        relative
        min-w-0
      "
    >
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

      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="
            relative
            aspect-[4/5]
            overflow-hidden
            bg-[var(--surface)]
          "
        >
          {product.imageUrl ? (
            <div
              role="img"
              aria-label={product.name}
              className="
                absolute
                inset-0
                bg-contain
                bg-center
                bg-no-repeat
                transition-transform
                duration-500
                group-hover:scale-[1.02]
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
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-[var(--muted-foreground)]
              "
            >
              Image unavailable
            </div>
          )}

          {isOutOfStock && (
            <span
              className="
                absolute
                bottom-3
                left-3
                bg-[var(--background)]
                px-3
                py-2
                text-[9px]
                uppercase
                tracking-[0.18em]
              "
            >
              Sold Out
            </span>
          )}
        </div>

        <div className="pt-4">
          <h2
            className="
              line-clamp-2
              text-sm
              font-medium
              leading-5
              sm:text-base
            "
          >
            {product.name}
          </h2>

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
              {formatPrice(product.price, product.currency)}
            </span>

            {hasDiscount && (
              <span
                className="
                  text-xs
                  text-[var(--muted-foreground)]
                  line-through
                "
              >
                {formatPrice(product.undiscountedPrice!, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

function WishlistLoading() {
  return (
    <div
      className="
        flex
        min-h-[45vh]
        items-center
        justify-center
        text-center
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
        Loading saved pieces...
      </p>
    </div>
  );
}

function UnavailableWishlist() {
  return (
    <div
      className="
        flex
        min-h-[45vh]
        items-center
        justify-center
        border
        border-[var(--border)]
        px-6
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
          Wishlist
        </p>

        <h2
          className="
            mt-4
            text-3xl
            font-medium
            tracking-[-0.03em]
          "
        >
          Saved pieces unavailable.
        </h2>

        <p
          className="
            mt-4
            text-sm
            leading-7
            text-[var(--muted-foreground)]
          "
        >
          These products may no longer be available in the store.
        </p>
      </div>
    </div>
  );
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
