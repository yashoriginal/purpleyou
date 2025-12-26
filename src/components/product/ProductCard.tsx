'use client';

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Product {
  id: number;
  name: string;
  price: number;
  comparePrice?: number;
  slug: string;
  image: string;
  hoverImage?: string;
  category: string;
  description: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="product-card group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative overflow-hidden bg-[#f8f5f2] aspect-[3/4] mb-4">
          <Image
            src={isHovering && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
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
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#111111] tracking-wide line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-[#6b6b6b] mt-2 font-light line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex gap-2 items-baseline">
            <span className="text-lg font-medium text-[#111111]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-[#6b6b6b] line-through">
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
