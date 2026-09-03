"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectAuthUser,
  selectIsAuthenticated,
  selectIsAuthLoading,
} from "@/store/selectors/auth-selectors";

import { logoutUser } from "@/store/slices/auth-slice";
import { openAuth } from "@/store/slices/ui-slice";

const emptySubscribe = () => {
  return () => {};
};

function useHasHydratedClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function AccountContent() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsAuthLoading);

  const hasHydratedClient = useHasHydratedClient();

  /*
   * Important:
   *
   * The authenticated user is restored from localStorage.
   * localStorage is unavailable during SSR.
   *
   * Therefore the server and the very first client render
   * must render exactly the same content.
   */
  if (!hasHydratedClient || isLoading) {
    return <AccountLoading />;
  }

  if (!isAuthenticated || !user) {
    return <SignedOutAccount onSignIn={() => dispatch(openAuth())} />;
  }

  return (
    <section
      className="
        site-container
        py-10
        sm:py-14
        lg:py-16
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-12
          lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]
          lg:gap-16
        "
      >
        {/* User details */}
        <aside
          className="
            h-fit
            border
            border-[var(--border)]
            p-6
            sm:p-8
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-[var(--muted-foreground)]
            "
          >
            Signed In
          </p>

          <h2
            className="
              mt-4
              text-2xl
              font-medium
              tracking-[-0.025em]
            "
          >
            Welcome to PurpleYou.
          </h2>

          <div
            className="
              mt-8
              border-t
              border-[var(--border)]
              pt-6
            "
          >
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-[var(--muted-foreground)]
              "
            >
              Mobile Number
            </p>

            <p className="mt-2 text-sm">{formatMobile(user.mobile)}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              void dispatch(logoutUser());
            }}
            className="
              mt-8
              min-h-12
              w-full
              border
              border-[var(--border)]
              px-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              transition-colors
              hover:border-[var(--foreground)]
            "
          >
            Sign Out
          </button>
        </aside>

        {/* Account actions */}
        <div>
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-[var(--muted-foreground)]
            "
          >
            Your PurpleYou
          </p>

          <div
            className="
              mt-5
              grid
              grid-cols-1
              border-l
              border-t
              border-[var(--border)]
              sm:grid-cols-2
            "
          >
            <AccountLink
              href="/cart"
              title="Shopping Bag"
              description="Review the pieces currently in your bag."
            />

            <AccountLink
              href="/wishlist"
              title="Wishlist"
              description="Return to the pieces you saved."
            />

            <AccountPlaceholder
              title="Orders"
              description="Your PurpleYou order history will appear here."
            />

            <AccountPlaceholder
              title="Addresses"
              description="Saved delivery addresses will appear here."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        min-h-[210px]
        border-b
        border-r
        border-[var(--border)]
        p-6
        transition-colors
        hover:bg-[var(--surface)]
        sm:p-8
      "
    >
      <div
        className="
          flex
          h-full
          flex-col
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-medium
              tracking-[-0.025em]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-4
              max-w-xs
              text-sm
              leading-6
              text-[var(--muted-foreground)]
            "
          >
            {description}
          </p>
        </div>

        <span
          className="
            mt-8
            text-xl
            transition-transform
            group-hover:translate-x-2
          "
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}

function AccountPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        min-h-[210px]
        border-b
        border-r
        border-[var(--border)]
        p-6
        sm:p-8
      "
    >
      <h2
        className="
          text-2xl
          font-medium
          tracking-[-0.025em]
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-4
          max-w-xs
          text-sm
          leading-6
          text-[var(--muted-foreground)]
        "
      >
        {description}
      </p>

      <p
        className="
          mt-8
          text-[9px]
          uppercase
          tracking-[0.2em]
          text-[var(--muted-foreground)]
        "
      >
        Coming later
      </p>
    </div>
  );
}

function SignedOutAccount({ onSignIn }: { onSignIn: () => void }) {
  return (
    <section
      className="
        site-container
        flex
        min-h-[55vh]
        items-center
        justify-center
        py-16
        text-center
      "
    >
      <div className="max-w-md">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.28em]
            text-[var(--muted-foreground)]
          "
        >
          My Account
        </p>

        <h2
          className="
            mt-4
            text-3xl
            font-medium
            tracking-[-0.03em]
          "
        >
          Sign in to your account.
        </h2>

        <p
          className="
            mt-4
            text-sm
            leading-7
            text-[var(--muted-foreground)]
          "
        >
          Access your bag, wishlist, and account details.
        </p>

        <button
          type="button"
          onClick={onSignIn}
          className="
            mt-8
            inline-flex
            min-h-12
            items-center
            justify-center
            bg-[var(--foreground)]
            px-8
            text-[10px]
            font-medium
            uppercase
            tracking-[0.2em]
            text-[var(--background)]
          "
        >
          Sign In
        </button>
      </div>
    </section>
  );
}

function AccountLoading() {
  return (
    <div
      className="
        site-container
        flex
        min-h-[50vh]
        items-center
        justify-center
      "
    >
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-[var(--muted-foreground)]
        "
      >
        Loading account...
      </p>
    </div>
  );
}

function formatMobile(mobile: string) {
  if (!mobile) {
    return "—";
  }

  if (mobile.startsWith("+91") && mobile.length >= 13) {
    return `+91 ${mobile.slice(-10)}`;
  }

  return mobile;
}
