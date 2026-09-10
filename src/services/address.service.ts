import { clientApiFetch } from "@/services/client-api";

import type { CheckoutAddress } from "@/types/address";

interface AddressApiResponse<T> {
  statusCode: number;
  success: boolean;
  data: T;
  error: string | null;
}

export interface CreateCheckoutAddressInput {
  label?: string;

  fullName: string;

  email?: string;

  phoneNumber: string;

  building: string;

  street: string;

  area?: string;

  city: string;

  state: string;

  pincode: string;

  isDefault?: boolean;
}

/* =========================================================
   GET ADDRESSES
========================================================= */

export async function getUserAddresses(
  userId: string,
): Promise<CheckoutAddress[]> {
  if (!userId.trim()) {
    return [];
  }

  const response = await clientApiFetch<AddressApiResponse<CheckoutAddress[]>>(
    `/users/${encodeURIComponent(userId)}/addresses`,
  );

  if (!response.success) {
    throw new Error(response.error || "Unable to load saved addresses.");
  }

  return response.data ?? [];
}

/* =========================================================
   CREATE ADDRESS
========================================================= */

export async function createUserAddress(
  userId: string,
  input: CreateCheckoutAddressInput,
): Promise<void> {
  if (!userId.trim()) {
    throw new Error("User ID is required.");
  }

  const fullAddress = [
    input.building,
    input.street,
    input.area,
    input.city,
    input.state,
    input.pincode,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");

  const response = await clientApiFetch<AddressApiResponse<boolean>>(
    `/users/${encodeURIComponent(userId)}/addresses`,
    {
      method: "POST",

      body: JSON.stringify({
        /* Required by current backend */
        address: fullAddress,

        /* Legacy-compatible fields */
        name: input.fullName.trim(),

        area: input.area?.trim() || undefined,

        pincode: input.pincode.trim(),

        label: input.label?.trim() || "Home",

        deliveryContactNumber: input.phoneNumber.trim(),

        isDefault: input.isDefault ?? false,

        /* Complete address fields */
        fullName: input.fullName.trim(),

        email: input.email?.trim() || undefined,

        phoneNumber: input.phoneNumber.trim(),

        state: input.state.trim(),

        building: input.building.trim(),

        street: input.street.trim(),

        city: input.city.trim(),
      }),
    },
  );

  if (!response.success) {
    throw new Error(response.error || "Unable to save address.");
  }
}
