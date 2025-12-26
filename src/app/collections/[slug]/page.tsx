import ProductGrid from "@/components/product/ProductGrid";
import { products } from "@/lib/data";
import type { Metadata } from "next";

/* ---------------------------------------
   Static generation (SSG)
---------------------------------------- */
export function generateStaticParams() {
  const categories = Array.from(
    new Set(
      products
        .map((product) => (product.category ?? "").toString().toLowerCase())
        .filter(Boolean)
    )
  );

  return categories.map((category) => ({
    category,
  }));
}

/* ---------------------------------------
   ISR (Incremental Static Regeneration)
---------------------------------------- */
export const revalidate = 300; // Revalidate every 5 minutes

/* ---------------------------------------
   SEO metadata per category
---------------------------------------- */
export function generateMetadata({
  params,
}: {
  params: { category?: string };
}): Metadata {
  const category = params.category ?? "Collection";

  const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${categoryName} | Aurate New York`,
    description: `Explore sustainable fine ${categoryName.toLowerCase()} from Aurate New York. Ethically crafted, guaranteed for life.`,
  };
}

/* ---------------------------------------
   Page component
---------------------------------------- */
type PageProps = {
  params: { category: string };
};

export default function CategoryPage({ params }: PageProps) {
  const { category } = params;

  const normalizedCategory = (category ?? "").toLowerCase();

  const filteredProducts = products.filter((product) => {
    return (product.category ?? "").toLowerCase() === normalizedCategory;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#6b6b6b]">
        No products found in “{category}”.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-[#305040] tracking-wide capitalize mb-3">
          {category}
        </h1>
        <p className="text-sm text-[#6b6b6b] font-light max-w-2xl">
          Discover our collection of sustainable, ethically crafted {category.toLowerCase()}. Each piece is designed to last a lifetime.
        </p>
      </div>

      <ProductGrid products={filteredProducts} />
    </section>
  );
}
