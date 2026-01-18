import { Product } from "@/types/product";

const EXTERNAL_API_URL = "https://purpleoneservice.onrender.com/api/v1/products";

interface APIVariant {
  color: string;
  size: string;
  stock: number;
  sku: string;
  price?: number;
  name?: string;
}

interface APIImage {
  url: string;
  isPrimary: boolean;
  alt?: string;
}

interface APIProduct {
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
  variants?: APIVariant[];
  isActive: boolean;
}

interface APIResponse {
  data: {
    items: APIProduct[];
  };
  success: boolean;
}

// Map external API product to frontend Product type
function mapAPIProductToProduct(apiProduct: APIProduct): Product {
  // Get primary image or first image
  const primaryImage = apiProduct.images.find((img) => img.isPrimary) || apiProduct.images[0];
  const hoverImage = apiProduct.images[1];

  return {
    id: parseInt(apiProduct.productId.replace(/\D/g, ""), 10) || Math.random(),
    name: apiProduct.title,
    price: Math.floor(apiProduct.price),
    comparePrice: apiProduct.comparePrice ? Math.floor(apiProduct.comparePrice) : undefined,
    slug: apiProduct.slug,
    image: primaryImage?.url || "/images/hero1.jpg",
    hoverImage: hoverImage?.url,
    category: apiProduct.category?.toLowerCase() || "uncategorized",
    description: apiProduct.description,
    isBestseller: apiProduct.isBestseller ?? false,
    isNew: apiProduct.isNew ?? false,
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
    const res = await fetch(EXTERNAL_API_URL, {
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch products from API:", res.status);
      return [];
    }

    const data: APIResponse = await res.json();

    if (!data.success || !data.data?.items) {
      console.error("Invalid API response structure");
      return [];
    }

    // Filter only active products and map them
    const products = data.data.items
      .filter((item) => item.isActive !== false)
      .map(mapAPIProductToProduct);

    // Cache the products
    cachedProducts = products;
    cacheTimestamp = Date.now();

    return products;
  } catch (error) {
    console.error("Error fetching products from API:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProductsFromAPI();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const products = await fetchProductsFromAPI();

  if (collection.toLowerCase() === "all") {
    return products;
  }

  return products.filter((product) => product.category.toLowerCase() === collection.toLowerCase());
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchProductsFromAPI();
}
