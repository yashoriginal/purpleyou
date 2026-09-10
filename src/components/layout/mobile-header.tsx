"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";

import {
  DEFAULT_DEPARTMENT,
  getDepartmentCollectionHref,
  type Department,
} from "@/lib/departments";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { selectIsAuthenticated } from "@/store/selectors/auth-selectors";

import { selectCartTotalQuantity } from "@/store/selectors/cart-selectors";

import { openAuth, openCart, openSearch } from "@/store/slices/ui-slice";

/* =========================================================
   TYPES
========================================================= */

interface MenuItem {
  label: string;
  collection: string;
}

interface PreviewCard {
  title: string;
  collection: string;
  image: string;
}

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

    // Server + first client hydration render
    () => false,
  );
}

/* =========================================================
   MENU DATA
========================================================= */

const menuItems: MenuItem[] = [
  {
    label: "Shop All",
    collection: "all",
  },
  {
    label: "Rings",
    collection: "rings",
  },
  {
    label: "Necklaces",
    collection: "necklaces",
  },
  {
    label: "Bracelets",
    collection: "bracelets",
  },
  {
    label: "Earrings",
    collection: "earrings",
  },
];

const womenPreviewCards: PreviewCard[] = [
  {
    title: "Rings",
    collection: "rings",
    image: "/images/mega-menu/new-arrivals.jpeg",
  },
  {
    title: "Necklaces",
    collection: "necklaces",
    image: "/images/mega-menu/best-sellers.jpeg",
  },
];

const menPreviewCards: PreviewCard[] = [
  {
    title: "Rings",
    collection: "rings",
    image: "/ring-1.jpg",
  },
  {
    title: "Necklaces",
    collection: "necklaces",
    image: "/necklace-1.jpg",
  },
];

/* =========================================================
   MOBILE HEADER
========================================================= */

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const hasHydratedClient = useHasHydratedClient();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  /* =======================================================
     DEPARTMENT
  ======================================================= */

  const routeDepartment: Department =
    searchParams.get("department")?.toLowerCase() === "men"
      ? "men"
      : DEFAULT_DEPARTMENT;

  const routeKey = `${pathname}?${searchParams.toString()}`;

  const [departmentState, setDepartmentState] = useState<{
    department: Department;
    routeKey: string;
  }>({
    department: routeDepartment,

    routeKey,
  });

  const department =
    departmentState.routeKey === routeKey
      ? departmentState.department
      : routeDepartment;

  function changeDepartment(nextDepartment: Department) {
    setDepartmentState({
      department: nextDepartment,

      routeKey,
    });
  }

  /* =======================================================
     REDUX
  ======================================================= */

  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cartQuantity = useAppSelector(selectCartTotalQuantity);

  /*
   * Redux authentication/cart state can be restored from
   * browser persistence before React hydrates this tree.
   *
   * The server cannot see that persisted state.
   *
   * Therefore both server and first browser render use
   * stable values:
   *
   * cart = 0
   * auth = false
   *
   * Immediately after hydration we display the real values.
   */

  const displayedCartQuantity = hasHydratedClient ? cartQuantity : 0;

  const displayedIsAuthenticated = hasHydratedClient ? isAuthenticated : false;

  /* =======================================================
     DRAWER EFFECTS
  ======================================================= */

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleAccount() {
    closeMenu();

    /*
     * Use the actual auth state for user interaction.
     *
     * displayedIsAuthenticated exists only to make
     * server/client rendering hydration-safe.
     */
    if (!isAuthenticated) {
      dispatch(openAuth());
    }
  }

  const activePreviewCards =
    department === "women" ? womenPreviewCards : menPreviewCards;

  return (
    <>
      {/* =====================================================
          NORMAL MOBILE HEADER
      ====================================================== */}

      <div className="lg:hidden">
        <div
          className="
            grid
            h-[62px]
            grid-cols-[1fr_auto_1fr]
            items-center
          "
        >
          {/* LEFT */}

          <div
            className="
              flex
              items-center
              justify-start
              gap-1
            "
          >
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={openMenu}
              className="
                flex
                h-11
                w-10
                items-center
                justify-start

                text-[var(--foreground)]

                transition-opacity
                active:opacity-50
              "
            >
              <MenuIcon
                className="
                  h-[22px]
                  w-[22px]
                "
              />
            </button>

            <button
              type="button"
              aria-label="Search"
              onClick={() => dispatch(openSearch())}
              className="
                flex
                h-11
                w-9
                items-center
                justify-center

                transition-opacity
                active:opacity-50
              "
            >
              <SearchIcon
                className="
                  h-[21px]
                  w-[21px]
                "
              />
            </button>
          </div>

          {/* LOGO */}

          <Link
            href={`/?department=${department}`}
            aria-label="Purple You home"
            className="
              whitespace-nowrap

              text-[14px]
              font-medium
              uppercase
              tracking-[0.2em]
            "
          >
            PURPLE YOU
          </Link>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-1
            "
          >
            <Link
              href={`/wishlist?department=${department}`}
              aria-label="Wishlist"
              className="
                flex
                h-11
                w-9
                items-center
                justify-center

                transition-opacity
                active:opacity-50
              "
            >
              <HeartIcon
                className="
                  h-[20px]
                  w-[20px]
                "
              />
            </Link>

            <button
              type="button"
              aria-label={`Shopping bag with ${displayedCartQuantity} items`}
              onClick={() => dispatch(openCart())}
              className="
                relative
                flex
                h-11
                w-10
                items-center
                justify-end

                transition-opacity
                active:opacity-50
              "
            >
              <BagIcon
                className="
                  h-[21px]
                  w-[21px]
                "
              />

              {displayedCartQuantity > 0 && (
                <CartBadge quantity={displayedCartQuantity} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE DRAWER

          Always mounted so opening and closing can animate.
      ====================================================== */}

      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`
          fixed
          inset-x-0
          bottom-0
          top-[42px]
          z-[100]

          bg-[#090909]
          text-[#f4f1ed]

          transform-gpu

          transition-[transform,opacity]
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          will-change-transform

          motion-reduce:transition-none

          lg:hidden

          ${
            menuOpen
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-full opacity-0"
          }
        `}
      >
        <div
          className="
            flex
            h-full
            min-h-0
            flex-col
          "
        >
          {/* =================================================
              DRAWER HEADER
          ================================================== */}

          <div
            className="
              site-container
              grid
              h-[64px]
              shrink-0
              grid-cols-[1fr_auto_1fr]
              items-center

              border-b
              border-white/10
            "
          >
            {/* ===============================================
                CLOSE + ACCOUNT
            =============================================== */}

            <div
              className="
                flex
                items-center
                justify-start
              "
            >
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  w-10
                  items-center
                  justify-start

                  transition-opacity
                  active:opacity-50
                "
              >
                <CloseIcon
                  className="
                    h-[22px]
                    w-[22px]
                  "
                />
              </button>

              {displayedIsAuthenticated ? (
                <Link
                  href="/account"
                  aria-label="My account"
                  onClick={closeMenu}
                  className="
                    flex
                    h-11
                    w-10
                    items-center
                    justify-center

                    transition-opacity
                    active:opacity-50
                  "
                >
                  <UserIcon
                    className="
                      h-[21px]
                      w-[21px]
                    "
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  aria-label="Sign in"
                  onClick={handleAccount}
                  className="
                    flex
                    h-11
                    w-10
                    items-center
                    justify-center

                    transition-opacity
                    active:opacity-50
                  "
                >
                  <UserIcon
                    className="
                      h-[21px]
                      w-[21px]
                    "
                  />
                </button>
              )}
            </div>

            {/* ===============================================
                DRAWER LOGO
            =============================================== */}

            <Link
              href={`/?department=${department}`}
              onClick={closeMenu}
              aria-label="Purple You home"
              className="
                whitespace-nowrap

                text-[14px]
                font-medium
                uppercase
                tracking-[0.2em]
              "
            >
              PURPLE YOU
            </Link>

            {/* ===============================================
                WISHLIST + CART
            =============================================== */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-1
              "
            >
              <Link
                href={`/wishlist?department=${department}`}
                aria-label="Wishlist"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  w-9
                  items-center
                  justify-center

                  transition-opacity
                  active:opacity-50
                "
              >
                <HeartIcon
                  className="
                    h-[20px]
                    w-[20px]
                  "
                />
              </Link>

              <button
                type="button"
                aria-label={`Shopping bag with ${displayedCartQuantity} items`}
                onClick={() => {
                  closeMenu();

                  dispatch(openCart());
                }}
                className="
                  relative
                  flex
                  h-11
                  w-10
                  items-center
                  justify-end

                  transition-opacity
                  active:opacity-50
                "
              >
                <BagIcon
                  className="
                    h-[21px]
                    w-[21px]
                  "
                />

                {displayedCartQuantity > 0 && (
                  <CartBadge quantity={displayedCartQuantity} />
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              WOMEN / MEN
          ================================================== */}

          <div
            className="
              site-container
              shrink-0

              border-b
              border-white/10
            "
          >
            <DepartmentTabs
              department={department}
              onChange={changeDepartment}
            />
          </div>

          {/* =================================================
              SCROLLABLE BODY
          ================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
            "
          >
            {/* ===============================================
                CATEGORY LINKS
            =============================================== */}

            <nav
              aria-label={`${department} shopping navigation`}
              className="
                site-container
                pt-3
              "
            >
              {menuItems.map((item) => (
                <Link
                  key={item.collection}
                  href={getDepartmentCollectionHref(
                    department,
                    item.collection,
                  )}
                  onClick={closeMenu}
                  className="
                      group
                      flex
                      min-h-[58px]
                      items-center
                      justify-between

                      border-b
                      border-white/10

                      py-3
                    "
                >
                  <span
                    className="
                        text-[15px]
                        font-medium
                        uppercase
                        tracking-[0.055em]
                        text-white/90
                      "
                  >
                    {item.label}
                  </span>

                  <span
                    aria-hidden="true"
                    className="
                        text-[17px]
                        text-white/35

                        transition-all
                        duration-200

                        group-active:translate-x-1
                        group-active:text-white
                      "
                  >
                    →
                  </span>
                </Link>
              ))}
            </nav>

            {/* =================================================
                IMAGE PREVIEWS
            ================================================== */}

            <div
              className="
                site-container
                pt-7
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  gap-[5px]
                "
              >
                {activePreviewCards.map((card) => (
                  <Link
                    key={card.collection}
                    href={getDepartmentCollectionHref(
                      department,
                      card.collection,
                    )}
                    onClick={closeMenu}
                    className="
                        group
                        min-w-0
                      "
                  >
                    <div
                      className="
                          relative
                          aspect-[4/5]
                          overflow-hidden
                          bg-[#111111]
                        "
                    >
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        sizes="50vw"
                        className="
                            object-cover

                            transition-transform
                            duration-500
                            ease-out

                            group-active:scale-[1.02]
                          "
                      />

                      <div
                        aria-hidden="true"
                        className="
                            absolute
                            inset-0

                            bg-gradient-to-t
                            from-black/35
                            via-transparent
                            to-transparent
                          "
                      />
                    </div>

                    <div
                      className="
                          pb-2
                          pt-3
                        "
                    >
                      <p
                        className="
                            text-[14px]
                            font-medium
                            uppercase
                            tracking-[0.04em]
                            text-white/90
                          "
                      >
                        {department === "women"
                          ? `Women's ${card.title}`
                          : `Men's ${card.title}`}
                      </p>

                      <p
                        className="
                            mt-1

                            text-[9px]
                            uppercase
                            tracking-[0.18em]
                            text-white/40
                          "
                      >
                        Discover
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* =================================================
                UTILITIES
            ================================================== */}

            <div
              className="
                site-container
                pb-10
                pt-8
              "
            >
              <div
                className="
                  grid
                  grid-cols-2

                  gap-x-6
                  gap-y-5

                  border-t
                  border-white/10

                  pt-7
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();

                    dispatch(openSearch());
                  }}
                  className="
                    flex
                    items-center
                    gap-3

                    text-left
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    text-white/55
                  "
                >
                  <SearchIcon
                    className="
                      h-4
                      w-4
                    "
                  />
                  Search
                </button>

                <Link
                  href={`/wishlist?department=${department}`}
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3

                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    text-white/55
                  "
                >
                  <HeartIcon
                    className="
                      h-4
                      w-4
                    "
                  />
                  Wishlist
                </Link>

                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    text-white/55
                  "
                >
                  About PurpleYou
                </Link>

                {displayedIsAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="
                      text-[11px]
                      uppercase
                      tracking-[0.14em]
                      text-white/55
                    "
                  >
                    My Account
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleAccount}
                    className="
                      text-left

                      text-[11px]
                      uppercase
                      tracking-[0.14em]
                      text-white/55
                    "
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   WOMEN / MEN TABS
========================================================= */

interface DepartmentTabsProps {
  department: Department;

  onChange: (department: Department) => void;
}

function DepartmentTabs({ department, onChange }: DepartmentTabsProps) {
  return (
    <div
      className="
        grid
        h-[68px]
        grid-cols-2
      "
    >
      {/* WOMEN */}

      <button
        type="button"
        aria-pressed={department === "women"}
        onClick={() => onChange("women")}
        className={`
          relative
          flex
          items-center
          justify-start

          text-[16px]
          font-medium
          uppercase
          tracking-[0.025em]

          transition-colors
          duration-300

          ${department === "women" ? "text-white" : "text-white/40"}
        `}
      >
        WOMEN&apos;S
        <span
          aria-hidden="true"
          className={`
            absolute
            bottom-0
            left-0

            h-[2px]
            bg-current

            transition-[width]
            duration-300

            ${department === "women" ? "w-[82px]" : "w-0"}
          `}
        />
      </button>

      {/* MEN */}

      <button
        type="button"
        aria-pressed={department === "men"}
        onClick={() => onChange("men")}
        className={`
          relative
          flex
          items-center
          justify-start
          pl-5

          text-[16px]
          font-medium
          uppercase
          tracking-[0.025em]

          transition-colors
          duration-300

          ${department === "men" ? "text-white" : "text-white/40"}
        `}
      >
        MEN&apos;S
        <span
          aria-hidden="true"
          className={`
            absolute
            bottom-0
            left-5

            h-[2px]
            bg-current

            transition-[width]
            duration-300

            ${department === "men" ? "w-[58px]" : "w-0"}
          `}
        />
      </button>
    </div>
  );
}

/* =========================================================
   CART BADGE
========================================================= */

interface CartBadgeProps {
  quantity: number;
}

function CartBadge({ quantity }: CartBadgeProps) {
  return (
    <span
      className="
        absolute
        right-[-4px]
        top-[4px]

        flex
        h-[17px]
        min-w-[17px]
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
      {quantity > 99 ? "99+" : quantity}
    </span>
  );
}
