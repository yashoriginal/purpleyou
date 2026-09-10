"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  getDepartmentCollectionHref,
  normalizeDepartment,
} from "@/lib/departments";

import { ShopMegaMenu } from "@/components/layout/shop-mega-menu";

interface MenuState {
  open: boolean;
  pathname: string;
}

export function DesktopShopMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const department = normalizeDepartment(searchParams.get("department"));

  const shopHref = getDepartmentCollectionHref(department, "all");

  const [menuState, setMenuState] = useState<MenuState>({
    open: false,
    pathname,
  });

  /*
   * If navigation changes while the menu is open,
   * treat the menu as closed automatically.
   *
   * This avoids calling setState from an effect.
   */
  const open = menuState.open && menuState.pathname === pathname;

  function openMenu() {
    setMenuState({
      open: true,
      pathname,
    });
  }

  function closeMenu() {
    setMenuState({
      open: false,
      pathname,
    });
  }

  return (
    <div
      className="
        static
        flex
        h-full
        items-center
      "
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocusCapture={openMenu}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;

        if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
          closeMenu();
        }
      }}
    >
      <Link
        href={shopHref}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={closeMenu}
        className="
          relative
          flex
          h-full
          items-center
          gap-2
          text-xs
          font-medium
          uppercase
          tracking-[0.14em]
          transition-colors
          duration-200
        "
      >
        <span
          className={
            open ? "text-[#a96ad8]" : "transition-colors hover:text-[#a96ad8]"
          }
        >
          Shop
        </span>

        <span
          aria-hidden="true"
          className={`
            mt-[-3px]
            inline-block
            h-[7px]
            w-[7px]
            rotate-45
            border-b
            border-r
            border-current
            transition-transform
            duration-200

            ${open ? "rotate-[225deg] text-[#a96ad8]" : ""}
          `}
        />

        <span
          aria-hidden="true"
          className={`
            absolute
            bottom-0
            left-0
            h-px
            bg-[#a96ad8]
            transition-[width]
            duration-200

            ${open ? "w-full" : "w-0"}
          `}
        />
      </Link>

      <ShopMegaMenu
        open={open}
        department={department}
        onNavigate={closeMenu}
      />
    </div>
  );
}
