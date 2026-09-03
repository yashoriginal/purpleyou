import Link from "next/link";

export default function NotFound() {
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
          404
        </p>

        <h1
          className="
            mt-5
            text-5xl
            font-medium
            tracking-[-0.045em]
            sm:text-6xl
            lg:text-7xl
          "
        >
          Nothing here.
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
          The page or piece you&apos;re looking for may have moved, sold out, or
          no longer exists.
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
          <Link
            href="/collections/all"
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
            Shop All
          </Link>

          <Link
            href="/"
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
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
