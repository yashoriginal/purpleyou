import Hero from "@/components/Hero"
import ProductGrid from "@/components/product/ProductGrid"
import { products } from "@/lib/data"

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-[#305040] tracking-wide mb-3">
            Featured Collection
          </h2>
          <p className="text-sm text-[#6b6b6b] max-w-2xl font-light">
            Discover our curated selection of sustainable, ethically crafted fine jewelry. Each piece is made to last a lifetime.
          </p>
        </div>
        <ProductGrid products={products} />
      </section>
    </>
  )
}
