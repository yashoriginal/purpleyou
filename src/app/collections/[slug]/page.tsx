import ProductGrid from "@/components/product/ProductGrid"
import { products } from "@/lib/data"

type PageProps = {
  params: Promise<{ category: string }> | { category: string }
}

export default async function CategoryPage({ params }: PageProps) {
  // Await params if it's a Promise
  const { category } = params instanceof Promise ? await params : params

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  )

  if (filteredProducts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        No products found in the category "{category}".
      </div>
    )
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-semibold capitalize mb-4">{category}</h1>
      <ProductGrid products={filteredProducts} />
    </section>
  )
}
