import "server-only";

import { adaptProduct } from "@/adapters/product.adapter";
import { getDevProducts } from "@/data/dev-products";
import { ApiError, apiFetch } from "@/services/api-client";

import type {
  ApiProduct,
  Product,
  ProductCategory,
  ProductTaxonomy,
} from "@/types/product";

import type { ApiPagination, ApiResponse } from "@/types/api";

interface ProductListResponse {
  products: ApiProduct[];
}

export interface ProductQuery {
  category?: ProductCategory;
  subcategory?: string;
  search?: string;

  taxonomy?: ProductTaxonomy;

  limit?: number;
}

export interface ProductListResult {
  products: Product[];
  pagination?: ApiPagination;
}

function buildProductQuery(query: ProductQuery): string {
  const params = new URLSearchParams();

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.subcategory) {
    params.set("subcategory", query.subcategory);
  }

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  if (query.taxonomy?.department) {
    params.set("taxonomy.department", query.taxonomy.department);
  }

  if (query.taxonomy?.category) {
    params.set("taxonomy.category", query.taxonomy.category);
  }

  if (query.taxonomy?.subcategory) {
    params.set("taxonomy.subcategory", query.taxonomy.subcategory);
  }

  if (query.taxonomy?.productType) {
    params.set("taxonomy.productType", query.taxonomy.productType);
  }

  if (query.taxonomy?.productSubtype) {
    params.set("taxonomy.productSubtype", query.taxonomy.productSubtype);
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase();
}

function getFilteredDevProducts(query: ProductQuery): Product[] {
  const products = getDevProducts();

  return products.filter((product) => {
    /*
     * Category
     */
    if (
      query.category &&
      normalize(product.category) !== normalize(query.category)
    ) {
      return false;
    }

    /*
     * Subcategory
     */
    if (
      query.subcategory &&
      normalize(product.subcategory) !== normalize(query.subcategory)
    ) {
      return false;
    }

    /*
     * Search
     */
    if (query.search) {
      const search = query.search.trim().toLowerCase();

      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.subcategory,
        ...(product.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(search)) {
        return false;
      }
    }

    const taxonomy = product.base.taxonomy;

    /*
     * Department
     */
    if (
      query.taxonomy?.department &&
      normalize(taxonomy?.department) !== normalize(query.taxonomy.department)
    ) {
      return false;
    }

    /*
     * Taxonomy category
     */
    if (
      query.taxonomy?.category &&
      normalize(taxonomy?.category) !== normalize(query.taxonomy.category)
    ) {
      return false;
    }

    /*
     * Taxonomy subcategory
     */
    if (
      query.taxonomy?.subcategory &&
      normalize(taxonomy?.subcategory) !== normalize(query.taxonomy.subcategory)
    ) {
      return false;
    }

    /*
     * Product type
     */
    if (
      query.taxonomy?.productType &&
      normalize(taxonomy?.productType) !== normalize(query.taxonomy.productType)
    ) {
      return false;
    }

    /*
     * Product subtype
     */
    if (
      query.taxonomy?.productSubtype &&
      normalize(taxonomy?.productSubtype) !==
        normalize(query.taxonomy.productSubtype)
    ) {
      return false;
    }

    return true;
  });
}

function mergeProducts(
  apiProducts: Product[],
  devProducts: Product[],
): Product[] {
  const seenProductIds = new Set<string>();

  const seenSlugs = new Set<string>();

  const merged: Product[] = [];

  for (const product of [...apiProducts, ...devProducts]) {
    if (seenProductIds.has(product.productId) || seenSlugs.has(product.slug)) {
      continue;
    }

    seenProductIds.add(product.productId);

    seenSlugs.add(product.slug);

    merged.push(product);
  }

  return merged;
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResult> {
  const queryString = buildProductQuery(query);

  const response = await apiFetch<ApiResponse<ProductListResponse>>(
    `/products${queryString}`,
    {
      next: {
        revalidate: 300,
        tags: ["products"],
      },
    },
  );

  if (response.status !== "SUCCESS" || !response.data) {
    throw new Error("Products API returned an invalid response.");
  }

  const apiProducts = response.data.products
    .filter(
      (product) =>
        product.state === "PUBLISHED" || product.state === "OUT_OF_STOCK",
    )
    .map(adaptProduct);

  /*
   * Local development-only products.
   *
   * getDevProducts() returns [] outside
   * NODE_ENV === "development".
   */
  const devProducts = getFilteredDevProducts(query);

  const products = mergeProducts(apiProducts, devProducts);

  return {
    products,
    pagination: response.meta.pagination,
  };
}

export async function getProductById(
  productId: string,
): Promise<Product | null> {
  /*
   * Check local development products first.
   */
  const devProduct = getDevProducts().find(
    (product) => product.productId === productId,
  );

  if (devProduct) {
    return devProduct;
  }

  try {
    const response = await apiFetch<
      ApiResponse<{
        product: ApiProduct;
      }>
    >(`/products/${encodeURIComponent(productId)}`, {
      next: {
        revalidate: 300,
        tags: [`product:${productId}`],
      },
    });

    if (response.status !== "SUCCESS" || !response.data?.product) {
      return null;
    }

    const product = response.data.product;

    if (product.state === "DRAFT") {
      return null;
    }

    return adaptProduct(product);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  /*
   * Check development products first so
   * dummy Men PDPs work locally as well.
   */
  const devProduct = getDevProducts().find((product) => product.slug === slug);

  if (devProduct) {
    return devProduct;
  }

  const { products } = await getProducts();

  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCategoryShowcaseProducts(
  productType: string,
): Promise<Product[]> {
  /*
   * Reuse getProducts instead of calling
   * the API separately.
   *
   * This means the development Men products
   * automatically participate in the category
   * showcase as well.
   */
  const { products } = await getProducts({
    taxonomy: {
      productType,
    },
    limit: 8,
  });

  return products.filter((product) => product.images.length > 0);
}
