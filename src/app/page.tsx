import ProductGrid from "@/components/product/ProductGrid"
import { products } from "@/lib/data"

export default function HomePage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Everyday Fine Jewelry
      </h1>
      <ProductGrid products={products} />
    </section>
  )
}
