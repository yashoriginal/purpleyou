import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { StoreProvider } from "@/store/provider";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { CartInitializer } from "@/components/cart/cart-initializer";
import { WishlistInitializer } from "@/components/wishlist/wishlist-initializer";
import { Footer } from "@/components/layout/footer";
import { RouteAwareFooter } from "@/components/layout/route-aware-footer";

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

          <Header />

          {children}
          <RouteAwareFooter>
            <Footer />
          </RouteAwareFooter>
        </StoreProvider>
      </body>
    </html>
  );
}
