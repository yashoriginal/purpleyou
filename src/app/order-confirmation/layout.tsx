import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation | Purple You",
  description:
    "Your order has been successfully placed. Track your order and shipping details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
