import Link from "next/link";
import { products } from "@/lib/data";

export const revalidate = 600;

export default function CollectionsIndex() {
  const categories = Array.from(
    new Set(products.map((p) => p.category.toLowerCase()))
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-[#305040] tracking-wide mb-3">
          Collections
        </h1>
        <p className="text-sm text-[#6b6b6b] font-light max-w-2xl">
          Browse our curated collections of fine jewelry, handcrafted with sustainable materials and timeless design.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/collections/${cat}`}
            className="collection-card group"
          >
            <div className="bg-[#f5f2f0] h-40 sm:h-48 flex items-center justify-center overflow-hidden hover:bg-[#efeae2] transition-colors">
              <span className="text-sm sm:text-base font-light text-[#305040] tracking-wide capitalize text-center px-4 group-hover:text-[#6b7b73]">
                {cat.replace("-", " ")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
