'use client';

import { useState, useEffect } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

interface FilterState {
  priceRange: [number, number];
  sortBy: string;
}

export default function CollectionFilters({
  onFilterChange,
  productCount,
  maxPrice = 100000,
}: {
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
  maxPrice?: number;
}) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, maxPrice],
    sortBy: 'featured',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Update max price when it changes from parent
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice] as [number, number],
    }));
  }, [maxPrice]);

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = type === 'min' 
      ? [value, filters.priceRange[1]]
      : [filters.priceRange[0], value];
    
    if (newRange[0] <= newRange[1]) {
      const newFilters = { ...filters, priceRange: newRange };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full md:hidden flex items-center justify-between bg-[#f8f5f2] px-4 py-3 text-sm font-medium text-[#111111]"
      >
        <span>Filters & Sort</span>
        <HiOutlineChevronDown
          className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Filters Container */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
        {/* Product Count */}
        <div className="text-sm text-[#6b6b6b]">
          Showing {productCount} products
        </div>

        {/* Sort */}
        <div className="border-b border-[#e6e0da] pb-6">
          <label className="block text-sm font-medium text-[#111111] mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#e6e0da] text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="border-b border-[#e6e0da] pb-6">
          <label className="block text-sm font-medium text-[#111111] mb-4">
            Price Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#6b6b6b] mb-1 block">Min Price</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                min="0"
                max={maxPrice}
                className="w-full px-3 py-2 border border-[#e6e0da] text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                placeholder="₹0"
              />
            </div>
            <div>
              <label className="text-xs text-[#6b6b6b] mb-1 block">Max Price</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                min="0"
                max={maxPrice}
                className="w-full px-3 py-2 border border-[#e6e0da] text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
                placeholder={`₹${maxPrice.toLocaleString('en-IN')}`}
              />
            </div>
            <div className="text-xs text-[#6b6b6b]">
              ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-3">
            Availability
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-[#6b6b6b]">In Stock</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-[#6b6b6b]">Out of Stock</span>
          </label>
        </div>
      </div>
    </div>
  );
}
