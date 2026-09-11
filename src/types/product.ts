export type ProductState = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK";

export type ProductCategory =
  | "JEWELS"
  | "DRESS"
  | "ACCESSORIES"
  | "BAGS"
  | "FOOTWEAR"
  | "BANGLE"
  | "NECKLACE"
  | "EARRINGS"
  | "RING"
  | "BRACELET";

export type VariantAttributes = Record<string, string>;

export interface ProductTaxonomy {
  department?: string;
  category?: string;
  subcategory?: string;
  productType?: string;
  productSubtype?: string;
}

export type ImageEntry = string | { url: string; alt?: string; isPrimary?: boolean };

export interface ProductBase {
  price: number;
  undiscountedPrice?: number;
  stock: number;
  images: ImageEntry[];
  attributes?: VariantAttributes;
  taxonomy?: ProductTaxonomy;
}

export interface VariantOverrides {
  price?: number;
  undiscountedPrice?: number;
  stock?: number;
  images?: string[];
  sku?: string;

  [key: string]: unknown;
}

export interface VariantResolved {
  price: number;
  undiscountedPrice?: number;
  stock: number;
  images?: string[];
  sku?: string;

  [key: string]: unknown;
}

export interface ProductVariant {
  variantId: string;
  attributes: VariantAttributes;

  // List API returns overrides.
  overrides?: VariantOverrides;

  // Product detail API returns resolved values.
  resolved?: VariantResolved;
}

export type VariantSchema = Record<string, string[]>;

export interface ApiProduct {
  productId: string;
  name: string;
  description: string;
  category: ProductCategory;
  subcategory?: string;

  state: ProductState;

  base: ProductBase;

  variantSchema?: VariantSchema;
  variants?: ProductVariant[];

  tags?: string[];
  highlights?: string[];

  currency?: string;
  brand?: string;
  shopId?: string;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Product model consumed by the PurpleYou V2 storefront.
 *
 * We preserve the backend data and only add fields that
 * belong to the frontend, such as slug and normalized images.
 */
export interface Product extends ApiProduct {
  slug: string;
  images: string[];
}
