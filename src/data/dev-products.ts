import { devMenProducts } from "@/data/dev-men-products";

import type { Product } from "@/types/product";

export function getDevProducts(): Product[] {
  if (process.env.NODE_ENV !== "development") {
    return [];
  }

  return devMenProducts;
}
export function getDevProductById(productId: string): Product | undefined {
  if (process.env.NODE_ENV !== "development") {
    return undefined;
  }

  return devMenProducts.find((product) => product.productId === productId);
}

export function getDevProductsByDepartment(
  department: "women" | "men",
): Product[] {
  if (process.env.NODE_ENV !== "development") {
    return [];
  }

  return devMenProducts.filter(
    (product) =>
      product.base.taxonomy?.department?.trim().toLowerCase() === department,
  );
}

export function getDevProductsByProductType(productType: string): Product[] {
  if (process.env.NODE_ENV !== "development") {
    return [];
  }

  const normalizedType = productType.trim().toLowerCase();

  return devMenProducts.filter(
    (product) =>
      product.base.taxonomy?.productType?.trim().toLowerCase() ===
      normalizedType,
  );
}

export function getDevProductBySlug(slug: string): Product | undefined {
  if (process.env.NODE_ENV !== "development") {
    return undefined;
  }

  return devMenProducts.find((product) => product.slug === slug);
}
