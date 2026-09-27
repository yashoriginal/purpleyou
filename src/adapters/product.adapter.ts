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

const DEFAULT_CATEGORY_TAXONOMY: Record<
  string,
  {
    department: string;
    category: string;
    subcategory: string;
    productType: string;
    productSubtype: string;
  }
> = {
  RING: { department: "Women", category: "Accessories", subcategory: "Jewelry", productType: "Rings", productSubtype: "Ring" },
  NECKLACE: { department: "Women", category: "Accessories", subcategory: "Jewelry", productType: "Necklaces", productSubtype: "Necklace" },
  EARRINGS: { department: "Women", category: "Accessories", subcategory: "Jewelry", productType: "Earrings", productSubtype: "Earring" },
  BRACELET: { department: "Women", category: "Accessories", subcategory: "Jewelry", productType: "Bracelets", productSubtype: "Bracelet" },
  ANKLET: { department: "Women", category: "Accessories", subcategory: "Jewelry", productType: "Anklets", productSubtype: "Anklet" },
  JEWELS: { department: "Women", category: "Accessories", subcategory: "Jewelry", productType: "Jewels", productSubtype: "Jewel" },
  ACCESSORIES: { department: "Women", category: "Accessories", subcategory: "Accessories", productType: "Accessories", productSubtype: "Accessory" },
};

function resolveTaxonomy(apiProduct: ApiProduct) {
  const existing = apiProduct.base?.taxonomy;
  const key = (apiProduct.category || "").trim().toUpperCase();
  const fallback = DEFAULT_CATEGORY_TAXONOMY[key] || {
    department: "Women",
    category: "Accessories",
    subcategory: "Jewelry",
    productType: "Jewels",
    productSubtype: "Jewel",
  };

  return {
    department: existing?.department?.trim() || fallback.department,
    category: existing?.category?.trim() || fallback.category,
    subcategory: existing?.subcategory?.trim() || fallback.subcategory,
    productType:
      existing?.productType?.trim() && existing.productType.toLowerCase() !== "lehenga"
        ? existing.productType
        : fallback.productType,
    productSubtype: existing?.productSubtype?.trim() || fallback.productSubtype,
  };
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
    new Set([...(apiProduct.base?.images ?? []), ...variantImages]),
  );

  const images = rawImages
    .map(extractImageUrl)
    .filter((image): image is string => image !== null);

  const subcategory =
    apiProduct.subcategory?.trim() || apiProduct.category || "Jewelry";

  const taxonomy = resolveTaxonomy(apiProduct);

  return {
    ...apiProduct,
    subcategory,
    base: {
      ...apiProduct.base,
      taxonomy,
    },
    slug: createProductSlug(apiProduct.name, apiProduct.productId),
    images,
  };
}

