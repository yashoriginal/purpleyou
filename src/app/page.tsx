import Hero from "@/components/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateHomeMetadata, generateOrganizationSchema } from "@/lib/seo";
import Script from "next/script";
import { getAllProducts, getAllCategories } from "@/services/product.service";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import DynamicAspectImage from "@/components/DynamicAspectImage";

export const metadata: Metadata = generateHomeMetadata();

// ISR: Revalidate every 10 minutes (to match API cache duration)
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
  const cat = category.toLowerCase();
  
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
  const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/s$/, '');
  return `/category/${categoryName}.jpeg`;
}

export default async function HomePage() {
  const apiProducts = await getAllProducts();
  const categories = await getAllCategories();
  const bestsellers = apiProducts.filter((p) => p.tags?.includes("Best Seller")).slice(0, 6);
  console.log(`[HOME] Total products: ${apiProducts.length}`);
  console.log(`[HOME] Bestsellers found: ${bestsellers.length}`);
  console.log(`[HOME] Bestseller products:`, bestsellers.map(p => `${p.name} (tags: ${p.tags?.join(", ") || "none"})`).join(", "));

  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero Section */}
      <Hero />

      {/* Category Tiles Section - Dynamically Generated from API */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className={`grid grid-cols-1 ${categories.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/collections/${category}`}
              >
                <DynamicAspectImage
                  src={getCategoryImage(category)}
                  alt={`${category} Collection`}
                  defaultAspectRatio={1}
                  containerClassName="category-tile group relative overflow-hidden bg-[#f8f5f2]"
                  imageClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center z-10">
                    <h3 className="text-3xl font-light text-white tracking-wider capitalize">
                      {category}
                    </h3>
                  </div>
                </DynamicAspectImage>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 bg-[#f8f5f2]">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-3">
            Best Sellers
          </h2>
          <p className="text-base text-[#6b6b6b] max-w-2xl font-light">
            Discover the jewelry pieces loved by our customers.
          </p>
        </div>
        {bestsellers.length > 0 ? (
          <ProductGrid products={bestsellers} />
        ) : (
          <p className="text-center text-[#6b6b6b]">No products available</p>
        )}
      </section>

      {/* Brand Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-6">
              Most versatile accessories in town
            </h2>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-6">
              At Purple You, we believe jewelry should be versatile, elegant,
              and accessible. Our collections are designed to seamlessly fit
              into any style—from minimalist everyday wear to bold statement
              pieces.
            </p>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-8">
              Each piece is carefully crafted with premium materials and
              attention to detail, ensuring they're made to last and loved for
              years to come.
            </p>
            <Link href="/about">
              <button className="bg-[#5540b7] text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors">
                Learn Our Story
              </button>
            </Link>
          </div>
          <DynamicAspectImage
            src="/images/hero1.jpg"
            alt="Purple You Brand Story"
            defaultAspectRatio={1}
            containerClassName="relative overflow-hidden"
            imageClassName="object-cover"
          />
        </div>
      </section>

      {/* Feature Video Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wider mb-3">
            See PURPLE YOU in Action
          </h2>
        </div>
        <div className="relative aspect-video bg-[#f8f5f2] overflow-hidden rounded-lg">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero1.jpg"
          >
            <source src="/videos/brand-showcase.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <button
              className="bg-white/80 hover:bg-white rounded-full p-4 transition-all"
              aria-label="Play video"
            >
              <svg
                className="w-8 h-8 text-[#5540b7]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <NewsletterSignup />
    </>
  );
}
