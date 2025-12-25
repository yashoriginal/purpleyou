// components/Header.tsx
"use client";

import { useState } from "react";
import { HiOutlineSearch, HiOutlineHeart, HiOutlineMenu } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const navLinks = [
  { label: "Shop", href: "/collections/all" },
  { label: "Tennis", href: "/collections/tennis" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Rings", href: "/collections/rings" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Bracelets", href: "/collections/bracelets" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar (same in desktop & mobile) */}
      <div className="w-full bg-[#6b1515] text-white text-xs">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2">
          <span className="uppercase tracking-wide">
            Final hours • 25% off! Use code: HOLIDAY
          </span>
          <span className="font-semibold tabular-nums">
            01 : 24 : 30
          </span>
        </div>
      </div>

      {/* Thin cream strip with message + currency */}
      <div className="w-full bg-[#f8f5f2] border-b border-[#e6e0da] text-xs">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-2">
          <span className="mx-auto text-center text-[#6b6b6b]">
            Biggest Ever Holiday Sale
          </span>
          <button className="hidden sm:inline text-[#6b6b6b]">
            US ▾
          </button>
        </div>
      </div>

      {/* Main white nav bar */}
      <div className="w-full bg-white border-b border-[#e6e0da]">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          {/* LEFT: mobile menu + search, desktop logo */}
          <div className="flex items-center gap-3">
            {/* mobile only */}
            <button
              className="inline-flex sm:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>
            <button
              className="inline-flex sm:hidden"
              aria-label="Search"
            >
              <HiOutlineSearch className="h-5 w-5" />
            </button>

            {/* desktop logo on left */}
            <div className="hidden sm:flex items-center">
              <span
                className="inline-block text-2xl font-semibold tracking-[0.25em]"
                style={{
                  fontFamily: "Tan Tangkiwood, Inter, system-ui, sans-serif",
                }}
              >
                PURPLE YOU
              </span>
            </div>
          </div>

          {/* CENTER: mobile logo, desktop nav */}
          <div className="flex-1 flex justify-center">
            {/* mobile logo in center */}
            <span
              className="sm:hidden inline-block text-2xl font-semibold tracking-[0.25em]"
              style={{
                fontFamily: "Tan Tangkiwood, Inter, system-ui, sans-serif",
              }}
            >
              PURPLE YOU
            </span>

            {/* desktop nav */}
            <nav className="hidden sm:flex items-center gap-8 text-xs uppercase tracking-[0.25em]">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[#111111] hover:text-[#5540b7] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* RIGHT: icons */}
          <div className="flex items-center justify-end gap-3 flex-1">
            {/* desktop search icon */}
            <button
              aria-label="Search"
              className="hidden sm:inline-flex"
            >
              <HiOutlineSearch className="h-5 w-5" />
            </button>
            <button aria-label="Account" className="hidden sm:inline text-xs uppercase tracking-[0.2em]">
              Account
            </button>
            <button aria-label="Wishlist">
              <HiOutlineHeart className="h-5 w-5" />
            </button>
            <button
              aria-label="Cart"
              className="relative flex items-center justify-center rounded-full bg-[#d3c9ff] h-8 w-8 text-xs font-semibold"
            >
              0
            </button>
          </div>
        </div>

        {/* mobile dropdown menu */}
        {open && (
          <nav className="sm:hidden border-t border-[#e6e0da] bg-white">
            <div className="flex flex-col px-4 py-2 text-sm uppercase tracking-[0.2em]">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 border-b border-[#e6e0da] last:border-b-0"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
