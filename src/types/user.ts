export interface UserAddress {
  addressId: string;

  name?: string;
  label?: string;

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

export interface User {
  userId?: string;

  userName: string;
  mobile: string;

  latitude: string;
  longitude: string;

  pincode: string;
  address: string;
  area: string;

  profilePicture?: string;

  isAdmin: boolean;
  isVerified: boolean;

  createdAt?: string;
  updatedAt?: string;

  contacts?: string[];
  addresses?: UserAddress[];
}
