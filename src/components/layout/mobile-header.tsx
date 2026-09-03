"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";

import { mainNavigation } from "@/lib/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { selectIsAuthenticated } from "@/store/selectors/auth-selectors";
import { selectCartTotalQuantity } from "@/store/selectors/cart-selectors";

import { openAuth, openCart, openSearch } from "@/store/slices/ui-slice";

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cartQuantity = useAppSelector(selectCartTotalQuantity);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      {/* Mobile Header */}
      <div
        className="
          grid
          h-16
          grid-cols-[1fr_auto_1fr]
          items-center
          lg:hidden
        "
      >
        {/* Menu */}
        <div className="flex justify-start">
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(true)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-start
              text-[var(--foreground)]
            "
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <Link
          href="/"
          aria-label="Purple You home"
          className="
            whitespace-nowrap
            text-sm
            font-medium
            tracking-[0.16em]
          "
        >
          PURPLE YOU
        </Link>

        {/* Search + Bag + Account */}
        <div
          className="
            flex
            items-center
            justify-end
            gap-0.5
          "
        >
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => dispatch(openSearch())}
            className="
              flex
              h-10
              w-9
              items-center
              justify-center
              transition-opacity
              hover:opacity-60
            "
          >
            <SearchIcon className="h-[19px] w-[19px]" />
          </button>
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="
    flex
    h-10
    w-9
    items-center
    justify-center
    transition-opacity
    hover:opacity-60
  "
          >
            <HeartIcon className="h-[19px] w-[19px]" />
          </Link>

          {/* Bag */}
          <button
            type="button"
            aria-label={`Shopping bag with ${cartQuantity} items`}
            onClick={() => dispatch(openCart())}
            className="
              relative
              flex
              h-10
              w-9
              items-center
              justify-center
              transition-opacity
              hover:opacity-60
            "
          >
            <BagIcon className="h-5 w-5" />

            {cartQuantity > 0 && (
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
                {cartQuantity > 99 ? "99+" : cartQuantity}
              </span>
            )}
          </button>

          {/* Account */}
          {isAuthenticated ? (
            <Link
              href="/account"
              aria-label="My account"
              className="
                flex
                h-10
                w-9
                items-center
                justify-center
                transition-opacity
                hover:opacity-60
              "
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Sign in"
              onClick={() => dispatch(openAuth())}
              className="
                flex
                h-10
                w-9
                items-center
                justify-center
                transition-opacity
                hover:opacity-60
              "
            >
              <UserIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Full Screen Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="
            fixed
            inset-0
            z-[100]
            bg-[var(--background)]
            lg:hidden
          "
        >
          <div
            className="
              site-container
              flex
              h-full
              flex-col
            "
          >
            {/* Menu Header */}
            <div
              className="
                grid
                h-16
                shrink-0
                grid-cols-[1fr_auto_1fr]
                items-center
                border-b
                border-[var(--border)]
              "
            >
              <div>
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeMenu}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-start
                  "
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              <Link
                href="/"
                onClick={closeMenu}
                className="
                  whitespace-nowrap
                  text-lg
                  font-medium
                  tracking-[0.18em]
                "
              >
                PURPLE YOU
              </Link>

              <div />
            </div>

            {/* Main Navigation */}
            <nav
              aria-label="Mobile navigation"
              className="
                flex-1
                overflow-y-auto
                py-6
              "
            >
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="
                      flex
                      min-h-14
                      items-center
                      border-b
                      border-[var(--border)]
                      text-lg
                      font-medium
                      transition-colors
                      hover:text-[var(--brand)]
                    "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div
              className="
                shrink-0
                border-t
                border-[var(--border)]
                py-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3
                    border
                    border-[var(--border)]
                    px-4
                    py-3
                    text-sm
                    transition-colors
                    hover:border-[var(--foreground)]
                  "
                >
                  <HeartIcon className="h-5 w-5" />
                  Wishlist
                </Link>

                {/* Account / Sign In */}
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      gap-3
                      border
                      border-[var(--border)]
                      px-4
                      py-3
                      text-sm
                      transition-colors
                      hover:border-[var(--foreground)]
                    "
                  >
                    <UserIcon className="h-5 w-5" />
                    Account
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();

                      dispatch(openAuth());
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      border
                      border-[var(--border)]
                      px-4
                      py-3
                      text-left
                      text-sm
                      transition-colors
                      hover:border-[var(--foreground)]
                    "
                  >
                    <UserIcon className="h-5 w-5" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
