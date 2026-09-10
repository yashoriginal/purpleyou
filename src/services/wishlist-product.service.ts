import { adaptProduct } from "@/adapters/product.adapter";

import type { Department } from "@/lib/departments";

import { clientApiFetch } from "@/services/client-api";

import type { ApiResponse } from "@/types/api";
import type { ApiProduct, Product } from "@/types/product";

export interface WishlistProductSummary {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;

  department?: Department;

  price: number;
  undiscountedPrice?: number;
  currency?: string;

  stock: number;
  state: string;
}

interface ProductDetailData {
  product: ApiProduct;
}

interface DevProductResponse {
  product: Product | null;
}

const productCache = new Map<string, Promise<WishlistProductSummary | null>>();

async function fetchProduct(
  productId: string,
): Promise<WishlistProductSummary | null> {
  /*
   * Local dummy products.
   *
   * These never go to the real backend
   * because the backend doesn't know
   * DEV-MEN-* product IDs.
   */
  if (process.env.NODE_ENV === "development" && productId.startsWith("DEV-")) {
    const devProduct = await fetchDevProduct(productId);

    if (devProduct) {
      return createSummary(devProduct);
    }
  }

  /*
   * Real backend products.
   */
  const response = await clientApiFetch<ApiResponse<ProductDetailData>>(
    `/products/${encodeURIComponent(productId)}`,
  );

  const apiProduct = response.data?.product;

  if (!apiProduct) {
    return null;
  }

  if (apiProduct.state === "DRAFT") {
    return null;
  }

  const product = adaptProduct(apiProduct);

  return createSummary(product);
}

async function fetchDevProduct(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `/api/dev-products/${encodeURIComponent(productId)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as DevProductResponse;

    return data.product ?? null;
  } catch {
    return null;
  }
}

function createSummary(product: Product): WishlistProductSummary {
  const rawDepartment = product.base.taxonomy?.department?.trim().toLowerCase();

  const department: Department | undefined =
    rawDepartment === "women" || rawDepartment === "men"
      ? rawDepartment
      : undefined;

  return {
    productId: product.productId,

    slug: product.slug,

    name: product.name,

    imageUrl: product.images[0] ?? null,

    department,

    price: product.base.price,

    undiscountedPrice: product.base.undiscountedPrice,

    currency: product.currency,

    stock: product.base.stock,

    state: product.state,
  };
}

export function getWishlistProduct(
  productId: string,
): Promise<WishlistProductSummary | null> {
  const existing = productCache.get(productId);

  if (existing) {
    return existing;
  }

  const request = fetchProduct(productId).catch((error) => {
    productCache.delete(productId);

    throw error;
  });

  productCache.set(productId, request);

  return request;
}
