import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { CollectionHeader } from "@/components/collection/collection-header";
import { CollectionSidebar } from "@/components/collection/collection-sidebar";
import { MobileCollectionFilters } from "@/components/collection/mobile-collection-filters";
import { ProductCard } from "@/components/product/product-card";
import { CollectionDepartmentTabs } from "@/components/collection/collection-department-tabs";
import { getCollection } from "@/lib/collections";
import {
  getDepartmentLabel,
  normalizeDepartment,
  productMatchesDepartment,
} from "@/lib/departments";

import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    department?: string | string[];
    sort?: string | string[];
    stock?: string | string[];
    min?: string | string[];
    max?: string | string[];
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const filters = await searchParams;

  const collection = getCollection(slug);

  if (!collection) {
    return {
      title: "Collection | PurpleYou",
    };
  }

  const department = normalizeDepartment(normalizeParam(filters.department));

  const departmentLabel = getDepartmentLabel(department);

  return {
    title: `${departmentLabel}'s ${collection.title} | PurpleYou`,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const filters = await searchParams;

  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  /*
   * Women is the default when the URL does not
   * contain a department.
   */
  const department = normalizeDepartment(normalizeParam(filters.department));

  const departmentLabel = getDepartmentLabel(department);

  /*
   * Ask the backend/service for this department.
   *
   * The local development Men products also use
   * this same taxonomy query.
   */
  const { products } = await getProducts({
    taxonomy: {
      ...collection.taxonomy,

      department: department === "women" ? "Women" : "Men",
    },

    limit: 60,
  });

  /*
   * Important:
   *
   * Filter again after fetching.
   *
   * This guarantees the collection stays
   * department-specific even if the backend
   * currently ignores taxonomy.department.
   */
  const departmentProducts = products.filter((product) =>
    productMatchesDepartment(product, department),
  );

  const sort = normalizeParam(filters.sort);

  const stock = normalizeParam(filters.stock);

  const min = normalizeParam(filters.min);

  const max = normalizeParam(filters.max);

  const visibleProducts = prepareCollectionProducts(
    departmentProducts,
    sort,
    stock,
    min,
    max,
  );

  const prices = departmentProducts.map((product) => product.base.price);

  const minAvailablePrice = prices.length > 0 ? Math.min(...prices) : undefined;

  const maxAvailablePrice = prices.length > 0 ? Math.max(...prices) : undefined;

  return (
    <main>
      <CollectionHeader
        eyebrow={`${departmentLabel}'s`}
        title={collection.title}
        description={collection.description}
        productCount={visibleProducts.length}
      />
      <CollectionDepartmentTabs />

      <section
        className="
          site-container
          py-8
          lg:py-14
        "
      >
        <MobileCollectionFilters
          productCount={visibleProducts.length}
          minAvailablePrice={minAvailablePrice}
          maxAvailablePrice={maxAvailablePrice}
        />

        <div
          className="
            grid
            grid-cols-1
            gap-10

            lg:grid-cols-[240px_minmax(0,1fr)]
            lg:gap-10

            xl:grid-cols-[270px_minmax(0,1fr)]
            xl:gap-14
          "
        >
          <div className="hidden lg:block">
            <CollectionSidebar
              productCount={visibleProducts.length}
              minAvailablePrice={minAvailablePrice}
              maxAvailablePrice={maxAvailablePrice}
            />
          </div>

          <div className="min-w-0">
            {visibleProducts.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-10

                  md:grid-cols-3

                  xl:grid-cols-4
                  xl:gap-x-5
                "
              >
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    compact
                  />
                ))}
              </div>
            ) : (
              <EmptyCollection department={departmentLabel} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function prepareCollectionProducts(
  products: Product[],
  sort?: string,
  stock?: string,
  min?: string,
  max?: string,
): Product[] {
  let result = [...products];

  /*
   * Availability
   */
  if (stock === "in") {
    result = result.filter(
      (product) => product.state !== "OUT_OF_STOCK" && product.base.stock > 0,
    );
  }

  /*
   * Price
   */
  const minimumPrice = parsePriceParam(min);

  const maximumPrice = parsePriceParam(max);

  if (minimumPrice !== undefined) {
    result = result.filter((product) => product.base.price >= minimumPrice);
  }

  if (maximumPrice !== undefined) {
    result = result.filter((product) => product.base.price <= maximumPrice);
  }

  /*
   * Sorting
   */
  switch (sort) {
    case "price-low": {
      result.sort((a, b) => a.base.price - b.base.price);

      break;
    }

    case "price-high": {
      result.sort((a, b) => b.base.price - a.base.price);

      break;
    }

    case "name": {
      result.sort((a, b) => a.name.localeCompare(b.name));

      break;
    }

    /*
     * Featured keeps backend order.
     */
    default:
      break;
  }

  return result;
}

function normalizeParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePriceParam(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

interface EmptyCollectionProps {
  department: string;
}

function EmptyCollection({ department }: EmptyCollectionProps) {
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
      <div>
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-[var(--muted-foreground)]
          "
        >
          {department}&apos;s
        </p>

        <h2
          className="
            mt-4
            text-2xl
            font-medium
          "
        >
          No pieces found.
        </h2>

        <p
          className="
            mt-3
            max-w-sm
            text-sm
            leading-6
            text-[var(--muted-foreground)]
          "
        >
          Try adjusting your filters to discover more pieces.
        </p>
      </div>
    </div>
  );
}
