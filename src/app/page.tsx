import Hero from "@/components/Hero"
import ProductGrid from "@/components/product/ProductGrid"
import { products } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 6);
  const rings = products.filter(p => p.category === "rings").slice(0, 1);
  const necklaces = products.filter(p => p.category === "necklaces").slice(0, 1);
  const bracelets = products.filter(p => p.category === "bracelets").slice(0, 1);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Category Tiles Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rings */}
          <Link href="/collections/rings" className="category-tile group relative overflow-hidden bg-[#f8f5f2] aspect-square">
            <Image
              src="/images/hero1.jpg"
              alt="Rings Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <h3 className="text-3xl font-light text-white tracking-wider">RINGS</h3>
            </div>
          </Link>

          {/* Necklaces */}
          <Link href="/collections/necklaces" className="category-tile group relative overflow-hidden bg-[#f8f5f2] aspect-square">
            <Image
              src="/images/hero1.jpg"
              alt="Necklaces Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <h3 className="text-3xl font-light text-white tracking-wider">NECKLACES</h3>
            </div>
          </Link>

          {/* Bracelets */}
          <Link href="/collections/bracelets" className="category-tile group relative overflow-hidden bg-[#f8f5f2] aspect-square">
            <Image
              src="/images/hero1.jpg"
              alt="Bracelets Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <h3 className="text-3xl font-light text-white tracking-wider">BRACELETS</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 bg-[#f8f5f2]">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-3">
            Best Sellers
          </h2>
          <p className="text-base text-[#6b6b6b] max-w-2xl font-light">
            Discover the jewelry pieces loved by our customers.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((product) => (
            <div key={product.id} className="bg-white p-4">
              <div className="relative overflow-hidden bg-white aspect-[3/4] mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isBestseller && (
                  <div className="absolute top-3 right-3 bg-[#D3C9FF] text-[#111111] text-xs font-semibold px-3 py-1 rounded-full">
                    BESTSELLER
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-[#111111]">{product.name}</h3>
              <div className="mt-2 flex gap-2">
                <span className="text-lg font-medium text-[#111111]">₹{product.price.toLocaleString('en-IN')}</span>
                {product.comparePrice && (
                  <span className="text-sm text-[#6b6b6b] line-through">₹{product.comparePrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <p className="text-xs text-[#6b6b6b] mt-2 line-clamp-2">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-6">
              Most versatile accessories in town
            </h2>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-6">
              At Purple You, we believe jewelry should be versatile, elegant, and accessible. Our collections are designed to seamlessly fit into any style—from minimalist everyday wear to bold statement pieces.
            </p>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-8">
              Each piece is carefully crafted with premium materials and attention to detail, ensuring they're made to last and loved for years to come.
            </p>
            <Link href="/about">
              <button className="bg-[#5540b7] text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors">
                Learn Our Story
              </button>
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/images/hero1.jpg"
              alt="Purple You Brand Story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Video Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-3">
            See Purple You in Action
          </h2>
        </div>
        <div className="relative aspect-video bg-[#f8f5f2] overflow-hidden rounded-lg">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero1.jpg"
          >
            <source src="/videos/brand-showcase.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <button className="bg-white/80 hover:bg-white rounded-full p-4 transition-all" aria-label="Play video">
              <svg className="w-8 h-8 text-[#5540b7]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="bg-[#D3C9FF] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-4">
            Join the Purple You Club
          </h2>
          <p className="text-base text-[#111111] font-light mb-8">
            Get exclusive offers, early access to new collections, and styling tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white border border-[#e6e0da] text-[#111111] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
              required
            />
            <button
              type="submit"
              className="bg-[#111111] text-[#D3C9FF] px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#5540b7] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[#111111] mt-4 font-light">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}
