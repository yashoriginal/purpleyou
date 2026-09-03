"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CollectionSidebarProps {
  productCount: number;
  minAvailablePrice?: number;
  maxAvailablePrice?: number;
}

const categories = [
  {
    label: "All Jewelry",
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

export function CollectionSidebar({
  productCount,
  minAvailablePrice,
  maxAvailablePrice,
}: CollectionSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") ?? "featured";

  const inStock = searchParams.get("stock") === "in";

  const minPrice = searchParams.get("min") ?? "";

  const maxPrice = searchParams.get("max") ?? "";

  function updateParam(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <aside
      className="
        border-[var(--border)]
        lg:sticky
        lg:top-28
        lg:self-start
        lg:border-r
        lg:pr-8
      "
    >
      {/* Results */}
      <div
        className="
          border-b
          border-[var(--border)]
          pb-6
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.24em]
            text-[var(--muted-foreground)]
          "
        >
          {productCount} {productCount === 1 ? "Piece" : "Pieces"}
        </p>
      </div>

      {/* Sort */}
      <div
        className="
          border-b
          border-[var(--border)]
          py-7
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.24em]
          "
        >
          Sort By
        </p>

        <select
          value={sort}
          onChange={(event) =>
            updateParam(
              "sort",
              event.target.value === "featured"
                ? undefined
                : event.target.value,
            )
          }
          className="
            mt-4
            w-full
            border
            border-[var(--border)]
            bg-[var(--background)]
            px-3
            py-3
            text-xs
            outline-none
          "
        >
          <option value="featured">Featured</option>

          <option value="price-low">Price: Low to High</option>

          <option value="price-high">Price: High to Low</option>

          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {/* Categories */}
      <div
        className="
          border-b
          border-[var(--border)]
          py-7
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.24em]
          "
        >
          Categories
        </p>

        <nav
          className="
            mt-5
            flex
            flex-col
            gap-4
          "
        >
          {categories.map((category) => {
            const active = pathname === category.href;

            return (
              <Link
                key={category.href}
                href={category.href}
                className={`
                    flex
                    items-center
                    gap-3
                    text-xs
                    uppercase
                    tracking-[0.16em]
                    transition-opacity
                    hover:opacity-60
                    ${
                      active
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)]"
                    }
                  `}
              >
                <span
                  className={`
                      h-3
                      w-3
                      border
                      ${
                        active
                          ? "bg-[var(--foreground)]"
                          : "border-[var(--muted-foreground)]"
                      }
                    `}
                />

                {category.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Availability */}
      <div
        className="
          border-b
          border-[var(--border)]
          py-7
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.24em]
          "
        >
          Availability
        </p>

        <label
          className="
            mt-5
            flex
            cursor-pointer
            items-center
            gap-3
            text-xs
            uppercase
            tracking-[0.14em]
          "
        >
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) =>
              updateParam("stock", event.target.checked ? "in" : undefined)
            }
            className="h-4 w-4"
          />
          In Stock Only
        </label>
      </div>

      {/* Price */}
      <div className="py-7">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.24em]
          "
        >
          Price
        </p>

        {typeof maxAvailablePrice === "number" && (
          <p
            className="
              mt-3
              text-xs
              text-[var(--muted-foreground)]
            "
          >
            ₹{minAvailablePrice ?? 0} – ₹{maxAvailablePrice}
          </p>
        )}

        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-2
          "
        >
          <input
            value={minPrice}
            onChange={(event) =>
              updateParam("min", event.target.value || undefined)
            }
            inputMode="numeric"
            placeholder="From"
            className="
              min-w-0
              border
              border-[var(--border)]
              bg-transparent
              px-3
              py-3
              text-xs
              outline-none
            "
          />

          <input
            value={maxPrice}
            onChange={(event) =>
              updateParam("max", event.target.value || undefined)
            }
            inputMode="numeric"
            placeholder="To"
            className="
              min-w-0
              border
              border-[var(--border)]
              bg-transparent
              px-3
              py-3
              text-xs
              outline-none
            "
          />
        </div>
      </div>
    </aside>
  );
}
