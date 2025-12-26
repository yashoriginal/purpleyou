import { products } from "@/lib/data"
import Image from "next/image"

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
          <h1 className="text-2xl font-light text-[#305040] tracking-wide">
            Product not found
          </h1>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-[#f5f2f0]">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-start">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-light text-[#305040] tracking-wide mb-4">
              {product.name}
            </h1>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-6">
              {product.description}
            </p>
            <div className="border-t border-[#e6dcd4] pt-6">
              <p className="text-2xl font-light text-[#305040] mb-2">
                ${product.price}
              </p>
              <p className="text-xs text-[#6b6b6b] font-light">
                Made to last a lifetime. Guaranteed for life.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-[#e6dcd4] pt-6 mb-8">
            <h3 className="text-sm font-semibold text-[#305040] uppercase tracking-wider mb-4">
              Key Features
            </h3>
            <ul className="space-y-2 text-sm text-[#6b6b6b] font-light">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-[#305040] rounded-full mr-3"></span>
                14k solid gold
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-[#305040] rounded-full mr-3"></span>
                Ethically sourced materials
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-[#305040] rounded-full mr-3"></span>
                Rigorously tested
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-[#305040] rounded-full mr-3"></span>
                Lifetime guarantee
              </li>
            </ul>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <button className="w-full bg-[#305040] text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-normal hover:bg-[#2a4536] transition-colors duration-300">
              Add to Cart
            </button>
            <button className="w-full border border-[#305040] text-[#305040] px-8 py-4 text-sm uppercase tracking-[0.15em] font-normal hover:bg-[#305040] hover:text-white transition-colors duration-300">
              Add to Wishlist
            </button>
          </div>

          {/* Care Instructions */}
          <div className="border-t border-[#e6dcd4] mt-8 pt-8">
            <h3 className="text-sm font-semibold text-[#305040] uppercase tracking-wider mb-3">
              Care & Cleaning
            </h3>
            <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
              To keep your piece looking beautiful, clean regularly with a soft cloth. For deeper cleaning, use lukewarm water and gentle soap. Avoid harsh chemicals and prolonged water exposure.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
