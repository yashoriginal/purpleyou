import type { Metadata } from "next";

import { ProductCard } from "@/components/product/product-card";
import { EmptySearchResults } from "@/components/search/empty-search-results";
import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = normalizeQuery(params.q);

  if (!query) {
    return {
      title: "Search | PurpleYou",
      description: "Search PurpleYou jewelry.",
    };
  }

  return {
    title: `Search: ${query} | PurpleYou`,
    description: `Search results for ${query} at PurpleYou.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params.q);

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
            limit: 60,
          }),
        ),
      );

      const uniqueProducts = new Map<string, Product>();

      for (const result of results) {
        for (const product of result.products) {
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
      <SearchHeader query={query} resultCount={products.length} />

      <section
        className="
          site-container
          py-8
          sm:py-10
          lg:py-14
        "
      >
        {!query ? (
          <SearchPrompt />
        ) : searchFailed ? (
          <SearchError />
        ) : products.length === 0 ? (
          <EmptySearchResults query={query} />
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
}

function SearchHeader({ query, resultCount }: SearchHeaderProps) {
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
          PurpleYou Search
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
              {query ? `Results for “${query}”` : "Search PurpleYou"}
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

function SearchPrompt() {
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
          Start with the search icon above.
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
