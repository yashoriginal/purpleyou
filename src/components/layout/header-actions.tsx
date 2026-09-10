"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import {
  BagIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";

import { normalizeDepartment } from "@/lib/departments";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { selectIsAuthenticated } from "@/store/selectors/auth-selectors";
import { selectCartTotalQuantity } from "@/store/selectors/cart-selectors";

import { openAuth, openCart, openSearch } from "@/store/slices/ui-slice";

/* =========================================================
   HYDRATION
========================================================= */

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,

    // Browser after hydration
    () => true,

    // Server + first browser hydration render
    () => false,
  );
}

/* =========================================================
   HEADER ACTIONS
========================================================= */

export function HeaderActions() {
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();

  const hasHydratedClient = useHasHydratedClient();

  /* =======================================================
     REDUX
  ======================================================= */

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cartQuantity = useAppSelector(selectCartTotalQuantity);

  /*
   * Auth/cart can be restored from browser persistence.
   *
   * The server cannot see that persisted state, so the
   * server and first browser render must use the same
   * predictable values.
   */

  const displayedIsAuthenticated = hasHydratedClient ? isAuthenticated : false;

  const displayedCartQuantity = hasHydratedClient ? cartQuantity : 0;

  /* =======================================================
     DEPARTMENT
  ======================================================= */

  const department = normalizeDepartment(searchParams.get("department"));

  const wishlistHref = `/wishlist?department=${department}`;

  return (
    <div
      className="
        flex
        items-center
        justify-end
        gap-1
      "
    >
      {/* ===================================================
          SEARCH
      =================================================== */}

      <button
        type="button"
        aria-label="Search"
        onClick={() => dispatch(openSearch())}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          transition-opacity

          hover:opacity-60
        "
      >
        <SearchIcon
          className="
            h-5
            w-5
          "
        />
      </button>

      {/* ===================================================
          ACCOUNT
      =================================================== */}

      {displayedIsAuthenticated ? (
        <Link
          href="/account"
          aria-label="My account"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            transition-opacity

            hover:opacity-60
          "
        >
          <UserIcon
            className="
              h-6
              w-6
            "
          />
        </Link>
      ) : (
        <button
          type="button"
          aria-label="Sign in"
          onClick={() => dispatch(openAuth())}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            transition-opacity

            hover:opacity-60
          "
        >
          <UserIcon
            className="
              h-6
              w-6
            "
          />
        </button>
      )}

      {/* ===================================================
          WISHLIST
      =================================================== */}

      <Link
        href={wishlistHref}
        aria-label="Wishlist"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          transition-opacity

          hover:opacity-60
        "
      >
        <HeartIcon
          className="
            h-5
            w-5
          "
        />
      </Link>

      {/* ===================================================
          BAG
      =================================================== */}

      <button
        type="button"
        aria-label={`Shopping bag with ${displayedCartQuantity} items`}
        onClick={() => dispatch(openCart())}
        className="
          relative

          flex
          h-10
          w-10
          items-center
          justify-center

          transition-opacity

          hover:opacity-60
        "
      >
        <BagIcon
          className="
            h-5
            w-5
          "
        />

        {displayedCartQuantity > 0 && (
          <span
            className="
              absolute
              right-0
              top-0

              flex
              h-4
              min-w-4
              items-center
              justify-center

              rounded-full
              bg-[var(--brand)]

              px-1

              text-[9px]
              font-semibold
              leading-none
              text-white
            "
          >
            {displayedCartQuantity > 99 ? "99+" : displayedCartQuantity}
          </span>
        )}
      </button>
    </div>
  );
}
