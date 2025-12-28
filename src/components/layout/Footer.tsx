import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f5f2f0] border-t border-[#e6dcd4]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-lg font-light text-[#5540b7] tracking-wide mb-4">
              PURPLE YOU
            </h3>
            <p className="text-xs text-[#6b6b6b] font-light leading-relaxed">
              Real jewelry for real life. Sustainable, ethically crafted fine jewelry guaranteed for life.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li>
                <Link href="/collections/earrings" className="hover:text-[#5540b7] transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/collections/necklaces" className="hover:text-[#5540b7] transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/collections/rings" className="hover:text-[#5540b7] transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/collections/bracelets" className="hover:text-[#5540b7] transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-[#305040] uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li>
                <Link href="/about" className="hover:text-[#305040] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-[#305040] uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-[#6b6b6b]">
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  Care & Cleaning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#305040] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#e6dcd4] flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-[#6b6b6b] font-light">
            © 2025 Aurate New York. All rights reserved.
          </p>
          <p className="text-xs text-[#6b6b6b] font-light mt-4 sm:mt-0">
            Crafted with sustainable materials • Guaranteed for life
          </p>
        </div>
      </div>
    </footer>
  );
}
