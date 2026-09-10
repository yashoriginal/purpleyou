import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AuthDrawer } from "@/components/auth/auth-drawer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CategoryNavigation } from "@/components/layout/category-navigation";
import { DesktopNavigationLinks } from "@/components/layout/desktop-navigation-links";
import { DesktopShopMenu } from "@/components/layout/desktop-shop-menu";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileHeader } from "@/components/layout/mobile-header";
import { SearchDrawer } from "@/components/layout/search-drawer";
import { DepartmentHomeLink } from "@/components/layout/department-home-link";

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
          overflow-visible
          border-b
          border-[var(--border)]
          bg-[var(--background)]

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
              <DepartmentHomeLink
                ariaLabel="PurpleYou home"
                className="
    text-xl
    font-medium
    tracking-[0.2em]
  "
              >
                PURPLE YOU
              </DepartmentHomeLink>
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
              <DesktopShopMenu />

              <DesktopNavigationLinks items={desktopNavigation} />
            </nav>

            {/* Search / Wishlist / Account / Bag */}
            <HeaderActions />
          </div>
        </div>

        <CategoryNavigation />
      </header>

      <SearchDrawer />
      <CartDrawer />
      <AuthDrawer />
    </>
  );
}
