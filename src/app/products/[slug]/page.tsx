import { products } from "@/lib/data"
import Image from "next/image"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  const product = products.find(p => p.slug === slug)

  if (!product) {
    return <div className="p-4">Product not found</div>
  }

  return (
    <div className="p-4">
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={500}
        className="rounded-lg"
      />

      <h1 className="text-xl font-semibold mt-4">{product.name}</h1>
      <p className="mt-2 text-gray-600">₹{product.price}</p>

      <button className="mt-4 bg-black text-white px-6 py-3 rounded">
        Add to Cart
      </button>
    </div>
  )
}
