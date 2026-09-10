"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

import {
  getDepartmentCollectionHref,
  normalizeDepartment,
  type Department,
} from "@/lib/departments";

interface Category {
  title: string;
  collection: string;
  productType: string;
  womenImage: string | null;
  menImage: string | null;
  fallbackImage?: string | null;
}

interface Props {
  categories: Category[];
}

export function DepartmentCategoryCarousel({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const carouselRef = useRef<HTMLDivElement>(null);

  /*
   * URL is now the source of truth.
   *
   * /                  -> Women
   * /?department=women -> Women
   * /?department=men   -> Men
   */
  const department = normalizeDepartment(searchParams.get("department"));

  const visibleCategories = categories;

  function changeDepartment(nextDepartment: Department) {
    if (nextDepartment === department) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("department", nextDepartment);

    /*
     * Reset this carousel when changing
     * Women <-> Men.
     */
    carouselRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function scroll(direction: "left" | "right") {
    const element = carouselRef.current;

    if (!element) {
      return;
    }

    element.scrollBy({
      left:
        direction === "right"
          ? element.clientWidth * 0.7
          : -element.clientWidth * 0.7,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        bg-[#0a0a0a]
        text-white
      "
    >
      {/* Department tabs */}
      <div
        className="
          grid
          h-[70px]
          shrink-0
          grid-cols-2
          border-b
          border-white/10
          px-5

          sm:px-8

          lg:h-[76px]
          lg:max-w-[520px]
        "
      >
        <DepartmentButton
          active={department === "women"}
          onClick={() => changeDepartment("women")}
        >
          WOMEN&apos;S
        </DepartmentButton>

        <DepartmentButton
          active={department === "men"}
          onClick={() => changeDepartment("men")}
        >
          MEN&apos;S
        </DepartmentButton>
      </div>

      {/* Category carousel */}
      <div
        className="
          relative
          min-h-0
          flex-1
          pt-6

          lg:pt-8
        "
      >
        {visibleCategories.length > 0 ? (
          <>
            <div
              ref={carouselRef}
              className="
                flex
                h-full
                snap-x
                snap-mandatory
                gap-2
                overflow-x-auto
                px-5
                pb-20

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:px-8

                lg:gap-5
              "
            >
              {visibleCategories.map((category) => {
                const backendImage =
                  department === "women"
                    ? category.womenImage
                    : category.menImage;

                const image = backendImage ?? category.fallbackImage ?? null;

                return (
                  <Link
                    key={category.collection}
                    href={getDepartmentCollectionHref(
                      department,
                      category.collection,
                    )}
                    className="
                        group
                        w-[72vw]
                        max-w-[330px]
                        shrink-0
                        snap-start

                        sm:w-[42vw]

                        lg:w-[300px]
                        lg:max-w-none
                      "
                  >
                    <div
                      className="
                          relative
                          aspect-[3/4]
                          overflow-hidden
                          bg-[#151515]
                        "
                    >
                      {image ? (
                        <div
                          aria-hidden="true"
                          className="
                              absolute
                              inset-0
                              bg-contain
                              bg-center
                              bg-no-repeat

                              transition-transform
                              duration-700
                              ease-out

                              group-hover:scale-[1.035]
                            "
                          style={{
                            backgroundImage: `url("${image}")`,
                          }}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="
                              absolute
                              inset-0
                              flex
                              items-center
                              justify-center
                              bg-gradient-to-b
                              from-[#1c1c1c]
                              to-[#0a0a0a]
                            "
                        >
                          <span className="text-[11px] uppercase tracking-[0.25em] text-white/30">
                            {category.title}
                          </span>
                        </div>
                      )}

                      <div
                        aria-hidden="true"
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/35
                            via-transparent
                            to-transparent
                          "
                      />
                    </div>

                    <div className="pt-4">
                      <h2
                        className="
                            text-[17px]
                            font-medium
                            uppercase
                            tracking-[0.04em]

                            lg:text-lg
                          "
                      >
                        {category.title}
                      </h2>

                      <p
                        className="
                            mt-1.5
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-white/45
                          "
                      >
                        Discover
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Navigation controls */}
            <div
              className="
                absolute
                bottom-5
                right-5
                flex
                items-center
                gap-5

                sm:right-8
              "
            >
              <button
                type="button"
                aria-label="Previous category"
                onClick={() => scroll("left")}
                className="
                  text-xl
                  text-white/40
                  transition-colors
                  hover:text-white
                "
              >
                ‹
              </button>

              <button
                type="button"
                aria-label="Next category"
                onClick={() => scroll("right")}
                className="
                  text-xl
                  text-white/80
                  transition-colors
                  hover:text-white
                "
              >
                ›
              </button>
            </div>
          </>
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              px-8
              text-center
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-white/35
                "
              >
                {department === "men"
                  ? "Men's Collection"
                  : "Women's Collection"}
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  text-white/55
                "
              >
                No products available yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface DepartmentButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function DepartmentButton({
  active,
  onClick,
  children,
}: DepartmentButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`
        relative
        flex
        items-center
        text-left
        text-[17px]
        font-medium
        uppercase
        tracking-[0.025em]

        transition-colors
        duration-300

        ${active ? "text-white" : "text-white/40"}
      `}
    >
      {children}

      <span
        aria-hidden="true"
        className={`
          absolute
          bottom-0
          left-0
          h-[2px]
          bg-white

          transition-[width]
          duration-300

          ${active ? "w-[88px]" : "w-0"}
        `}
      />
    </button>
  );
}
