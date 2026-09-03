import Link from "next/link";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AuthDrawer } from "@/components/auth/auth-drawer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileHeader } from "@/components/layout/mobile-header";
import { SearchDrawer } from "@/components/layout/search-drawer";
import { DesktopShopMenu } from "@/components/layout/desktop-shop-menu";

import { mainNavigation } from "@/lib/navigation";

export function Header() {
  const desktopNavigation = mainNavigation.filter(
    (item) => item.label.toLowerCase() !== "shop",
  );

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-[var(--border)]
          bg-[var(--background)]
          overflow-visible
          lg:relative
          lg:sticky
        "
      >
        <AnnouncementBar />

        <div className="site-container">
          <MobileHeader />

          <div
            className="
              hidden
              h-[76px]
              items-center
              lg:grid
              lg:grid-cols-[220px_1fr_220px]
            "
          >
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                aria-label="PurpleYou home"
                className="
                  text-xl
                  font-medium
                  tracking-[0.2em]
                "
              >
                PURPLE YOU
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav
              aria-label="Primary navigation"
              className="
                flex
                h-full
                items-center
                justify-center
                gap-7
                xl:gap-9
              "
            >
              {/* SHOP + mega menu */}
              <DesktopShopMenu />

              {/* Existing PurpleYou navigation */}
              {desktopNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    relative
                    py-2
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    transition-colors
                    duration-200

                    after:absolute
                    after:bottom-0
                    after:left-0
                    after:h-px
                    after:w-0
                    after:bg-[#a96ad8]
                    after:transition-[width]
                    after:duration-200

                    hover:text-[#a96ad8]
                    hover:after:w-full
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search / Wishlist / Account / Bag */}
            <HeaderActions />
          </div>
        </div>

        {/*
         * ShopMegaMenu is positioned absolutely relative
         * to this header because the group/shop wrapper
         * intentionally remains position: static.
         */}
      </header>

      <SearchDrawer />
      <CartDrawer />
      <AuthDrawer />
    </>
  );
}
