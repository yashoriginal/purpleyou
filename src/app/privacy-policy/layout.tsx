import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - PURPLE YOU",
  description:
    "Read PURPLE YOU's privacy policy and learn how we protect your data.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
