"use client";

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineMenu,
  HiOutlineUser,
} from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface HeaderProps {
  categories?: string[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const { itemCount } = useWishlist();

  // Build nav links dynamically from categories
  const navLinks = [
    { label: "Shop", href: "/collections/all" },
    ...categories.map((cat) => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      href: `/collections/${cat}`,
    })),
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Top announcement bar */}
      <div className="w-full bg-[#f5f2f0] border-b border-[#e6dcd4] text-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-center px-4 py-2.5">
          <span className="text-[#5f6a66] tracking-wider">
            Real jewelry for real life • Guaranteed for life
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="w-full bg-white border-b border-[#f5f2f0]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4">
          {/* LEFT: mobile menu + search, desktop logo */}
          <div className="flex items-center gap-4">
            {/* mobile only - placeholder for menu button since this is client component issues */}
            <button
              className="inline-flex sm:hidden text-[#111111]"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>
            <button
              className="inline-flex sm:hidden text-[#111111]"
              aria-label="Search"
            >
              <HiOutlineSearch className="h-5 w-5" />
            </button>

            {/* desktop logo on left */}
            <Link href="/" className="hidden sm:block">
              <span className="inline-block text-2xl font-light tracking-[0.15em] text-[#5540b7]">
                PURPLE YOU
              </span>
            </Link>
          </div>

          {/* CENTER: mobile logo, desktop nav */}
          <div className="flex-1 flex justify-center sm:justify-start sm:ml-8">
            {/* mobile logo in center */}
            <Link href="/" className="sm:hidden">
              <span className="inline-block text-xl font-light tracking-[0.15em] text-[#5540b7]">
                PURPLE YOU
              </span>
            </Link>

            {/* desktop nav */}
            <nav className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-[0.18em]">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#111111] hover:text-[#5540b7] transition-colors font-normal"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: icons */}
          <div className="flex items-center justify-end gap-4 flex-1">
            {/* desktop search icon */}
            <button
              aria-label="Search"
              className="hidden sm:inline-flex text-[#111111]"
            >
              <HiOutlineSearch className="h-5 w-5" />
            </button>
            <Link href="/account">
              <button
                aria-label="Account"
                className="text-[#111111] hover:text-[#5540b7] transition-colors"
              >
                <HiOutlineUser className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/wishlist">
              <button
                aria-label="Wishlist"
                className="relative flex items-center justify-center text-[#111111] hover:text-[#5540b7] transition-colors"
              >
                <HiOutlineHeart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#5540b7] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </Link>
            <Link href="/cart">
              <button
                aria-label="Cart"
                className="relative flex items-center justify-center text-[#111111] hover:text-[#5540b7] transition-colors"
              >
                <HiOutlineShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#5540b7] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* mobile dropdown menu */}
        {open && (
          <nav className="sm:hidden border-t border-[#f5f2f0] bg-white">
            <div className="flex flex-col px-4 py-3 text-xs uppercase tracking-[0.18em]">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 border-b border-[#f5f2f0] last:border-b-0 text-[#111111]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/account"
                className="py-3 border-b border-[#f5f2f0] text-[#111111]"
              >
                Account
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
