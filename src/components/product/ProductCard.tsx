import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="product-card group cursor-pointer">
        <div className="relative overflow-hidden bg-[#f5f2f0]">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity duration-300"
          />
        </div>
        <div className="pt-4 pb-2">
          <h3 className="text-sm font-normal text-[#305040] tracking-wide">
            {product.name}
          </h3>
          <p className="text-xs text-[#6b6b6b] mt-1 font-light">
            {product.description}
          </p>
          <p className="text-sm font-light text-[#305040] mt-3">
            ${product.price}
          </p>
        </div>
      </div>
    </Link>
  )
}
