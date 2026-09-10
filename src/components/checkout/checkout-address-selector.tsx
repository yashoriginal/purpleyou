"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  createUserAddress,
  getUserAddresses,
  type CreateCheckoutAddressInput,
} from "@/services/address.service";

import type { CheckoutAddress } from "@/types/address";

import { useAppDispatch } from "@/store/hooks";
import { openAuth } from "@/store/slices/ui-slice";

/* =========================================================
   TYPES
========================================================= */

interface CheckoutAddressSelectorProps {
  userId: string | null;

  selectedAddressId: string | null;

  onSelect: (address: CheckoutAddress | null) => void;
}

interface AddressState {
  userId: string;

  addresses: CheckoutAddress[];

  error: string | null;
}

/* =========================================================
   INITIAL FORM
========================================================= */

function createInitialForm(): CreateCheckoutAddressInput {
  return {
    label: "Home",

    fullName: "",

    email: "",

    phoneNumber: "",

    building: "",

    street: "",

    area: "",

    city: "",

    state: "",

    pincode: "",

    isDefault: false,
  };
}

/* =========================================================
   SELECTOR
========================================================= */

export function CheckoutAddressSelector({
  userId,
  selectedAddressId,
  onSelect,
}: CheckoutAddressSelectorProps) {
  const dispatch = useAppDispatch();

  const onSelectRef = useRef(onSelect);

  const [addressState, setAddressState] = useState<AddressState | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [form, setForm] =
    useState<CreateCheckoutAddressInput>(createInitialForm);

  const [saving, setSaving] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  /*
   * CheckoutContent passes an inline onSelect callback.
   *
   * Keep the latest callback in a ref so address loading only
   * depends on userId and does not refetch on every parent render.
   */
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  /* =======================================================
     LOAD ADDRESSES
  ======================================================= */

  useEffect(() => {
    /*
     * Clear any address selected for the previous auth state/user
     * before loading addresses for the current account.
     */
    onSelectRef.current(null);

    if (!userId) {
      return;
    }

    let cancelled = false;

    void getUserAddresses(userId)
      .then((loadedAddresses) => {
        if (cancelled) {
          return;
        }

        setAddressState({
          userId,

          addresses: loadedAddresses,

          error: null,
        });

        if (loadedAddresses.length === 0) {
          onSelectRef.current(null);

          return;
        }

        const defaultAddress = loadedAddresses.find(
          (address) => address.isDefault,
        );

        onSelectRef.current(defaultAddress ?? loadedAddresses[0]);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setAddressState({
          userId,

          addresses: [],

          error:
            error instanceof Error
              ? error.message
              : "Unable to load saved addresses.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* =======================================================
     LOGGED OUT
  ======================================================= */

  if (!userId) {
    return (
      <div
        className="
          border
          border-[var(--border)]
          bg-[var(--surface)]

          px-5
          py-7

          sm:px-6
        "
      >
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-[var(--muted-foreground)]
          "
        >
          Delivery Address
        </p>

        <h3
          className="
            mt-3
            text-lg
            font-medium
            tracking-[-0.02em]
          "
        >
          Sign in to use your saved addresses
        </h3>

        <p
          className="
            mt-2
            max-w-md
            text-xs
            leading-5
            text-[var(--muted-foreground)]
          "
        >
          Sign in to choose a saved delivery address or add a new one. You can
          still review your bag, shipping, and total before signing in.
        </p>

        <button
          type="button"
          onClick={() => dispatch(openAuth())}
          className="
            mt-5
            inline-flex
            min-h-11
            items-center
            justify-center

            bg-[var(--foreground)]

            px-6

            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-[var(--background)]

            transition-opacity

            hover:opacity-85
          "
        >
          Sign In
        </button>
      </div>
    );
  }

  /* =======================================================
     CURRENT USER STATE
  ======================================================= */

  const currentState = addressState?.userId === userId ? addressState : null;

  /* =======================================================
     LOADING
  ======================================================= */

  if (!currentState) {
    return <AddressLoading />;
  }

  /*
   * Copy the narrowed values into
   * stable local variables.
   *
   * From this point onward we do not
   * use currentState inside callbacks.
   */
  const addresses = currentState.addresses;

  const loadError = currentState.error;

  /* =======================================================
     API ERROR
  ======================================================= */

  if (loadError) {
    return (
      <div
        className="
          border
          border-[var(--border)]

          px-5
          py-6
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-[var(--muted-foreground)]
          "
        >
          Delivery Address
        </p>

        <p
          className="
            mt-3
            text-sm
            leading-6
          "
        >
          We couldn&apos;t load your saved addresses.
        </p>

        <p
          className="
            mt-2
            text-xs
            text-[var(--muted-foreground)]
          "
        >
          {loadError}
        </p>
      </div>
    );
  }

  /* =======================================================
     SAVE NEW ADDRESS
  ======================================================= */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId || saving) {
      return;
    }

    setFormError(null);

    const validationError = validateAddressForm(form);

    if (validationError) {
      setFormError(validationError);

      return;
    }

    setSaving(true);

    try {
      /*
       * If the customer currently has
       * zero addresses, make the first
       * saved address the default.
       */
      const isFirstAddress = addresses.length === 0;

      await createUserAddress(userId, {
        ...form,

        isDefault: isFirstAddress ? true : form.isDefault,
      });

      /*
       * The backend does not currently
       * return the created address object,
       * so reload the user's addresses.
       */
      const updatedAddresses = await getUserAddresses(userId);

      setAddressState({
        userId,

        addresses: updatedAddresses,

        error: null,
      });

      /*
       * Select the newly created address.
       *
       * For the first address, prefer the
       * default address returned by the
       * backend.
       *
       * Otherwise use the newest item
       * returned by the address list.
       */
      const defaultAddress = updatedAddresses.find(
        (address) => address.isDefault,
      );

      const lastAddress =
        updatedAddresses.length > 0
          ? updatedAddresses[updatedAddresses.length - 1]
          : null;

      const addressToSelect = isFirstAddress
        ? (defaultAddress ?? lastAddress)
        : lastAddress;

      onSelect(addressToSelect);

      setForm(createInitialForm());

      setFormError(null);

      setShowAddressForm(false);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to save address.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     OPEN FORM
  ======================================================= */

  function openAddressForm() {
    setFormError(null);

    setShowAddressForm(true);
  }

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  function closeAddressForm() {
    if (saving) {
      return;
    }

    setForm(createInitialForm());

    setFormError(null);

    setShowAddressForm(false);
  }

  return (
    <div>
      {/* ===================================================
          EXISTING ADDRESSES
      =================================================== */}

      {addresses.length > 0 ? (
        <>
          <div
            className="
              mb-4
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  text-[var(--muted-foreground)]
                "
              >
                Saved Addresses
              </p>

              <p
                className="
                  mt-1
                  text-sm
                "
              >
                Choose where you want your order delivered.
              </p>
            </div>

            <span
              className="
                shrink-0
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-[var(--muted-foreground)]
              "
            >
              {addresses.length} saved
            </span>
          </div>

          <div
            className="
              grid
              gap-3

              sm:grid-cols-2
            "
          >
            {addresses.map((address) => {
              const active = address.addressId === selectedAddressId;

              return (
                <button
                  key={address.addressId}
                  type="button"
                  onClick={() => onSelect(address)}
                  className={`
                      relative
                      min-h-[190px]
                      w-full

                      border
                      p-5

                      text-left

                      transition-colors
                      duration-200

                      ${
                        active
                          ? "border-[var(--foreground)] bg-[var(--surface)]"
                          : "border-[var(--border)] hover:border-[var(--foreground)]"
                      }
                    `}
                >
                  {/* Selection */}

                  <span
                    aria-hidden="true"
                    className={`
                        absolute
                        right-4
                        top-4

                        flex
                        h-4
                        w-4
                        items-center
                        justify-center

                        rounded-full
                        border

                        ${
                          active
                            ? "border-[var(--foreground)]"
                            : "border-[var(--muted-foreground)]"
                        }

                        after:h-2
                        after:w-2
                        after:rounded-full

                        ${
                          active
                            ? "after:bg-[var(--foreground)]"
                            : "after:bg-transparent"
                        }
                      `}
                  />

                  {/* Label */}

                  <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        pr-7
                      "
                  >
                    <p
                      className="
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.18em]
                        "
                    >
                      {address.label || "Address"}
                    </p>

                    {address.isDefault && (
                      <span
                        className="
                            border
                            border-[var(--border)]

                            px-2
                            py-1

                            text-[8px]
                            uppercase
                            tracking-[0.14em]
                            text-[var(--muted-foreground)]
                          "
                      >
                        Default
                      </span>
                    )}
                  </div>

                  <AddressDetails address={address} />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* =================================================
           NO ADDRESSES
        ================================================= */

        <div
          className="
            border
            border-[var(--border)]
            bg-[var(--surface)]

            px-5
            py-7

            text-center
          "
        >
          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.22em]
              text-[var(--muted-foreground)]
            "
          >
            No saved addresses
          </p>

          <h3
            className="
              mt-3
              text-lg
              font-medium
            "
          >
            Where should we deliver?
          </h3>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm

              text-xs
              leading-5
              text-[var(--muted-foreground)]
            "
          >
            Add a delivery address to continue with your order.
          </p>
        </div>
      )}

      {/* ===================================================
          ADD ADDRESS BUTTON
      =================================================== */}

      {!showAddressForm && (
        <button
          type="button"
          onClick={openAddressForm}
          className="
            mt-4
            inline-flex
            min-h-11
            items-center
            justify-center

            border
            border-[var(--foreground)]

            px-5

            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]

            transition-colors

            hover:bg-[var(--foreground)]
            hover:text-[var(--background)]
          "
        >
          + Add a new address
        </button>
      )}

      {/* ===================================================
          ADDRESS FORM
      =================================================== */}

      {showAddressForm && (
        <form
          onSubmit={handleSubmit}
          className="
            mt-6

            border
            border-[var(--foreground)]

            p-5

            sm:p-6
          "
        >
          {/* ===============================================
              FORM HEADER
          =============================================== */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-5

              border-b
              border-[var(--border)]
              pb-5
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.24em]
                  text-[var(--muted-foreground)]
                "
              >
                New Address
              </p>

              <h3
                className="
                  mt-1
                  text-xl
                  font-medium
                  tracking-[-0.02em]
                "
              >
                Delivery details
              </h3>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={closeAddressForm}
              className="
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[var(--muted-foreground)]

                disabled:opacity-40
              "
            >
              Cancel
            </button>
          </div>

          {/* ===============================================
              FIELDS
          =============================================== */}

          <div
            className="
              mt-6
              grid
              gap-5

              sm:grid-cols-2
            "
          >
            <AddressField
              label="Full Name"
              required
              value={form.fullName}
              autoComplete="name"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  fullName: value,
                }))
              }
            />

            <AddressField
              label="Phone Number"
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={form.phoneNumber}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  phoneNumber: value,
                }))
              }
            />

            <AddressField
              label="Email"
              type="email"
              autoComplete="email"
              value={form.email ?? ""}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  email: value,
                }))
              }
            />

            {/* Address type */}

            <div>
              <label
                htmlFor="checkout-address-type"
                className="
                  block
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[var(--muted-foreground)]
                "
              >
                Address Type
              </label>

              <select
                id="checkout-address-type"
                value={form.label ?? "Home"}
                disabled={saving}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    label: event.target.value,
                  }))
                }
                className="
                  mt-2
                  min-h-12
                  w-full

                  border
                  border-[var(--border)]

                  bg-[var(--background)]

                  px-3

                  text-sm

                  outline-none

                  transition-colors

                  focus:border-[var(--foreground)]

                  disabled:opacity-50
                "
              >
                <option value="Home">Home</option>

                <option value="Work">Work</option>

                <option value="Other">Other</option>
              </select>
            </div>

            <AddressField
              label="House / Flat / Building"
              required
              autoComplete="address-line1"
              value={form.building}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  building: value,
                }))
              }
            />

            <AddressField
              label="Street / Road"
              required
              autoComplete="address-line2"
              value={form.street}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  street: value,
                }))
              }
            />

            <AddressField
              label="Area / Locality"
              value={form.area ?? ""}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  area: value,
                }))
              }
            />

            <AddressField
              label="City"
              required
              autoComplete="address-level2"
              value={form.city}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  city: value,
                }))
              }
            />

            <AddressField
              label="State"
              required
              autoComplete="address-level1"
              value={form.state}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  state: value,
                }))
              }
            />

            <AddressField
              label="PIN Code"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              value={form.pincode}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,

                  pincode: value,
                }))
              }
            />
          </div>

          {/* ===============================================
              DEFAULT ADDRESS
          =============================================== */}

          {addresses.length > 0 && (
            <label
              className="
                mt-5
                flex
                cursor-pointer
                items-center
                gap-3

                text-xs
              "
            >
              <input
                type="checkbox"
                checked={form.isDefault ?? false}
                disabled={saving}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    isDefault: event.target.checked,
                  }))
                }
                className="
                  h-4
                  w-4
                  accent-black

                  disabled:opacity-50
                "
              />
              Make this my default delivery address
            </label>
          )}

          {/* ===============================================
              ERROR
          =============================================== */}

          {formError && (
            <div
              role="alert"
              className="
                mt-5

                border
                border-[var(--border)]

                bg-[var(--surface)]

                px-4
                py-3

                text-xs
                leading-5
              "
            >
              {formError}
            </div>
          )}

          {/* ===============================================
              SAVE
          =============================================== */}

          <button
            type="submit"
            disabled={saving}
            className="
              mt-6
              flex
              min-h-13
              w-full
              items-center
              justify-center

              bg-[var(--foreground)]

              px-6

              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--background)]

              transition-opacity

              hover:opacity-85

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {saving ? "Saving Address..." : "Save Address"}
          </button>
        </form>
      )}
    </div>
  );
}

/* =========================================================
   ADDRESS FIELD
========================================================= */

function AddressField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  required?: boolean;

  type?: string;

  inputMode?: "text" | "numeric" | "tel" | "email";

  autoComplete?: string;
}) {
  return (
    <label>
      <span
        className="
          block
          text-[9px]
          font-medium
          uppercase
          tracking-[0.18em]
          text-[var(--muted-foreground)]
        "
      >
        {label}

        {required && (
          <span aria-hidden="true" className="ml-1">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="
          mt-2
          min-h-12
          w-full

          border
          border-[var(--border)]

          bg-[var(--background)]

          px-3

          text-sm

          outline-none

          transition-colors

          focus:border-[var(--foreground)]
        "
      />
    </label>
  );
}

/* =========================================================
   ADDRESS DETAILS
========================================================= */

function AddressDetails({ address }: { address: CheckoutAddress }) {
  const name = address.fullName || address.name;

  const structuredAddress = [address.building, address.street]
    .filter(Boolean)
    .join(", ");

  const cityLine = [address.area, address.city, address.state]
    .filter(Boolean)
    .join(", ");

  const phone = address.phoneNumber || address.deliveryContactNumber;

  return (
    <div
      className="
        mt-5
        space-y-1
        pr-4

        text-xs
        leading-5
        text-[var(--muted-foreground)]
      "
    >
      {name && (
        <p
          className="
            font-medium
            text-[var(--foreground)]
          "
        >
          {name}
        </p>
      )}

      {structuredAddress ? (
        <p>{structuredAddress}</p>
      ) : (
        <p>{address.address}</p>
      )}

      {cityLine && <p>{cityLine}</p>}

      {address.pincode && <p>{address.pincode}</p>}

      {phone && <p className="pt-2">{phone}</p>}
    </div>
  );
}

/* =========================================================
   VALIDATION
========================================================= */

function validateAddressForm(form: CreateCheckoutAddressInput): string | null {
  if (!form.fullName.trim()) {
    return "Enter your full name.";
  }

  const phone = form.phoneNumber.replace(/\D/g, "");

  if (phone.length < 10) {
    return "Enter a valid phone number.";
  }

  if (
    form.email?.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    return "Enter a valid email address.";
  }

  if (!form.building.trim()) {
    return "Enter your house, flat, or building.";
  }

  if (!form.street.trim()) {
    return "Enter your street or road.";
  }

  if (!form.city.trim()) {
    return "Enter your city.";
  }

  if (!form.state.trim()) {
    return "Enter your state.";
  }

  const pincode = form.pincode.replace(/\D/g, "");

  if (pincode.length !== 6) {
    return "Enter a valid 6-digit PIN code.";
  }

  return null;
}

/* =========================================================
   LOADING
========================================================= */

function AddressLoading() {
  return (
    <div
      className="
        grid
        gap-3

        sm:grid-cols-2
      "
    >
      {[0, 1].map((item) => (
        <div
          key={item}
          className="
            min-h-[190px]
            animate-pulse

            border
            border-[var(--border)]

            bg-[var(--surface)]

            p-5
          "
        >
          <div
            className="
              h-3
              w-20
              bg-[var(--border)]
            "
          />

          <div
            className="
              mt-6
              h-3
              w-32
              bg-[var(--border)]
            "
          />

          <div
            className="
              mt-3
              h-3
              w-40
              bg-[var(--border)]
            "
          />

          <div
            className="
              mt-3
              h-3
              w-24
              bg-[var(--border)]
            "
          />
        </div>
      ))}
    </div>
  );
}
