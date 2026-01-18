import ProductGrid from "@/components/product/ProductGrid"
import { getAllProducts } from "@/services/product.service"

export const metadata = {
  title: "Shop Jewelry | PurpleOne",
}

export const revalidate = 600

export default async function ProductListingPage() {
  const products = await getAllProducts()

  return (
    <section className="p-4">
      <h1 className="text-xl font-semibold mb-4">All Products</h1>
      <ProductGrid products={products} />
    </section>
  )
}
