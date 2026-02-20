import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import DynamicAspectImage from "@/components/DynamicAspectImage";
import {
  generateProductMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image";
import { getAllProducts, getProductBySlug } from "@/services/product.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Disable static generation for now to allow build to complete
 * TODO: Implement proper static param generation once API is stable
 */
export async function generateStaticParams() {
  // Return empty array - routes will be generated on-demand (ISR)
  return [];
}

/**
 * Dynamic metadata generation for each product
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    };
  }

  return generateProductMetadata(product);
}

// ISR: Revalidate every 30 minutes (price updates, stock changes, etc.)
export const revalidate = 1800;


export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  const allProducts = await getAllProducts();

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-light text-[#111111] tracking-wide">
            Product not found
          </h1>
        </div>
      </section>
    );
  }

  const accordionItems = [
    {
      title: "Description",
      content:
        product.description ||
        "A versatile piece of jewelry crafted with precision and care.",
    },
    {
      title: "Materials & Care",
      content: product.materials
        ? `${product.materials}. ${product.careInstructions || "Store safely and clean regularly with a soft cloth."}`
        : "22K gold or gold plated. Care instructions available upon request.",
    },
    {
      title: "Size Guide",
      content:
        "Size varies by product. For rings, measure your ring size by wrapping a piece of string around your finger. For necklaces and bracelets, standard sizes are provided with options for customization.",
    },
    {
      title: "Shipping & Returns",
      content:
        "Free shipping on orders above ₹3000 in India. Standard delivery: 5-7 business days. Hassle-free returns within 15 days. GST included in all prices.",
    },
  ];

  const productSchema = generateProductSchema(
    {
      ...product,
      price: product.base.price,
    },
    "https://purpleyou.com"
  );
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://purpleyou.com" },
    {
      name: "Products",
      url: "https://purpleyou.com/collections/all",
    },
    {
      name: product.category,
      url: `https://purpleyou.com/collections/${product.category}`,
    },
    {
      name: product.name,
      url: `https://purpleyou.com/products/${product.slug}`,
    },
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      {/* JSON-LD Structured Data */}
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16">
        {/* Client Component - Handles all interactive parts */}
        <ProductDetailClient product={product} />
      </div>

      {/* Accordions Section */}
      <div className="mb-16">
        <ProductAccordion items={accordionItems} />
      </div>

      {/* Related Products Section */}
      <div className="border-t border-[#e6e0da] pt-16">
        <h2 className="text-3xl font-light text-[#111111] tracking-wide mb-8">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allProducts
            .filter(
              (p) => p.category === product.category && p.id !== product.id,
            )
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.slug}`}
              >
                <div className="group cursor-pointer">
                  <DynamicAspectImage
                    src={normalizeImageUrl(relatedProduct.image)}
                    alt={relatedProduct.name}
                    defaultAspectRatio={0.75}
                    containerClassName="relative bg-[#f8f5f2] mb-3 overflow-hidden"
                    imageClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-sm font-medium text-[#111111] line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm font-medium text-[#111111] mt-2">
                    ₹{relatedProduct.base?.price?.toLocaleString("en-IN") || "Price on request"}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
