"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  getDepartmentCollectionHref,
  normalizeDepartment,
} from "@/lib/departments";

const shopLinks = [
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

export function FooterShopLinks() {
  const searchParams = useSearchParams();

  const department = normalizeDepartment(searchParams.get("department"));

  return (
    <>
      {shopLinks.map((link) => (
        <Link
          key={link.collection}
          href={getDepartmentCollectionHref(department, link.collection)}
          className="
            text-sm
            transition-opacity
            hover:opacity-55
          "
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
