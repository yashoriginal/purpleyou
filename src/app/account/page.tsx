import type { Metadata } from "next";

import { AccountContent } from "@/components/account/account-content";

export const metadata: Metadata = {
  title: "My Account | PurpleYou",
  description: "Manage your PurpleYou account.",
};

export default function AccountPage() {
  return (
    <main>
      <header
        className="
          border-b
          border-[var(--border)]
        "
      >
        <div
          className="
            site-container
            py-12
            sm:py-16
            lg:py-20
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-[var(--muted-foreground)]
            "
          >
            PurpleYou
          </p>

          <h1
            className="
              mt-4
              text-5xl
              font-medium
              tracking-[-0.045em]
              sm:text-6xl
              lg:text-7xl
            "
          >
            My Account
          </h1>
        </div>
      </header>

      <AccountContent />
    </main>
  );
}
