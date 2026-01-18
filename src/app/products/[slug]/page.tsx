import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import ProductAccordion from "@/components/product/ProductAccordion";
import AddToCartButton from "@/components/product/AddToCartButton";
import {
  generateProductMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import { getAllProducts, getProductBySlug } from "@/services/product.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate static parameters for all product pages
 * This enables static site generation (SSG) for each product
 */
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
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
        : "18K gold or gold plated. Care instructions available upon request.",
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

  const productSchema = generateProductSchema(product, "https://purpleyou.com");
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
        {/* Left Column - Media Gallery */}
        <div className="flex flex-col gap-6">
          {/* Main Image */}
          <div className="relative bg-[#f8f5f2] aspect-[3/4] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity">
              <Image
                src={product.image}
                alt="Thumbnail 1"
                fill
                className="object-cover"
              />
            </div>
            {product.hoverImage && (
              <div className="relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity">
                <Image
                  src={product.hoverImage}
                  alt="Thumbnail 2"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {product.videoUrl && (
              <div className="relative bg-[#f8f5f2] aspect-square overflow-hidden cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center">
                <video
                  src={product.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Video Section - Below Gallery */}
          {product.videoUrl && (
            <div className="relative bg-[#f8f5f2] aspect-video overflow-hidden">
              <video
                src={product.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Right Column - Purchase Panel */}
        <div className="flex flex-col">
          {/* Product Header */}
          <div className="pb-6 border-b border-[#e6e0da]">
            <h1 className="text-3xl sm:text-4xl font-light text-[#111111] tracking-wide mb-3">
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-light text-[#111111]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-[#6b6b6b] line-through">
                  ₹{product.comparePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          <AddToCartButton product={product} />
        </div>
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
          {products
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
                  <div className="relative bg-[#f8f5f2] aspect-[3/4] mb-3 overflow-hidden">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-[#111111] line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm font-medium text-[#111111] mt-2">
                    ₹{relatedProduct.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
