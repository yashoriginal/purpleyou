"use client";

import Link from "next/link";

import {
  BagIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { selectCartTotalQuantity } from "@/store/selectors/cart-selectors";

import { openAuth, openCart, openSearch } from "@/store/slices/ui-slice";

import { selectIsAuthenticated } from "@/store/selectors/auth-selectors";

export function HeaderActions() {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cartQuantity = useAppSelector(selectCartTotalQuantity);

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        aria-label="Search"
        onClick={() => dispatch(openSearch())}
        className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {isAuthenticated ? (
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
          <UserIcon className="h-6 w-6" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => dispatch(openAuth())}
          aria-label="Sign in"
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
          <UserIcon className="h-6 w-6" />
        </button>
      )}

      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
      >
        <HeartIcon className="h-5 w-5" />
      </Link>

      <button
        type="button"
        aria-label={`Shopping bag with ${cartQuantity} items`}
        onClick={() => dispatch(openCart())}
        className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
      >
        <BagIcon className="h-5 w-5" />

        {cartQuantity > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[9px] font-semibold leading-none text-white">
            {cartQuantity > 99 ? "99+" : cartQuantity}
          </span>
        )}
      </button>
    </div>
  );
}
