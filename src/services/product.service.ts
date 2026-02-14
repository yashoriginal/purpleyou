import { Product, Variant, VariantSchema } from "@/types/product";

const EXTERNAL_API_URL = "https://purpleoneservice.onrender.com/api/v1";

// API Response Types

// Old API format (currently used by the backend)
interface APIImage {
  url: string;
  isPrimary: boolean;
  alt?: string;
}

interface APIVariantOld {
  color: string;
  size: string;
  stock: number;
  sku: string;
  price?: number;
  name?: string;
}

interface APIProductOld {
  productId: string;
  title: string;
  price: number;
  comparePrice?: number;
  slug: string;
  category: string;
  description: string;
  images: APIImage[];
  isBestseller?: boolean;
  isNew?: boolean;
  variants?: APIVariantOld[];
  isActive: boolean;
}

interface APIResponseOld {
  data: {
    items: APIProductOld[];
  };
  success: boolean;
  statusCode?: number;
  error?: string;
}

// New v2 API format (future)
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

// Validate and normalize image URLs
function validateImageUrl(url?: string): string {
  if (!url) return "/images/hero1.jpg";

  // Already absolute URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Already a local path
  if (url.startsWith("/")) {
    return url;
  }

  // Relative path or invalid - use fallback
  return "/images/hero1.jpg";
}

// Map old API product format to new internal Product type
function mapOldAPIProductToProduct(apiProduct: APIProductOld): Product {
  const slug = (apiProduct.slug && typeof apiProduct.slug === 'string')
    ? apiProduct.slug
    : generateSlug(apiProduct.title || `product-${apiProduct.productId}`);

  // Get primary image or first image
  const primaryImage =
    apiProduct.images?.find((img) => img.isPrimary) || apiProduct.images?.[0];
  const hoverImage = apiProduct.images?.[1];

  return {
    id: parseInt(apiProduct.productId.replace(/\D/g, ""), 10) || Math.random(),
    productId: apiProduct.productId,
    name: apiProduct.title,
    category: apiProduct.category?.toLowerCase() || "uncategorized",
    description: apiProduct.description,
    slug: slug,
    base: {
      stock: 100, // Old API doesn't provide stock, use default
      price: Math.floor(apiProduct.price),
    },
    price: Math.floor(apiProduct.price),
    comparePrice: apiProduct.comparePrice
      ? Math.floor(apiProduct.comparePrice)
      : undefined,
    image: primaryImage?.url || "/images/hero1.jpg",
    hoverImage: hoverImage?.url,
    isBestseller: apiProduct.isBestseller ?? false,
    isNew: apiProduct.isNew ?? false,
  };
}

// Map new v2 API product format to internal Product type
function mapV2APIProductToProduct(apiProduct: any): Product {
  const slug = generateSlug(apiProduct.name || `product-${apiProduct.productId}`);

  // Get primary image from first variant or use default (with validation)
  const primaryImage = validateImageUrl(
    apiProduct.variants?.[0]?.resolved?.images?.[0] ||
    apiProduct.variants?.[0]?.overrides?.images?.[0] ||
    apiProduct.base?.images?.[0]
  );

  // Get hover/secondary image from second variant (with validation)
  const hoverImageRaw =
    apiProduct.variants?.[1]?.resolved?.images?.[0] ||
    apiProduct.variants?.[1]?.overrides?.images?.[0];
  const hoverImage = hoverImageRaw ? validateImageUrl(hoverImageRaw) : undefined;

  // Ensure productId is a string (required)
  const productId = String(apiProduct.productId || `product-${Date.now()}`);

  return {
    id: parseInt(productId.replace(/\D/g, ""), 10) || Math.random(),
    productId: productId,
    name: apiProduct.name || "Unnamed Product",
    category: (apiProduct.category || "").toLowerCase() || "uncategorized",
    subcategory: apiProduct.subcategory?.toLowerCase(),
    description: apiProduct.description || "",
    slug: slug,
    base: apiProduct.base || { stock: 0, price: 0 },
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
    price: apiProduct.base?.price,
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
    console.log(`[API] Fetching products from: ${EXTERNAL_API_URL}/products`);
    const res = await fetch(`${EXTERNAL_API_URL}/products`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.error(`[API] Failed to fetch - Status: ${res.status}`);
      return useFallbackProducts();
    }

    const data = await res.json();
    console.log(`[API] Response received`);
    console.log(`[API] Full response structure:`, {
      statusCode: data.statusCode,
      status: data.status,
      success: data.success,
      productsLength: data.data?.products?.length,
      itemsLength: data.data?.items?.length,
      hasNextPage: data.data?.pagination?.hasNextPage,
      totalCount: data.meta?.pagination?.total,
    });

    let products: Product[] = [];

    // Detect API format and handle accordingly
    if (data.status === "SUCCESS" && data.data?.products) {
      // Pure v2 API format
      console.log(`[API] ✅ Detected pure v2 API format (status=SUCCESS, ${data.data.products.length} products)`);
      products = data.data.products
        .filter((item: APIProductBase) => item.state !== "INACTIVE" && item.state !== "DRAFT")
        .map(mapV2APIProductToProduct);
    } else if (data.success && data.data?.items && data.data.items.length > 0) {
      // Hybrid format: old envelope (success, data.items) with v2 product data
      const firstItem = data.data.items[0];
      console.log(`[API] Detected hybrid format: ${data.data.items.length} items, checking first item...`);

      if (firstItem.base && firstItem.variantSchema !== undefined) {
        // This is v2 product data in old envelope
        console.log(`[API] ✅ Hybrid format confirmed: v2 products in old envelope (${data.data.items.length} items)`);
        products = data.data.items
          .filter((item: any) => item.state !== "INACTIVE" && item.state !== "DRAFT")
          .map(mapV2APIProductToProduct);
      } else {
        // This is old format
        console.log(`[API] ✅ Detected old API format (success=${data.success}, items=${data.data.items.length})`);
        products = data.data.items
          .filter((item: APIProductOld) => item.isActive !== false)
          .map(mapOldAPIProductToProduct);
      }
    } else {
      console.warn(`[API] ❌ Unknown API response structure`);
      console.log(`[API] data.status:`, data.status);
      console.log(`[API] data.success:`, data.success);
      console.log(`[API] data.data?.products:`, data.data?.products ? `${data.data.products.length} items` : "undefined");
      console.log(`[API] data.data?.items:`, data.data?.items ? `${data.data.items.length} items` : "undefined");
      return useFallbackProducts();
    }

    // Cache the products
    cachedProducts = products;
    cacheTimestamp = Date.now();

    if (products.length > 0) {
      console.log(`[API] ✅ Successfully loaded ${products.length} products from API`);
      console.log(`[API] Products:`, products.map(p => `${p.name} (${p.category})`).join(", "));
    } else {
      console.log(`[API] ⚠️ Loaded 0 products from API`);
    }
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

    console.log(`[FALLBACK] Using ${dummyProducts.length} dummy products for demo`);

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

/**
 * Get unique categories from all products
 * Used for dynamic navigation and category display
 */
export async function getAllCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categories = Array.from(
    new Set(products.map((p) => p.category.toLowerCase()))
  ).sort();
  return categories;
}
