import { Product, Variant, VariantSchema } from "@/types/product";

const EXTERNAL_API_URL = "https://purpleoneservice.onrender.com/api/v1";

// API Response Types
interface APIVariant {
  variantId: string;
  attributes: Record<string, string>;
  overrides?: {
    stock?: number;
    price?: number;
    images?: string[];
    sku?: string;
  };
  resolved?: {
    price: number;
    stock: number;
    images?: string[];
    sku?: string;
  };
}

interface APIProductBase {
  productId: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  state?: string;
  base: {
    stock: number;
    price: number;
  };
  variantSchema?: Record<string, string[]>;
  variants?: APIVariant[];
  tags?: string[];
  currency?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface APIListResponse {
  status: string;
  data: {
    products: APIProductBase[];
  };
  meta?: {
    timestamp?: string;
    apiVersion?: string;
    pagination?: { limit: number };
  };
}

interface APIDetailResponse {
  status: string;
  data: {
    product: APIProductBase;
  };
  meta?: {
    timestamp?: string;
    apiVersion?: string;
  };
}

// Generate URL-friendly slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Map external API product to frontend Product type
function mapAPIProductToProduct(apiProduct: APIProductBase): Product {
  const slug = generateSlug(apiProduct.name);

  // Get primary image from first variant or use default
  const primaryImage =
    apiProduct.variants?.[0]?.resolved?.images?.[0] ||
    apiProduct.variants?.[0]?.overrides?.images?.[0] ||
    "/images/hero1.jpg";

  // Get hover/secondary image from second variant
  const hoverImage =
    apiProduct.variants?.[1]?.resolved?.images?.[0] ||
    apiProduct.variants?.[1]?.overrides?.images?.[0];

  return {
    id: parseInt(apiProduct.productId.replace(/\D/g, ""), 10) || Math.random(),
    productId: apiProduct.productId,
    name: apiProduct.name,
    category: apiProduct.category?.toLowerCase() || "uncategorized",
    subcategory: apiProduct.subcategory?.toLowerCase(),
    description: apiProduct.description,
    slug: slug,
    base: apiProduct.base,
    variantSchema: apiProduct.variantSchema,
    variants: apiProduct.variants as Variant[],
    state: apiProduct.state,
    tags: apiProduct.tags,
    currency: apiProduct.currency,
    brand: apiProduct.brand,
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,

    // Legacy fields for backward compatibility
    image: primaryImage,
    hoverImage: hoverImage,
    price: apiProduct.base.price,
  };
}

let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchProductsFromAPI(): Promise<Product[]> {
  // Return cached products if still valid
  if (cachedProducts && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const res = await fetch(`${EXTERNAL_API_URL}/products`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch products from API:", res.status);
      return useFallbackProducts();
    }

    const data: APIListResponse = await res.json();

    if (data.status !== "SUCCESS" || !data.data?.products) {
      console.warn("Invalid API response structure, using fallback data");
      return useFallbackProducts();
    }

    // Filter only active products and map them
    const products = data.data.products
      .filter((item) => item.state !== "INACTIVE" && item.state !== "DRAFT")
      .map(mapAPIProductToProduct);

    // Cache the products
    cachedProducts = products;
    cacheTimestamp = Date.now();

    return products;
  } catch (error) {
    console.error("Error fetching products from API:", error);
    return useFallbackProducts();
  }
}

/**
 * Fallback to dummy data when API is unavailable
 * This allows the app to display products during development
 */
function useFallbackProducts(): Product[] {
  try {
    const { products: dummyProducts } = require("@/lib/data");

    // Convert dummy products to new format
    return dummyProducts.map((product: any) => ({
      ...product,
      productId: product.productId || `P${product.id}`,
      base: {
        stock: 100, // Default stock
        price: product.price || 0,
      },
      // For now, don't use variants from dummy data
      // They can be added when proper variant data is available
    }));
  } catch {
    console.error("Failed to load fallback products");
    return [];
  }
}

async function fetchProductByIdFromAPI(
  productId: string,
): Promise<Product | null> {
  try {
    const res = await fetch(`${EXTERNAL_API_URL}/products/${productId}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch product ${productId}:`, res.status);
      return null;
    }

    const data: APIDetailResponse = await res.json();

    if (data.status !== "SUCCESS" || !data.data?.product) {
      console.error("Invalid API response structure");
      return null;
    }

    return mapAPIProductToProduct(data.data.product);
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProductsFromAPI();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductsByCollection(
  collection: string,
): Promise<Product[]> {
  const products = await fetchProductsFromAPI();

  if (collection.toLowerCase() === "all") {
    return products;
  }

  return products.filter(
    (product) => product.category.toLowerCase() === collection.toLowerCase(),
  );
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchProductsFromAPI();
}

export async function getProductById(productId: string): Promise<Product | null> {
  return fetchProductByIdFromAPI(productId);
}
