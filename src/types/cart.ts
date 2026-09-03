export interface CartItemVariant {
  color?: string;
  size?: string;
  material?: string;
}

export interface CartApiItem {
  productId: string;
  quantity: number;
  variant?: CartItemVariant;
  priceEach?: number;
  currency?: string;
}

export interface CartData {
  userId: string;
  items: CartApiItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}
