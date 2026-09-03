import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { RelatedProducts } from "@/components/product/related-products";

import { getProductBySlug } from "@/services/products.service";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | PurpleYou",
    };
  }

  return {
    title: `${product.name} | PurpleYou`,
    description: product.description || `Shop ${product.name} at PurpleYou.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    typeof product.base.undiscountedPrice === "number" &&
    product.base.undiscountedPrice > product.base.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.base.undiscountedPrice! - product.base.price) /
          product.base.undiscountedPrice!) *
          100,
      )
    : null;

  const isOutOfStock =
    product.state === "OUT_OF_STOCK" || product.base.stock <= 0;

  const productType = product.base.taxonomy?.productType;

  return (
    <main>
      {/* Main product */}
      <section
        className="
          site-container
          py-6
          sm:py-8
          lg:py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10
            lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]
            lg:gap-16
          "
        >
          {/* Gallery */}
          <div className="min-w-0">
            <ProductGallery
              productName={product.name}
              images={product.images}
            />
          </div>

          {/* Product information */}
          <section
            className="
              min-w-0
              lg:sticky
              lg:top-32
              lg:self-start
            "
          >
            {/* Category */}
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-[var(--muted-foreground)]
              "
            >
              {productType ?? product.category}
            </p>

            {/* Name */}
            <h1
              className="
                mt-4
                max-w-2xl
                text-4xl
                font-medium
                leading-[1.04]
                tracking-[-0.04em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              {product.name}
            </h1>

            {/* Price */}
            <div
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <span className="text-xl">
                {formatPrice(product.base.price, product.currency)}
              </span>

              {hasDiscount && (
                <>
                  <span
                    className="
                      text-sm
                      text-[var(--muted-foreground)]
                      line-through
                    "
                  >
                    {formatPrice(
                      product.base.undiscountedPrice!,
                      product.currency,
                    )}
                  </span>

                  {discountPercentage !== null && (
                    <span
                      className="
                        text-xs
                        uppercase
                        tracking-[0.12em]
                        text-[var(--muted-foreground)]
                      "
                    >
                      -{discountPercentage}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Availability */}
            <div
              className="
                mt-8
                border-y
                border-[var(--border)]
                py-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className={`
                    h-2
                    w-2
                    rounded-full
                    ${
                      isOutOfStock
                        ? "bg-[var(--muted-foreground)]"
                        : "bg-[var(--success)]"
                    }
                  `}
                />

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                  "
                >
                  {isOutOfStock ? "Currently unavailable" : "In stock"}
                </p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div
                className="
                  border-b
                  border-[var(--border)]
                  py-8
                "
              >
                <p
                  className="
                    max-w-xl
                    text-sm
                    leading-7
                    text-[var(--muted-foreground)]
                    sm:text-base
                  "
                >
                  {product.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div
                className="
                    border-b
                    border-[var(--border)]
                    py-8
                  "
              >
                <h2
                  className="
                      text-[10px]
                      uppercase
                      tracking-[0.25em]
                    "
                >
                  Details
                </h2>

                <ul
                  className="
                      mt-5
                      space-y-3
                    "
                >
                  {product.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="
                            flex
                            gap-3
                            text-sm
                            leading-6
                            text-[var(--muted-foreground)]
                          "
                    >
                      <span
                        aria-hidden="true"
                        className="
                              text-[var(--foreground)]
                            "
                      >
                        —
                      </span>

                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purchase controls */}
            <ProductPurchasePanel
              productId={product.productId}
              price={product.base.price}
              currency={product.currency}
              stock={product.base.stock}
              isOutOfStock={isOutOfStock}
              variantSchema={
                product.variantSchema as Record<string, unknown> | undefined
              }
            />
          </section>
        </div>
      </section>

      {/* Related products */}
      <RelatedProducts
        currentProductId={product.productId}
        productType={productType}
      />
    </main>
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
