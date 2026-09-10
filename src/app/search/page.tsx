import type { Metadata } from "next";

import { ProductCard } from "@/components/product/product-card";
import { EmptySearchResults } from "@/components/search/empty-search-results";

import {
  getDepartmentLabel,
  normalizeDepartment,
  productMatchesDepartment,
} from "@/lib/departments";

import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    department?: string | string[];
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;

  const query = normalizeQuery(params.q);

  const department = normalizeDepartment(normalizeQuery(params.department));

  const departmentLabel = getDepartmentLabel(department);

  if (!query) {
    return {
      title: `${departmentLabel}'s Search | PurpleYou`,
      description: `Search ${departmentLabel.toLowerCase()}'s PurpleYou jewelry.`,
    };
  }

  return {
    title: `${departmentLabel}'s Search: ${query} | PurpleYou`,
    description: `Search results for ${query} in PurpleYou ${departmentLabel.toLowerCase()}'s jewelry.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const query = normalizeQuery(params.q);

  const department = normalizeDepartment(normalizeQuery(params.department));

  const departmentLabel = getDepartmentLabel(department);

  let products: Product[] = [];
  let searchFailed = false;

  if (query) {
    try {
      const normalizedQuery = toSearchCase(query);

      const searchTerms = Array.from(new Set([query, normalizedQuery]));

      const results = await Promise.all(
        searchTerms.map((search) =>
          getProducts({
            search,

            taxonomy: {
              department: department === "women" ? "Women" : "Men",
            },

            limit: 60,
          }),
        ),
      );

      const uniqueProducts = new Map<string, Product>();

      for (const result of results) {
        for (const product of result.products) {
          /*
           * Extra storefront guard:
           * even if the backend ignores
           * taxonomy.department, do not
           * mix Women and Men results.
           */
          if (!productMatchesDepartment(product, department)) {
            continue;
          }

          uniqueProducts.set(product.productId, product);
        }
      }

      products = Array.from(uniqueProducts.values());
    } catch (error) {
      console.error("Unable to load search results:", error);

      searchFailed = true;
    }
  }

  return (
    <main>
      <SearchHeader
        query={query}
        resultCount={products.length}
        departmentLabel={departmentLabel}
      />

      <section
        className="
          site-container
          py-8

          sm:py-10

          lg:py-14
        "
      >
        {!query ? (
          <SearchPrompt departmentLabel={departmentLabel} />
        ) : searchFailed ? (
          <SearchError />
        ) : products.length === 0 ? (
          <EmptySearchResults query={query} department={department} />
        ) : (
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
        )}
      </section>
    </main>
  );
}

interface SearchHeaderProps {
  query: string;
  resultCount: number;
  departmentLabel: string;
}

function SearchHeader({
  query,
  resultCount,
  departmentLabel,
}: SearchHeaderProps) {
  return (
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
          {departmentLabel}&apos;s PurpleYou Search
        </p>

        <div
          className="
            mt-5
            flex
            flex-col
            gap-5

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <h1
              className="
                text-4xl
                font-medium
                tracking-[-0.04em]

                sm:text-5xl

                lg:text-6xl
              "
            >
              {query
                ? `Results for “${query}”`
                : `Search ${departmentLabel}'s Jewelry`}
            </h1>
          </div>

          {query && (
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.22em]
                text-[var(--muted-foreground)]
              "
            >
              {resultCount} {resultCount === 1 ? "Result" : "Results"}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

interface SearchPromptProps {
  departmentLabel: string;
}

function SearchPrompt({ departmentLabel }: SearchPromptProps) {
  return (
    <div
      className="
        flex
        min-h-[40vh]
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
          Find your piece
        </p>

        <h2
          className="
            mt-4
            text-2xl
            font-medium
          "
        >
          Search {departmentLabel.toLowerCase()}
          &apos;s jewelry.
        </h2>
      </div>
    </div>
  );
}

function SearchError() {
  return (
    <div
      className="
        flex
        min-h-[40vh]
        items-center
        justify-center
        border
        border-[var(--border)]
        px-6
        py-16
        text-center
      "
    >
      <div className="max-w-md">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-[var(--muted-foreground)]
          "
        >
          Search unavailable
        </p>

        <h2
          className="
            mt-4
            text-3xl
            font-medium
            tracking-[-0.035em]

            sm:text-4xl
          "
        >
          We couldn&apos;t load the results.
        </h2>

        <p
          className="
            mt-5
            text-sm
            leading-7
            text-[var(--muted-foreground)]
          "
        >
          Please try searching again in a moment.
        </p>
      </div>
    </div>
  );
}

function normalizeQuery(value?: string | string[]): string {
  const query = Array.isArray(value) ? value[0] : value;

  return query?.trim() ?? "";
}

function toSearchCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
