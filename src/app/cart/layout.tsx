import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart - PURPLE YOU",
  description: "Review and manage your shopping cart. Proceed to checkout.",
  robots: {
    index: false, // Don't index cart page
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
