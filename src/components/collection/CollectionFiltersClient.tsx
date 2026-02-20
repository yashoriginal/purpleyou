"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import CollectionFilters from "./CollectionFilters";
import { Product } from "@/types/product";
import { normalizeImageUrl } from "@/lib/image";
import DynamicAspectImage from "@/components/DynamicAspectImage";

interface CollectionFiltersClientProps {
  products: Product[];
  collectionName: string;
}

export default function CollectionFiltersClient({
  products,
  collectionName,
}: CollectionFiltersClientProps) {
  // Calculate dynamic price range from actual products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    const prices = products.map((p) => p.price || p.base?.price || 0);
    const max = Math.max(...prices);
    // Round up to nearest 10000 for a cleaner UI
    return Math.ceil(max / 10000) * 10000;
  }, [products]);

  const [filters, setFilters] = useState({
    priceRange: [0, maxPrice] as [number, number],
    sortBy: "featured",
  });

  // Update filter max price when products or maxPrice changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice] as [number, number],
    }));
  }, [maxPrice]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by price
    result = result.filter((product) => {
      const price = product.price || product.base?.price || 0;
      return (
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1]
      );
    });

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result = result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "price-low":
        result = result.sort((a, b) => {
          const aPrice = a.price || a.base?.price || 0;
          const bPrice = b.price || b.base?.price || 0;
          return aPrice - bPrice;
        });
        break;
      case "price-high":
        result = result.sort((a, b) => {
          const aPrice = a.price || a.base?.price || 0;
          const bPrice = b.price || b.base?.price || 0;
          return bPrice - aPrice;
        });
        break;
      case "featured":
      default:
        result = result.sort(
          (a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0),
        );
        break;
    }

    return result;
  }, [products, filters]);

  return (
    <>
      {/* Filter and Sort Bar */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#e6e0da]">
        <h2 className="text-sm font-medium text-[#111111] tracking-wide">
          FILTER AND SORT
        </h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={(e) => {
                // Toggle in-stock filtering
                if (e.target.checked) {
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: prev.priceRange,
                  }));
                }
              }}
            />
            <span className="text-xs font-medium text-[#111111]">
              IN-STOCK ONLY
            </span>
          </label>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden mb-6">
        <CollectionFilters
          onFilterChange={setFilters}
          productCount={filteredAndSortedProducts.length}
          maxPrice={maxPrice}
        />
      </div>

      {/* Desktop Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block md:col-span-1">
          <CollectionFilters
            onFilterChange={setFilters}
            productCount={filteredAndSortedProducts.length}
            maxPrice={maxPrice}
          />
        </div>

        {/* Products Grid - 4 Columns */}
        <div className="md:col-span-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="text-sm text-[#6b6b6b]">
                  No products match your filters.
                </p>
                <button
                  onClick={() =>
                    setFilters({ priceRange: [0, 100000], sortBy: "featured" })
                  }
                  className="mt-4 text-sm text-[#5540b7] underline hover:no-underline"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredAndSortedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group cursor-pointer">
                    <DynamicAspectImage
                      src={normalizeImageUrl(product.image)}
                      alt={product.name}
                      defaultAspectRatio={0.75}
                      containerClassName="relative bg-[#f5f1ed] mb-4 overflow-hidden"
                      imageClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                    >
                      {product.isBestseller && (
                        <div className="absolute top-3 right-3 bg-[#D3C9FF] text-[#111111] text-xs font-semibold px-3 py-1 rounded-full">
                          BESTSELLER
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-3 left-3 bg-[#5540b7] text-white text-xs font-semibold px-3 py-1 rounded-full">
                          NEW
                        </div>
                      )}
                    </DynamicAspectImage>
                    <h3 className="text-sm font-medium text-[#111111] line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex gap-2 items-baseline">
                      <span className="text-base font-medium text-[#111111]">
                        ₹{(product.price || product.base?.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
