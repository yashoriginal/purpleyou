export interface OrderItemPayload {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface CreateOrderPayload {
  userId: string;
  shopId: string;
  status: string;
  items: OrderItemPayload[];
  orderDetails: {
    totalQuantity: number;
    totalPrice: number;
    paymentMethod: string;
  };
  deliveryDetails: {
    deliveryDate: string;
    deliveryAddress: string;
    phoneNumber?: string;
  };
  pickupDetails?: {
    pickupDate?: string;
    pickupLocation?: string;
  };
}

export interface RazorpayOrderData {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  shopId?: string;
  status: string;
  razorpayOrder: RazorpayOrderData;
}

export interface VerifyPaymentPayload {
  orderId: string;
  userId: string;
  shopId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
  currency: string;
  payment_method?: string;
}
