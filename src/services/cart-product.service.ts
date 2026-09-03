import { normalizeProductImageUrl } from "@/lib/image";
import { clientApiFetch } from "@/services/client-api";

import type { BackendResponse } from "@/types/auth";

export interface CartProductSummary {
  productId: string;
  name: string;
  imageUrl: string | null;
}

interface ProductByIdProduct {
  productId: string;
  name: string;

  base: {
    price: number;
    stock: number;
    images: unknown[];
  };

  currency?: string;
}

interface ProductByIdData {
  product: ProductByIdProduct;
}

const productCache = new Map<string, Promise<CartProductSummary | null>>();

async function fetchProductSummary(
  productId: string,
): Promise<CartProductSummary | null> {
  const response = await clientApiFetch<
    BackendResponse<ProductByIdData | null>
  >(`/products/${encodeURIComponent(productId)}`);

  const product = response.data?.product;

  if (!product) {
    return null;
  }

  const firstImage = product.base?.images?.[0];

  return {
    productId: product.productId,
    name: product.name,
    imageUrl: normalizeProductImageUrl(firstImage),
  };
}

export function getCartProductSummary(
  productId: string,
): Promise<CartProductSummary | null> {
  const existing = productCache.get(productId);

  if (existing) {
    return existing;
  }

  const request = fetchProductSummary(productId).catch((error) => {
    productCache.delete(productId);

    throw error;
  });

  productCache.set(productId, request);

  return request;
}
