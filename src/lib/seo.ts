import { Metadata } from "next";
import { Category } from "./data";
import { Product } from "@/types/product";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://purpleyou.com";
const SITE_NAME = "PURPLE YOU";
const SITE_DESCRIPTION =
  "Premium jewelry for every moment. Discover elegant, timeless pieces crafted with care and designed to last.";

/**
 * Generate metadata for home page
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: "PURPLE YOU - Premium Jewelry Collection | Elegant Accessories",
    description: SITE_DESCRIPTION,
    keywords: [
      "jewelry",
      "premium jewelry",
      "gold jewelry",
      "earrings",
      "necklaces",
      "rings",
      "bracelets",
      "luxury accessories",
      "handcrafted jewelry",
    ],
    alternates: {
      canonical: `${SITE_URL}/`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/`,
      title: `${SITE_NAME} - Premium Jewelry Collection`,
      description: SITE_DESCRIPTION,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "PURPLE YOU Jewelry",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} - Premium Jewelry Collection`,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/images/og-image.jpg`],
    },
  };
}

/**
 * Generate metadata for collection page
 */
export function generateCollectionMetadata(
  category: Category,
  productCount: number,
): Metadata {
  const title = `${category.name} Collection - PURPLE YOU | Premium ${category.name}`;
  const description = `Shop our curated ${category.name.toLowerCase()} collection. ${category.description} Over ${productCount} unique pieces.`;

  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      "jewelry",
      "luxury",
      category.slug,
      "accessories",
    ],
    alternates: {
      canonical: `${SITE_URL}/collections/${category.slug}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/collections/${category.slug}`,
      title: `${category.name} - PURPLE YOU`,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.name} Collection`,
        },
      ],
    },
  };
}

/**
 * Generate metadata for product page
 */
export function generateProductMetadata(product: Product): Metadata {
  const price = product.price || product.base?.price || 0;
  const title = `${product.name} - PURPLE YOU | ₹${price.toLocaleString("en-IN")}`;
  const description =
    product.description ||
    `Discover ${product.name} at PURPLE YOU. Premium jewelry handcrafted with care.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      "jewelry",
      product.category,
      "premium",
      "accessories",
    ],
    alternates: {
      canonical: `${SITE_URL}/products/${product.slug}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/products/${product.slug}`,
      title: product.name,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: product.image || "/images/hero1.jpg",
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://www.facebook.com/purpleyou",
      "https://www.instagram.com/purpleyou",
      "https://www.twitter.com/purpleyou",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-1800-PURPLE-1",
      contactType: "Customer Support",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Jewelry Street",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110001",
      addressCountry: "IN",
    },
  };
}

/**
 * Generate JSON-LD structured data for Product
 */
export function generateProductSchema(product: Product, baseURL: string) {
  const price = product.price || product.base?.price || 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || "/images/hero1.jpg",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${baseURL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: price.toString(),
      priceValidUntil: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0], // Valid for 30 days
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "247",
    },
  };
}

/**
 * Generate JSON-LD structured data for Collection/Category
 */
export function generateCollectionSchema(
  category: Category,
  baseURL: string,
  products: Product[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: category.name,
    description: category.description,
    image: category.image,
    url: `${baseURL}/collections/${category.slug}`,
    hasPart: products.map((product) => {
      const price = product.price || product.base?.price || 0;
      return {
        "@type": "Product",
        name: product.name,
        url: `${baseURL}/products/${product.slug}`,
        image: product.image || "/images/hero1.jpg",
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: price.toString(),
        },
      };
    }),
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD structured data for FAQPage
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Helper to create canonical URL
 */
export function getCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Helper to create sitemap URLs
 */
export function generateSitemapUrls(
  pages: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  }>,
) {
  return pages.map(
    (page) => `
  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
    ${page.priority ? `<priority>${page.priority}</priority>` : ""}
  </url>`,
  );
}

/**
 * TODO: API Integration
 * When you have a real backend, replace the mock functions above with actual API calls:
 *
 * Example API call for product data:
 * ```
 * async function getProductFromAPI(slug: string): Promise<Product> {
 *   const response = await fetch(`https://api.example.com/products/${slug}`, {
 *     headers: {
 *       Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
 *     },
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error(`Failed to fetch product: ${response.status}`);
 *   }
 *
 *   return response.json();
 * }
 * ```
 *
 * Example for product metadata generation with real data:
 * ```
 * export async function generateProductMetadataFromAPI(
 *   slug: string
 * ): Promise<Metadata> {
 *   const product = await getProductFromAPI(slug);
 *   return generateProductMetadata(product);
 * }
 * ```
 */
