'use client';

import { useState, useMemo } from 'react';
import ProductGrid from "@/components/product/ProductGrid";
import CollectionFilters from "@/components/collection/CollectionFilters";
import { products } from "@/lib/data";

type PageProps = {
  params: { category: string };
};

export default function CategoryPage({ params }: PageProps) {
  const { category } = params;

  const normalizedCategory = (category ?? "").toLowerCase();

  const baseProducts = useMemo(() => {
    return products.filter((product) => {
      return (product.category ?? "").toLowerCase() === normalizedCategory;
    });
  }, [normalizedCategory]);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000] as [number, number],
    sortBy: 'featured',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...baseProducts];

    // Filter by price
    result = result.filter((product) => {
      return (
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
      );
    });

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result = result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        result = result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return result;
  }, [baseProducts, filters]);

  if (baseProducts.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#6b6b6b]">
        No products found in "{category}".
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-[#111111] tracking-wide capitalize mb-3">
          {category}
        </h1>
        <p className="text-sm text-[#6b6b6b] font-light max-w-2xl">
          Explore our premium {category.toLowerCase()} collection. Crafted with care. Made for you.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block md:col-span-1">
          <CollectionFilters 
            onFilterChange={setFilters}
            productCount={filteredAndSortedProducts.length}
          />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {/* Mobile Filters */}
          <div className="md:hidden mb-6">
            <CollectionFilters 
              onFilterChange={setFilters}
              productCount={filteredAndSortedProducts.length}
            />
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="text-sm text-[#6b6b6b]">No products match your filters.</p>
                <button
                  onClick={() => setFilters({ priceRange: [0, 100000], sortBy: 'featured' })}
                  className="mt-4 text-sm text-[#5540b7] underline hover:no-underline"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <ProductGrid products={filteredAndSortedProducts} />
          )}
        </div>
      </div>
    </section>
  );
}
