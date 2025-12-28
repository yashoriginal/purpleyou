'use client';

import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f8f5f2] border-t border-[#e6e0da]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base font-bold text-[#111111] tracking-wider mb-4" style={{ fontFamily: "Tan Tangkiwood, sans-serif" }}>
              PURPLE YOU
            </h3>
            <p className="text-xs text-[#6b6b6b] font-light leading-relaxed mb-4">
              Premium jewelry for every moment. Crafted with care. Made in India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#111111] hover:text-[#5540b7] transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li>
                <Link href="/collections/rings" className="hover:text-[#111111] transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/collections/necklaces" className="hover:text-[#111111] transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/collections/bracelets" className="hover:text-[#111111] transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/collections/best-sellers" className="hover:text-[#111111] transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  Care Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-4">
              Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#111111] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#111111] transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="my-12 py-8 border-t border-b border-[#e6e0da]">
          <h4 className="text-sm font-semibold text-[#111111] uppercase tracking-wider mb-4">
            Subscribe to PURPLE YOU
          </h4>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-white border border-[#e6e0da] text-[#111111] placeholder-[#6b6b6b] text-sm focus:outline-none focus:ring-2 focus:ring-[#5540b7]"
              required
            />
            <button
              type="submit"
              className="bg-[#5540b7] text-white px-6 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b6b6b] font-light">
            © 2025 Purple You. All rights reserved. Made in India.
          </p>
          <div className="flex gap-6 text-xs text-[#6b6b6b]">
            <a href="#" className="hover:text-[#111111] transition-colors">
              Secure Checkout
            </a>
            <span>•</span>
            <span>GST Included</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
