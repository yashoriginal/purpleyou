export type Product = {
  id: number; // Numeric ID for internal use
  productId: string; // Original API product ID (UUID or string identifier)
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string;
  description: string;
  comparePrice?: number;
  hoverImage?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  materials?: string;
  careInstructions?: string;
  videoUrl?: string;
};
