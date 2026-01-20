import "@/app/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClientOnly } from "@/components/ClientOnly";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://purpleyou.com"),
  title: {
    default: "PURPLE YOU - Premium Jewelry Collection | Elegant Accessories",
    template: "%s | PURPLE YOU",
  },
  description:
    "Premium jewelry for every moment. Discover elegant, timeless pieces crafted with care and designed to last.",
  keywords: [
    "jewelry",
    "premium jewelry",
    "gold jewelry",
    "earrings",
    "necklaces",
    "rings",
    "bracelets",
    "luxury accessories",
    "handcrafted jewelry",
  ],
  authors: [{ name: "PURPLE YOU" }],
  creator: "PURPLE YOU",
  publisher: "PURPLE YOU",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://purpleyou.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
