import Link from "next/link";

const shopLinks = [
  {
    label: "Shop All",
    href: "/collections/all",
  },
  {
    label: "Rings",
    href: "/collections/rings",
  },
  {
    label: "Necklaces",
    href: "/collections/necklaces",
  },
  {
    label: "Bracelets",
    href: "/collections/bracelets",
  },
  {
    label: "Earrings",
    href: "/collections/earrings",
  },
];

const exploreLinks = [
  {
    label: "Wishlist",
    href: "/wishlist",
  },
  {
    label: "Search",
    href: "/search",
  },
  {
    label: "About",
    href: "/about",
  },
];

export function Footer() {
  return (
    <footer
      className="
        border-t
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      <div className="site-container">
        <div
          className="
            grid
            gap-12
            py-14
            md:grid-cols-2
            md:py-16
            lg:grid-cols-[1.6fr_0.7fr_0.7fr]
            lg:gap-16
            lg:py-20
          "
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="
                text-2xl
                font-medium
                uppercase
                tracking-[0.24em]
                sm:text-3xl
              "
            >
              Purple You
            </Link>

            <p
              className="
                mt-6
                max-w-md
                text-sm
                leading-7
                text-[var(--muted-foreground)]
              "
            >
              Jewelry designed for everyday expression, memorable moments, and
              everything in between.
            </p>

            <p
              className="
                mt-8
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-[var(--muted-foreground)]
              "
            >
              Most versatile accessories in town.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h2
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-[var(--muted-foreground)]
              "
            >
              Shop
            </h2>

            <nav
              className="
                mt-5
                flex
                flex-col
                items-start
                gap-3
              "
            >
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    text-sm
                    transition-opacity
                    hover:opacity-55
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore */}
          <div>
            <h2
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-[var(--muted-foreground)]
              "
            >
              Explore
            </h2>

            <nav
              className="
                mt-5
                flex
                flex-col
                items-start
                gap-3
              "
            >
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    text-sm
                    transition-opacity
                    hover:opacity-55
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-[var(--border)]
            py-6
            text-[9px]
            uppercase
            tracking-[0.2em]
            text-[var(--muted-foreground)]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>© {new Date().getFullYear()} PurpleYou</p>

          <p>Designed for everyday expression.</p>
        </div>
      </div>
    </footer>
  );
}
