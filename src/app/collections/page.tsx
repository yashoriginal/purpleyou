import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/services/product.service";

export const revalidate = 600;

const categoryImages: { [key: string]: string } = {
  bracelet: "/category/Bracelet.jpeg",
  bracelets: "/category/Bracelet.jpeg",
  earrings: "/category/Earrings.jpeg",
  necklace: "/category/Necklace.jpeg",
  necklaces: "/category/Necklace.jpeg",
  ring: "/category/Ring.jpeg",
  rings: "/category/Ring.jpeg",
};

// Function to get category image with better matching
function getCategoryImage(category: string): string {
  const cat = category.toLowerCase().trim();

  // Direct lookup
  if (categoryImages[cat]) {
    return categoryImages[cat];
  }
  
  // Try singular/plural variations
  const singularForm = cat.endsWith('s') ? cat.slice(0, -1) : cat;
  const pluralForm = `${cat}s`;

  if (categoryImages[singularForm]) {
    return categoryImages[singularForm];
  }

  if (categoryImages[pluralForm]) {
    return categoryImages[pluralForm];
  }
  
  // Fallback: construct path from category name - ALWAYS use category folder
  const categoryName = cat
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
    .replace(/s$/, '');
  
  const fallbackPath = `/category/${categoryName}.jpeg`;
  return fallbackPath;
}

export default async function CollectionsIndex() {
  const categories = await getAllCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-3">
          Collections
        </h1>
        <p className="text-sm text-[#6b6b6b] font-light max-w-2xl">
          Browse our premium jewelry collections. Each piece is crafted with
          care and designed to last.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/collections/${cat}`}
            className="collection-card group relative overflow-hidden bg-[#f8f5f2] aspect-square"
          >
            <Image
              src={getCategoryImage(cat)}
              alt={cat.replace("-", " ")}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#D3C9FF]/20 to-transparent group-hover:from-[#D3C9FF]/40 transition-all duration-300 flex items-center justify-center z-10">
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
