export type Product = {
  id: number;
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
};
