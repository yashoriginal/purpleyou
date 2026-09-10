import { adaptProduct } from "@/adapters/product.adapter";

import type { Department } from "@/lib/departments";

import { clientApiFetch } from "@/services/client-api";

import type { BackendResponse } from "@/types/auth";
import type { ApiProduct, Product } from "@/types/product";

/* =========================================================
   CART PRODUCT SUMMARY
========================================================= */

export interface CartProductSummary {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  department?: Department;
}

/* =========================================================
   BACKEND RESPONSE
========================================================= */

interface ProductByIdData {
  product: ApiProduct;
}

/* =========================================================
   LOCAL DEV RESPONSE
========================================================= */

interface DevProductResponse {
  product: Product | null;
}

/* =========================================================
   CACHE
========================================================= */

const productCache = new Map<string, Promise<CartProductSummary | null>>();

/* =========================================================
   LOAD PRODUCT
========================================================= */

async function fetchProductSummary(
  productId: string,
): Promise<CartProductSummary | null> {
  /*
   * -------------------------------------------------------
   * LOCAL DEVELOPMENT PRODUCTS
   * -------------------------------------------------------
   *
   * DEV-MEN-* products exist only locally.
   *
   * They must NOT be requested from the real backend.
   */
  if (process.env.NODE_ENV === "development" && productId.startsWith("DEV-")) {
    return fetchDevProductSummary(productId);
  }

  /*
   * -------------------------------------------------------
   * REAL BACKEND PRODUCT
   * -------------------------------------------------------
   */
  const response = await clientApiFetch<
    BackendResponse<ProductByIdData | null>
  >(`/products/${encodeURIComponent(productId)}`);

  const apiProduct = response.data?.product;

  if (!apiProduct) {
    return null;
  }

  /*
   * Draft products should never appear
   * in the customer storefront.
   */
  if (apiProduct.state === "DRAFT") {
    return null;
  }

  /*
   * Use the same adapter as the rest
   * of the storefront.
   *
   * This gives us:
   * - slug
   * - normalized images
   * - taxonomy
   */
  const product = adaptProduct(apiProduct);

  return createSummary(product);
}

/* =========================================================
   LOCAL DEV PRODUCT
========================================================= */

async function fetchDevProductSummary(
  productId: string,
): Promise<CartProductSummary | null> {
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

    const product = data.product;

    if (!product) {
      return null;
    }

    /*
     * DEV product images already point
     * directly to files inside /public.
     *
     * Example:
     * /ring-1.jpg
     * /bracelet-1.jpg
     *
     * Do NOT run them through the backend
     * image URL normalizer.
     */
    return {
      productId: product.productId,

      slug: product.slug,

      name: product.name,

      imageUrl:
        typeof product.images[0] === "string" ? product.images[0] : null,

      department: parseDepartment(product.base.taxonomy?.department),
    };
  } catch (error) {
    console.error("Unable to load local cart product:", error);

    return null;
  }
}

/* =========================================================
   CREATE SUMMARY
========================================================= */

function createSummary(product: Product): CartProductSummary {
  return {
    productId: product.productId,

    slug: product.slug,

    name: product.name,

    imageUrl: product.images[0] ?? null,

    department: parseDepartment(product.base.taxonomy?.department),
  };
}

/* =========================================================
   DEPARTMENT
========================================================= */

function parseDepartment(value?: string): Department | undefined {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "women" || normalized === "men") {
    return normalized;
  }

  return undefined;
}

/* =========================================================
   PUBLIC FUNCTION
========================================================= */

export function getCartProductSummary(
  productId: string,
): Promise<CartProductSummary | null> {
  const existing = productCache.get(productId);

  if (existing) {
    return existing;
  }

  const request = fetchProductSummary(productId).catch((error) => {
    /*
     * Never permanently cache
     * a failed request.
     */
    productCache.delete(productId);

    throw error;
  });

  productCache.set(productId, request);

  return request;
}
