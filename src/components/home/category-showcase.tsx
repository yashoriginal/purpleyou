import Link from "next/link";

import { getCategoryShowcaseProducts } from "@/services/products.service";

interface CategoryItem {
  number: string;
  title: string;
  description: string;
  href: string;
  productType: string;
}

const categories: CategoryItem[] = [
  {
    number: "01",
    title: "Rings",
    description: "Statement pieces for every day.",
    href: "/collections/rings",
    productType: "Rings",
  },
  {
    number: "02",
    title: "Necklaces",
    description: "Designed to layer or stand alone.",
    href: "/collections/necklaces",
    productType: "Necklaces",
  },
  {
    number: "03",
    title: "Bracelets",
    description: "Details made for the wrist.",
    href: "/collections/bracelets",
    productType: "Bracelets",
  },
  {
    number: "04",
    title: "Earrings",
    description: "Small details. Strong character.",
    href: "/collections/earrings",
    productType: "Earrings",
  },
];

export async function CategoryShowcase() {
  const categoryImages = await loadCategoryImages();

  return (
    <section
      className="
        relative
        h-full
        min-h-0
        overflow-hidden
        bg-[#080808]
        text-white
      "
    >
      <div
        className="
          grid
          h-full
          min-h-0
          grid-cols-2
          grid-rows-2
        "
      >
        {categories.map((category, index) => {
          const imageUrl = categoryImages.get(category.productType) ?? null;

          return (
            <Link
              key={category.title}
              href={category.href}
              className={`
                group
                relative
                min-h-0
                overflow-hidden

                ${index % 2 === 0 ? "border-r border-white/10" : ""}
                ${index < 2 ? "border-b border-white/10" : ""}
              `}
            >
              {imageUrl ? (
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-[#111111]
                    bg-contain
                    bg-center
                    bg-no-repeat
                    transition-transform
                    duration-[900ms]
                    ease-out
                    group-hover:scale-[1.045]
                  "
                  style={{
                    backgroundImage: `url("${imageUrl}")`,
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-[#111111]
                  "
                />
              )}

              {/* Dark cinematic overlays */}
              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/95
                  via-black/30
                  to-black/10
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/45
                  via-transparent
                  to-transparent
                "
              />

              {/* PurpleYou signature */}
              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_82%_16%,rgba(150,82,194,0.20),transparent_40%)]
                  opacity-40
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              {/* Hover outline */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  border
                  border-transparent
                  transition-colors
                  duration-300
                  group-hover:border-[#a96ad8]/35
                "
              />

              {/* Category number */}
              <span
                className="
                  absolute
                  left-4
                  top-4
                  z-10
                  text-[8px]
                  font-medium
                  tracking-[0.28em]
                  text-white/45

                  sm:left-6
                  sm:top-6
                  sm:text-[9px]

                  lg:left-8
                  lg:top-7
                "
              >
                {category.number}
              </span>

              {/* Bottom content */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  z-10
                  p-4
                  sm:p-6
                  lg:p-8
                "
              >
                <p
                  className="
                    mb-2
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-[#c58ae8]
                    sm:text-[9px]
                  "
                >
                  Shop Category
                </p>

                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div className="min-w-0">
                    <h2
                      className="
                        text-[clamp(1.8rem,3.8vw,4.6rem)]
                        font-medium
                        leading-[0.9]
                        tracking-[-0.05em]
                        text-[#f5f1ed]
                      "
                    >
                      {category.title}
                    </h2>

                    <p
                      className="
                        mt-2
                        hidden
                        max-w-[280px]
                        text-[11px]
                        leading-5
                        text-white/55
                        sm:block
                      "
                    >
                      {category.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="
                      mb-1
                      shrink-0
                      text-xl
                      text-white/80
                      transition-all
                      duration-300

                      group-hover:translate-x-2
                      group-hover:text-[#c58ae8]

                      sm:text-2xl
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

async function loadCategoryImages() {
  const imageMap = new Map<string, string>();

  const results = await Promise.all(
    categories.map(async (category) => {
      try {
        const products = await getCategoryShowcaseProducts(
          category.productType,
        );

        const product = products[0];

        return {
          productType: category.productType,
          image: product?.images[0] ?? null,
        };
      } catch (error) {
        console.error(
          `Unable to load ${category.title} category image:`,
          error,
        );

        return {
          productType: category.productType,
          image: null,
        };
      }
    }),
  );

  for (const result of results) {
    if (result.image) {
      imageMap.set(result.productType, result.image);
    }
  }

  return imageMap;
}
