"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const categoryLinks = [
  {
    label: "Women",
    href: "/?department=women",
  },
  {
    label: "Men",
    href: "/?department=men",
  },
  {
    label: "All Products",
    href: "/collections/all",
  },
  {
    label: "Bracelets",
    href: "/collections/bracelets",
  },
  {
    label: "Earrings",
    href: "/collections/earrings",
  },
  {
    label: "Necklaces",
    href: "/collections/necklaces",
  },
  {
    label: "Rings",
    href: "/collections/rings",
  },
  {
    label: "About",
    href: "/about",
    preserveDepartment: false,
  },
];

const shopMenuLinks = [
  {
    label: "Shop All Jewelry",
    href: "/collections/all",
  },
  {
    label: "Rings",
    href: "/collections/rings",
  },
  {
    label: "Necklaces",
    href: "/collections/necklaces",
  },
  {
    label: "Earrings",
    href: "/collections/earrings",
  },
  {
    label: "Bracelets",
    href: "/collections/bracelets",
  },
  {
    label: "All Jewelry",
    href: "/collections/all",
  },
];

export function CategoryNavigation() {
  const searchParams = useSearchParams();

  const [shopOpen, setShopOpen] = useState(false);

  const department =
    searchParams.get("department")?.toLowerCase() === "men" ? "men" : "women";

  function getHref(href: string, preserveDepartment = true) {
    if (href.includes("department=")) {
      return href;
    }

    if (!preserveDepartment) {
      return href;
    }

    return `${href}?department=${department}`;
  }

  return (
    <div
      className="
        relative
        w-full
        border-y
        border-white/10
        bg-[#090909]
        text-white
        lg:hidden
      "
    >
      <nav
        aria-label="Product categories"
        className="
          flex
          h-[58px]
          items-center
          gap-8
          overflow-x-auto
          scroll-smooth
          px-5
          pr-16

          snap-x
          snap-mandatory

          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <button
          type="button"
          aria-expanded={shopOpen}
          aria-label="Toggle shop menu"
          onClick={() => setShopOpen((current) => !current)}
          className={`
            flex
            shrink-0
            snap-start
            items-center
            gap-1.5
            whitespace-nowrap

            text-[11px]
            font-medium
            uppercase
            tracking-[0.22em]

            transition-colors
            active:opacity-50

            ${shopOpen ? "text-[#a96ad8]" : "text-white/90"}
          `}
        >
          Shop
          <span
            aria-hidden="true"
            className={`
              inline-block
              h-[7px]
              w-[7px]
              shrink-0
              rotate-45
              border-b-[1.5px]
              border-r-[1.5px]
              transition-all
              duration-300
              ${shopOpen ? "rotate-[225deg] border-[#a96ad8]" : "border-white/60"}
            `}
          />
        </button>

        {categoryLinks.map((item) => {
          const active =
            (item.href.includes("department=women") && department === "women") ||
            (item.href.includes("department=men") && department === "men");

          return (
            <Link
              key={item.href}
              href={getHref(item.href, item.preserveDepartment)}
              aria-current={active ? "page" : undefined}
              className={`
                shrink-0
                snap-start
                whitespace-nowrap

                text-[11px]
                font-medium
                uppercase
                tracking-[0.22em]

                transition-colors
                active:opacity-50

                ${active ? "text-[#a96ad8]" : "text-white/90"}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Shop dropdown (mobile equivalent of desktop hover mega-menu) */}
      <div
        className={`
          absolute
          inset-x-0
          top-full
          z-40
          grid
          transition-all
          duration-300
          ease-in-out
          ${shopOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden" inert={!shopOpen}>
          <div
            className="
              border-b
              border-white/10
              bg-[#090909]
              px-5
              pb-6
              pt-4
            "
          >
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-white/40
            "
          >
            By Category
          </p>

          <nav aria-label="Shop menu" className="mt-2">
            {shopMenuLinks.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={getHref(item.href)}
                onClick={() => setShopOpen(false)}
                className="
                  flex
                  min-h-[48px]
                  items-center
                  justify-between
                  border-b
                  border-white/10
                  py-2
                  text-[13px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-white/90
                  active:opacity-50
                "
              >
                {item.label}
                <span aria-hidden="true" className="text-white/35">
                  →
                </span>
              </Link>
            ))}
          </nav>
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-0
          top-0

          flex
          h-full
          w-14
          items-center
          justify-end

          bg-gradient-to-l
          from-[#090909]
          via-[#090909]/90
          to-transparent

          pr-3
        "
      >
        <span
          className="
            text-lg
            font-light
            text-white/60
          "
        >
          →
        </span>
      </div>
    </div>
  );
}
