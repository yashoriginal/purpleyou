import type { ApiProduct, Product } from "@/types/product";

import { normalizeProductImageUrl } from "@/lib/image";

function extractImageUrl(
  image: unknown,
): string | null {
  if (typeof image === "string") {
    return normalizeProductImageUrl(image);
  }

  if (image && typeof image === "object" && "url" in image) {
    const url = (image as { url: unknown }).url;

    return normalizeProductImageUrl(url);
  }

  return null;
}

export function createProductSlug(name: string, productId: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || productId.toLowerCase();
}

export function adaptProduct(apiProduct: ApiProduct): Product {
  const variantImages =
    apiProduct.variants?.flatMap((variant) => {
      if (variant.resolved?.images?.length) {
        return variant.resolved.images;
      }

      if (variant.overrides?.images?.length) {
        return variant.overrides.images;
      }

      return [];
    }) ?? [];

  const rawImages = Array.from(
    new Set([...(apiProduct.base.images ?? []), ...variantImages]),
  );

  const images = rawImages
    .map(extractImageUrl)
    .filter((image): image is string => image !== null);

  return {
    ...apiProduct,

    slug: createProductSlug(apiProduct.name, apiProduct.productId),

    images,
  };
}
