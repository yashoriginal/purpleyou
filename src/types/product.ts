export type ProductImage = {
  url: string;
  alt?: string;
  isPrimary?: boolean;
};

export type Product = {
  id: number; // Numeric ID for internal use
  productId?: string; // Original API product ID (UUID or string identifier)
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string;
  description: string;
  comparePrice?: number;
  hoverImage?: string;
  images?: ProductImage[]; // Array of all product images for gallery
  isBestseller?: boolean;
  isNew?: boolean;
  materials?: string;
  careInstructions?: string;
  videoUrl?: string;
  subcategory?: string;
  variants?: Array<{ name: string; options: string[] }>;
};
