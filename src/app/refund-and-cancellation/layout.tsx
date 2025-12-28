import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy - PURPLE YOU",
  description: "Learn about PURPLE YOU's refund and cancellation policy for your peace of mind.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundCancellationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
