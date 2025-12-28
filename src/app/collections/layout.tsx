import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Collections - PURPLE YOU",
    template: "%s | PURPLE YOU",
  },
  description: "Browse PURPLE YOU's curated jewelry collections.",
  robots: {
    index: true,
    follow: true,
  },
};

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
