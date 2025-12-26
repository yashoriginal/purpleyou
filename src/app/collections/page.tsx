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
        <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-3">
          Collections
        </h1>
        <p className="text-sm text-[#6b6b6b] font-light max-w-2xl">
          Browse our premium jewelry collections. Each piece is crafted with care and designed to last.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/collections/${cat}`}
            className="collection-card group relative overflow-hidden bg-[#f8f5f2] aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D3C9FF]/20 to-transparent group-hover:from-[#D3C9FF]/40 transition-all duration-300 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-light text-[#111111] tracking-wide capitalize text-center px-4 group-hover:text-[#5540b7] transition-colors">
                {cat.replace("-", " ")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
