import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account - PURPLE YOU",
  description: "Manage your PURPLE YOU account, orders, and preferences.",
  robots: {
    index: false, // Don't index account page
    follow: true,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
