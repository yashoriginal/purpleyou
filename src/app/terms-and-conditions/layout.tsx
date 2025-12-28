import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - PURPLE YOU",
  description: "Read PURPLE YOU's terms and conditions for using our website and services.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
