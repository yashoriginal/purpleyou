import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

interface RelatedProductsProps {
  currentProductId: string;
  productType?: string;
}

const RELATED_PRODUCT_LIMIT = 4;

export async function RelatedProducts({
  currentProductId,
  productType,
}: RelatedProductsProps) {
  const products = await loadRelatedProducts(currentProductId, productType);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="
        section-spacing
        border-t
        border-[var(--border)]
      "
    >
      <div className="site-container">
        <div
          className="
            mb-8
            flex
            items-end
            justify-between
            gap-6
            sm:mb-10
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-[var(--muted-foreground)]
              "
            >
              Keep exploring
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-medium
                tracking-[-0.035em]
                sm:text-4xl
              "
            >
              You may also like.
            </h2>
          </div>

          <Link
            href="/collections/all"
            className="
              hidden
              text-[10px]
              uppercase
              tracking-[0.2em]
              underline
              underline-offset-4
              transition-opacity
              hover:opacity-60
              sm:block
            "
          >
            Shop All
          </Link>
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
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function loadRelatedProducts(
  currentProductId: string,
  productType?: string,
): Promise<Product[]> {
  const selected = new Map<string, Product>();

  try {
    /*
     * Priority 1:
     * Products from the same product type.
     */
    if (productType) {
      const sameTypeResult = await getProducts({
        taxonomy: {
          productType,
        },
        limit: 8,
      });

      for (const product of sameTypeResult.products) {
        if (product.productId !== currentProductId) {
          selected.set(product.productId, product);
        }

        if (selected.size >= RELATED_PRODUCT_LIMIT) {
          break;
        }
      }
    }

    /*
     * Priority 2:
     * Fill remaining spaces using other
     * storefront products.
     */
    if (selected.size < RELATED_PRODUCT_LIMIT) {
      const allProductsResult = await getProducts({
        limit: 16,
      });

      for (const product of allProductsResult.products) {
        if (product.productId === currentProductId) {
          continue;
        }

        if (selected.has(product.productId)) {
          continue;
        }

        selected.set(product.productId, product);

        if (selected.size >= RELATED_PRODUCT_LIMIT) {
          break;
        }
      }
    }

    return Array.from(selected.values()).slice(0, RELATED_PRODUCT_LIMIT);
  } catch (error) {
    console.error("Unable to load related products:", error);

    return [];
  }
}
