import Image from "next/image";
import Link from "next/link";

import {
  getDepartmentCollectionHref,
  type Department,
} from "@/lib/departments";

const categoryLinks = [
  {
    label: "Rings",
    collection: "rings",
  },
  {
    label: "Necklaces",
    collection: "necklaces",
  },
  {
    label: "Earrings",
    collection: "earrings",
  },
  {
    label: "Bracelets",
    collection: "bracelets",
  },
  {
    label: "All Jewelry",
    collection: "all",
  },
];

const discoverLinks = [
  {
    label: "New Arrivals",
    collection: "all",
  },
  {
    label: "Best Sellers",
    collection: "all",
  },
  {
    label: "PurpleYou Edit",
    collection: "all",
  },
];

interface ShopMegaMenuProps {
  open: boolean;
  department: Department;
  onNavigate: () => void;
}

export function ShopMegaMenu({
  open,
  department,
  onNavigate,
}: ShopMegaMenuProps) {
  const allJewelryHref = getDepartmentCollectionHref(department, "all");

  return (
    <div
      className={`
        absolute
        left-0
        top-full
        z-[70]
        hidden
        w-full
        border-t
        border-white/10
        bg-[#090909]
        text-[#f3f0eb]

        transition-[opacity,transform,visibility]
        duration-200
        ease-out

        lg:block

        ${
          open
            ? `
              visible
              translate-y-0
              opacity-100
              pointer-events-auto
            `
            : `
              invisible
              -translate-y-1
              opacity-0
              pointer-events-none
            `
        }
      `}
    >
      <div
        className="
          grid
          min-h-[520px]
          grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]
        "
      >
        {/* Navigation */}
        <div
          className="
            px-10
            py-12

            xl:px-14

            2xl:px-16
          "
        >
          <Link
            href={allJewelryHref}
            onClick={onNavigate}
            className="
              inline-block
              text-[12px]
              font-medium
              uppercase
              tracking-[0.24em]

              transition-colors
              hover:text-[#a96ad8]
            "
          >
            Shop All Jewelry
          </Link>

          <div
            className="
              mt-12
              grid
              grid-cols-2
              gap-12
            "
          >
            {/* Categories */}
            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                  text-white/45
                "
              >
                By Category
              </p>

              <div className="mt-7 space-y-5">
                {categoryLinks.map((item) => (
                  <Link
                    key={item.collection}
                    href={getDepartmentCollectionHref(
                      department,
                      item.collection,
                    )}
                    onClick={onNavigate}
                    className="
                        block
                        w-fit
                        text-[15px]
                        font-medium
                        tracking-[0.04em]

                        transition-colors
                        hover:text-[#a96ad8]
                      "
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Discover */}
            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.28em]
                  text-white/45
                "
              >
                Discover
              </p>

              <div className="mt-7 space-y-5">
                {discoverLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={getDepartmentCollectionHref(
                      department,
                      item.collection,
                    )}
                    onClick={onNavigate}
                    className="
                        block
                        w-fit
                        text-[15px]
                        font-medium
                        tracking-[0.04em]

                        transition-colors
                        hover:text-[#a96ad8]
                      "
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div
            className="
              mt-14
              h-px
              w-16
              bg-[#8f4db8]
            "
          />

          <p
            className="
              mt-5
              max-w-sm
              text-xs
              leading-6
              text-white/45
            "
          >
            Discover PurpleYou pieces made to become part of your everyday
            story.
          </p>
        </div>

        {/* Editorial area */}
        <div
          className="
            grid
            grid-cols-2
            border-l
            border-white/10
          "
        >
          <MegaMenuImage
            title="New Arrivals"
            action="Explore"
            href={allJewelryHref}
            image="/images/mega-menu/new-arrivals.jpeg"
            onNavigate={onNavigate}
          />

          <MegaMenuImage
            title="Best Sellers"
            action="Shop"
            href={allJewelryHref}
            image="/images/mega-menu/best-sellers.jpeg"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}

function MegaMenuImage({
  title,
  action,
  href,
  image,
  onNavigate,
}: {
  title: string;
  action: string;
  href: string;
  image: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="
        group
        relative
        min-h-[520px]
        overflow-hidden
        border-r
        border-white/10
      "
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="30vw"
        className="
          object-cover

          transition-transform
          duration-700
          ease-out

          group-hover:scale-[1.035]
        "
      />

      {/* Dark image treatment */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/85
          via-black/15
          to-black/20
        "
      />

      {/* PurpleYou signature tint */}
      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_25%_20%,rgba(137,72,181,0.22),transparent_46%)]

          opacity-70

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />

      {/* Fine editorial border */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          border
          border-transparent

          transition-colors
          duration-300

          group-hover:border-[#a96ad8]/30
        "
      />

      <div
        className="
          absolute
          inset-x-8
          bottom-9
          z-10

          xl:inset-x-10
        "
      >
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.3em]
            text-white/55
          "
        >
          PurpleYou
        </p>

        <h3
          className="
            mt-3
            text-[26px]
            font-medium
            tracking-[-0.03em]
            text-white
          "
        >
          {title}
        </h3>

        <span
          className="
            relative
            mt-5
            inline-flex
            items-center
            gap-3
            pb-1

            text-[10px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-white

            after:absolute
            after:bottom-0
            after:left-0
            after:h-px
            after:w-full
            after:bg-[#a96ad8]
          "
        >
          {action}

          <span
            aria-hidden="true"
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
