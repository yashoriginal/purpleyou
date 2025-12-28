import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist - PURPLE YOU",
  description: "View and manage your saved PURPLE YOU wishlist items.",
  robots: {
    index: false, // Don't index wishlist page
    follow: true,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
