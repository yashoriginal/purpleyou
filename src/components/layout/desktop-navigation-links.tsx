"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { normalizeDepartment } from "@/lib/departments";

import type { NavigationItem } from "@/lib/navigation";

interface DesktopNavigationLinksProps {
  items: NavigationItem[];
}

export function DesktopNavigationLinks({ items }: DesktopNavigationLinksProps) {
  const searchParams = useSearchParams();

  const department = normalizeDepartment(searchParams.get("department"));

  function getHref(item: NavigationItem) {
    /*
     * Department tabs and About are absolute hrefs.
     */
    if (item.href.includes("department=") || !item.href.startsWith("/collections/")) {
      return item.href;
    }

    return `${item.href}?department=${department}`;
  }

  function isActive(item: NavigationItem) {
    if (item.href.includes("department=women")) {
      return department === "women";
    }

    if (item.href.includes("department=men")) {
      return department === "men";
    }

    return false;
  }

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.label}
          href={getHref(item)}
          aria-current={isActive(item) ? "page" : undefined}
          className={`
            text-xs
            font-medium
            uppercase
            tracking-[0.14em]

            transition-colors
            duration-200

            hover:text-[#a96ad8]

            ${isActive(item) ? "text-[#a96ad8]" : ""}
          `}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
