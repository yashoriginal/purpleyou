import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy - PURPLE YOU",
  description: "Learn about PURPLE YOU's shipping and delivery options.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShippingDeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
