import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { categories } from "@/lib/data";
import {
  generateCollectionMetadata,
  generateCollectionSchema,
} from "@/lib/seo";
import CollectionFiltersClient from "@/components/collection/CollectionFiltersClient";
import {
  getAllProducts,
  getProductsByCollection,
} from "@/services/product.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const categoryImages: { [key: string]: string } = {
  bracelet: "/category/Bracelet.jpeg",
  bracelets: "/category/Bracelet.jpeg",
  earrings: "/category/Earrings.jpeg",
  necklace: "/category/Necklace.jpeg",
  necklaces: "/category/Necklace.jpeg",
  ring: "/category/Ring.jpeg",
  rings: "/category/Ring.jpeg",
};

// Function to get category image
function getCategoryImage(slug: string): string {
  if (slug === "all") {
    return "/category/Bracelet.jpeg"; // Default for all products
  }
  
  const cat = slug.toLowerCase().trim();
  
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
  
  // Fallback: construct path from category name
  const categoryName = cat
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
    .replace(/s$/, '');
  
  return `/category/${categoryName}.jpeg`;
}

/**
 * Generate static parameters for all collection pages
 * This enables static site generation (SSG) for each category
 */
export async function generateStaticParams() {
  return [{ slug: "all" }, ...categories.map((cat) => ({ slug: cat.slug }))];
}

/**
 * Dynamic metadata generation for each collection
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  const category = categories.find((c) => c.slug === slug);

  if (!category && slug !== "all") {
    return {
      title: "Collection Not Found",
      description: "The collection you're looking for doesn't exist.",
    };
  }

  const products =
    slug === "all"
      ? await getAllProducts()
      : await getProductsByCollection(slug);

  if (slug === "all") {
    return generateCollectionMetadata(
      {
        id: 0,
        name: "All Products",
        slug: "all",
        description: "Browse our complete collection of premium jewelry",
        image: "/category/Bracelet.jpeg",
      },
      products.length,
    );
  }

  return generateCollectionMetadata(category!, products.length);
}

// ISR: Revalidate every 10 minutes (product additions, price changes, etc.)
export const revalidate = 600;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const normalizedCategory = (slug ?? "").toLowerCase();

  // Fetch products from the external API service
  const baseProducts =
    normalizedCategory === "all"
      ? await getAllProducts()
      : await getProductsByCollection(normalizedCategory);

  if (baseProducts.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#6b6b6b]">
        No products found in "{slug}".
      </div>
    );
  }

  const displayTitle = slug === "all" ? "All Products" : slug.replace("-", " ");
  const category =
    categories.find((c) => c.slug === slug) ||
    (slug === "all"
      ? {
          id: 0,
          name: "All Products",
          slug: "all",
          description: "Browse our complete collection",
          image: "/category/Bracelet.jpeg",
        }
      : null);

  const collectionSchema = category
    ? generateCollectionSchema(category, "https://purpleyou.com", baseProducts)
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* JSON-LD Structured Data for Collection */}
      {collectionSchema && (
        <Script
          id={`collection-schema-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}

      {/* Hero Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
        {/* Left Column - Title and Description */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-light text-[#111111] tracking-wide capitalize mb-4">
            {displayTitle} 25% Off
          </h1>
          <p className="text-base text-[#6b6b6b] font-light">
            The closest to playing good{" "}
            {slug === "all" ? "jewelry" : slug.toLowerCase()} will ever get.
          </p>
        </div>

        {/* Right Column - Hero Image */}
        <div className="relative bg-[#f5f1ed] aspect-[4/3] overflow-hidden">
          <Image
            src={getCategoryImage(slug)}
            alt={displayTitle}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Client-side filtering wrapper */}
      <CollectionFiltersClient
        products={baseProducts}
        collectionName={displayTitle}
      />
    </section>
  );
}
