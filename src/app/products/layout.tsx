import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Products - PURPLE YOU",
    template: "%s | PURPLE YOU",
  },
  description: "Discover PURPLE YOU's premium jewelry products.",
  robots: {
    index: true,
    follow: true,
  },
};

// ISR: Revalidate every 30 minutes (price updates, stock changes)
export const revalidate = 1800;

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
