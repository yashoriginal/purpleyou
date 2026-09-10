import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { StoreProvider } from "@/store/provider";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { CartInitializer } from "@/components/cart/cart-initializer";
import { WishlistInitializer } from "@/components/wishlist/wishlist-initializer";
import { Footer } from "@/components/layout/footer";
import { RouteAwareFooter } from "@/components/layout/route-aware-footer";
import { Suspense } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PurpleYou",
    template: "%s | PurpleYou",
  },
  description:
    "Discover modern jewelry and accessories designed to elevate your everyday style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthInitializer />
          <CartInitializer />
          <WishlistInitializer />

          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>

          {children}
          <RouteAwareFooter>
            <Suspense fallback={<FooterFallback />}>
              <Footer />
            </Suspense>
          </RouteAwareFooter>
        </StoreProvider>
      </body>
    </html>
  );
}

function HeaderFallback() {
  return (
    <div
      aria-hidden="true"
      className="
        h-[162px]
        border-b
        border-[var(--border)]

        lg:h-[122px]
      "
    />
  );
}

function FooterFallback() {
  return (
    <div
      aria-hidden="true"
      className="
        min-h-[260px]
        border-t
        border-[var(--border)]
      "
    />
  );
}
