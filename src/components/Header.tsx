// components/Header.tsx
"use client";

import { useState } from "react";
import { HiOutlineSearch, HiOutlineHeart, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Link from "next/link";

const mainNavLinks = [
  {
    label: "Shop",
    href: "/collections/all",
    submenu: [
      { label: "All Jewelry", href: "/collections/all" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "New Arrivals", href: "/collections/new" },
    ]
  },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Rings", href: "/collections/rings" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Bracelets", href: "/collections/bracelets" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top announcement bar */}
      <div className="w-full bg-[#D3C9FF] border-b border-[#e6e0da] text-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-center px-4 py-3">
          <span className="text-[#111111] tracking-wider font-medium">
            Most versatile accessories in town • Free shipping on orders above ₹3000
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="w-full bg-white border-b border-[#e6e0da]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4">
          {/* LEFT: mobile menu + logo */}
          <div className="flex items-center gap-4">
            {/* mobile menu button */}
            <button
              className="inline-flex sm:hidden text-[#111111]"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="bg-[#D3C9FF] px-3 py-1.5 rounded">
                <span className="text-lg font-bold text-[#111111] tracking-wider" style={{ fontFamily: "Tan Tangkiwood, sans-serif" }}>
                  PURPLE YOU
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-8 flex-1 ml-8">
            {mainNavLinks.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-[#111111] hover:text-[#5540b7] transition-colors uppercase tracking-wider"
                >
                  {item.label}
                </Link>
                {/* Mega menu for Shop */}
                {item.label === "Shop" && item.submenu && (
                  <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-[#e6e0da] shadow-lg py-4 px-6 w-48">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block py-2 text-xs text-[#6b6b6b] hover:text-[#5540b7] transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT: Icons */}
          <div className="flex items-center justify-end gap-4">
            {/* Search */}
            <button
              aria-label="Search"
              className="hidden sm:inline-flex text-[#111111] hover:text-[#5540b7]"
            >
              <HiOutlineSearch className="h-5 w-5" />
            </button>
            {/* Account */}
            <button aria-label="Account" className="hidden sm:inline text-xs font-medium text-[#111111] hover:text-[#5540b7] uppercase tracking-wider">
              Account
            </button>
            {/* Wishlist */}
            <button aria-label="Wishlist" className="text-[#111111] hover:text-[#5540b7]">
              <HiOutlineHeart className="h-5 w-5" />
            </button>
            {/* Cart */}
            <button
              aria-label="Cart"
              className="relative flex items-center justify-center text-[#111111] hover:text-[#5540b7]"
            >
              <HiOutlineShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-[#5540b7] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="sm:hidden border-t border-[#e6e0da] bg-white">
            <div className="flex flex-col px-4 py-4 text-sm">
              {mainNavLinks.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="py-3 text-[#111111] font-medium uppercase tracking-wider hover:text-[#5540b7] block border-b border-[#e6e0da] last:border-b-0"
                  >
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <div className="bg-[#f8f5f2] px-4 py-2">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block py-2 text-xs text-[#6b6b6b] hover:text-[#5540b7]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
