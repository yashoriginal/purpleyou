"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("PurpleYou route error:", error);
  }, [error]);

  return (
    <main
      className="
        site-container
        flex
        min-h-[70vh]
        items-center
        justify-center
        py-16
        text-center
      "
    >
      <div className="max-w-xl">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-[var(--muted-foreground)]
          "
        >
          Something went wrong
        </p>

        <h1
          className="
            mt-5
            text-4xl
            font-medium
            tracking-[-0.04em]
            sm:text-5xl
            lg:text-6xl
          "
        >
          We couldn&apos;t load this page.
        </h1>

        <p
          className="
            mx-auto
            mt-6
            max-w-md
            text-sm
            leading-7
            text-[var(--muted-foreground)]
          "
        >
          Please try again. If the problem continues, you can return to the shop
          and keep browsing.
        </p>

        <div
          className="
            mt-10
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={() => reset()}
            className="
              flex
              min-h-12
              min-w-[180px]
              items-center
              justify-center
              bg-[var(--foreground)]
              px-7
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--background)]
              transition-opacity
              hover:opacity-80
            "
          >
            Try Again
          </button>

          <Link
            href="/collections/all"
            className="
              flex
              min-h-12
              min-w-[180px]
              items-center
              justify-center
              border
              border-[var(--border)]
              px-7
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              transition-colors
              hover:border-[var(--foreground)]
            "
          >
            Shop All
          </Link>
        </div>

        {error.digest && (
          <p
            className="
              mt-8
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-[var(--muted-foreground)]
            "
          >
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
