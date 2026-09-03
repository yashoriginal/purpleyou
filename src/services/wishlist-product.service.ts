import { adaptProduct } from "@/adapters/product.adapter";
import { clientApiFetch } from "@/services/client-api";

import type { ApiResponse } from "@/types/api";
import type { ApiProduct } from "@/types/product";

export interface WishlistProductSummary {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;

  price: number;
  undiscountedPrice?: number;
  currency?: string;

  stock: number;
  state: string;
}

interface ProductDetailData {
  product: ApiProduct;
}

const productCache = new Map<string, Promise<WishlistProductSummary | null>>();

async function fetchProduct(
  productId: string,
): Promise<WishlistProductSummary | null> {
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

  return {
    productId: product.productId,
    slug: product.slug,
    name: product.name,

    imageUrl: product.images[0] ?? null,

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
