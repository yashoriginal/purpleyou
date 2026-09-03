import "server-only";

import { adaptProduct } from "@/adapters/product.adapter";
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

  const products = response.data.products
    .filter(
      (product) =>
        product.state === "PUBLISHED" || product.state === "OUT_OF_STOCK",
    )
    .map(adaptProduct);

  return {
    products,
    pagination: response.meta.pagination,
  };
}

export async function getProductById(
  productId: string,
): Promise<Product | null> {
  try {
    const response = await apiFetch<ApiResponse<{ product: ApiProduct }>>(
      `/products/${encodeURIComponent(productId)}`,
      {
        next: {
          revalidate: 300,
          tags: [`product:${productId}`],
        },
      },
    );

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
  const { products } = await getProducts();

  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCategoryShowcaseProducts(
  productType: string,
): Promise<Product[]> {
  const queryString = buildProductQuery({
    taxonomy: {
      productType,
    },
    limit: 8,
  });

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
    return [];
  }

  return response.data.products
    .map(adaptProduct)
    .filter((product) => product.images.length > 0);
}
