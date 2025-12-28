import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - PURPLE YOU",
  description:
    "Complete your purchase at PURPLE YOU. Secure checkout powered by Razorpay.",
  robots: {
    index: false, // Don't index checkout page
    follow: true,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
