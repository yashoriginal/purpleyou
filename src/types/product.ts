export type VariantAttribute = Record<string, string>;

export type VariantOverride = {
  stock?: number;
  price?: number;
  images?: string[];
  sku?: string;
};

export type VariantResolved = {
  price: number;
  stock: number;
  images?: string[];
  sku?: string;
};

export type Variant = {
  variantId: string;
  attributes: VariantAttribute;
  // For list API: overrides
  // For detail API: resolved
  overrides?: VariantOverride;
  resolved?: VariantResolved;
};

export type BaseDetails = {
  stock: number;
  price: number;
};

export type VariantSchema = Record<string, string[]>;

export type Product = {
  // Internal use
  id: number;
  slug: string;

  // API data
  productId: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  state?: string;

  // Base details (defaults)
  base: BaseDetails;

  // Variant information
  variantSchema?: VariantSchema; // Defines available variant options
  variants?: Variant[]; // Actual variant instances

  // Additional metadata
  tags?: string[];
  currency?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;

  // Legacy fields (for backward compatibility)
  image?: string;
  price?: number;
  comparePrice?: number;
  hoverImage?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  materials?: string;
  careInstructions?: string;
  videoUrl?: string;
};
