import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="border rounded-lg p-2">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={400}
          className="rounded"
        />
        <h3 className="mt-2 text-sm">{product.name}</h3>
        <p className="text-sm text-gray-500">₹{product.price}</p>
      </div>
    </Link>
  )
}
