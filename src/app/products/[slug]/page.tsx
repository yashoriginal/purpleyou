'use client';

import { useState } from 'react';
import { products } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import ProductAccordion from "@/components/product/ProductAccordion"
import { HiOutlineHeart, HiOutlineCheck } from 'react-icons/hi';

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  const product = products.find(p => p.slug === slug)

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-light text-[#111111] tracking-wide">
            Product not found
          </h1>
        </div>
      </section>
    )
  }

  const accordionItems = [
    {
      title: "Description",
      content: product.description || "A versatile piece of jewelry crafted with precision and care."
    },
    {
      title: "Materials & Care",
      content: product.materials
        ? `${product.materials}. ${product.careInstructions || 'Store safely and clean regularly with a soft cloth.'}`
        : "18K gold or gold plated. Care instructions available upon request."
    },
    {
      title: "Size Guide",
      content: "Size varies by product. For rings, measure your ring size by wrapping a piece of string around your finger. For necklaces and bracelets, standard sizes are provided with options for customization."
    },
    {
      title: "Shipping & Returns",
      content: "Free shipping on orders above ₹3000 in India. Standard delivery: 5-7 business days. Hassle-free returns within 15 days. GST included in all prices."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16">
        {/* Left Column - Media Gallery */}
        <div className="flex flex-col gap-6">
          {/* Main Image */}
          <div className="relative bg-[#f8f5f2] aspect-[3/4] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity">
              <Image
                src={product.image}
                alt="Thumbnail 1"
                fill
                className="object-cover"
              />
            </div>
            {product.hoverImage && (
              <div className="relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity">
                <Image
                  src={product.hoverImage}
                  alt="Thumbnail 2"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {product.videoUrl && (
              <div className="relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center">
                <video
                  src={product.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Video Section - Below Gallery */}
          {product.videoUrl && (
            <div className="relative bg-[#f8f5f2] aspect-video overflow-hidden">
              <video
                src={product.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Right Column - Purchase Panel */}
        <div className="flex flex-col">
          {/* Product Header */}
          <div className="pb-6 border-b border-[#e6e0da]">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide flex-1">
                {product.name}
              </h1>
              <button className="text-[#111111] hover:text-[#5540b7] transition-colors">
                <HiOutlineHeart className="w-6 h-6" />
              </button>
            </div>

            {/* Price & Rating */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-light text-[#111111]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-[#6b6b6b] line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="py-6 border-b border-[#e6e0da]">
              {product.variants.map((variant, idx) => (
                <div key={idx} className="mb-4 last:mb-0">
                  <label className="block text-sm font-medium text-[#111111] mb-3">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        className="px-4 py-2 border border-[#e6e0da] text-sm text-[#111111] hover:border-[#5540b7] hover:text-[#5540b7] transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benefits */}
          <div className="py-6 space-y-3">
            <div className="flex items-start gap-3">
              <HiOutlineCheck className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#6b6b6b] font-light">Free shipping on orders above ₹3000</span>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineCheck className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#6b6b6b] font-light">Secure checkout with Razorpay (UPI, Cards, Netbanking)</span>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineCheck className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#6b6b6b] font-light">GST included • 15-day returns</span>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineCheck className="w-5 h-5 text-[#5540b7] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#6b6b6b] font-light">COD available on select locations</span>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="border-t border-[#e6e0da] pt-6 space-y-3">
            <button className="w-full bg-[#5540b7] text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors">
              Add to Bag
            </button>
            <button className="w-full border border-[#111111] text-[#111111] px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Accordions Section */}
      <div className="mb-16">
        <ProductAccordion items={accordionItems} />
      </div>

      {/* Related Products Section */}
      <div className="border-t border-[#e6e0da] pt-16">
        <h2 className="text-3xl font-light text-[#111111] tracking-wide mb-8">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative bg-[#f8f5f2] aspect-[3/4] mb-3 overflow-hidden">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-[#111111] line-clamp-2">{relatedProduct.name}</h3>
                  <p className="text-sm font-medium text-[#111111] mt-2">
                    ₹{relatedProduct.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
