import ProductGrid from "@/components/product/ProductGrid"
import { products } from "@/lib/data"

export const metadata = {
  title: "Shop Dresses | PurpleOne",
}

export default function ProductListingPage() {
  return (
    <section className="p-4">
      <h1 className="text-xl font-semibold mb-4">All Dresses</h1>
      <ProductGrid products={products} />
    </section>
  )
}
