export interface CheckoutAddress {
  addressId: string;

  label?: string;
  name?: string;

  address: string;
  area?: string;
  pincode?: string;

  latitude?: string;
  longitude?: string;

  deliveryContactNumber?: string;
  isDefault?: boolean;

  fullName?: string;
  email?: string;
  phoneNumber?: string;

  state?: string;
  building?: string;
  street?: string;
  city?: string;

  createdAt?: string;
  updatedAt?: string;
}
