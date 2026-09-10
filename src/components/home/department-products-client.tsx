"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

import { ProductCard } from "@/components/product/product-card";

import {
  getDepartmentCollectionHref,
  normalizeDepartment,
  type Department,
} from "@/lib/departments";

import type { Product } from "@/types/product";

interface DepartmentProductsClientProps {
  womenProducts: Product[];
  menProducts: Product[];
}

export function DepartmentProductsClient({
  womenProducts,
  menProducts,
}: DepartmentProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const railRef = useRef<HTMLDivElement>(null);

  const department = normalizeDepartment(searchParams.get("department"));

  const products = department === "women" ? womenProducts : menProducts;

  function changeDepartment(nextDepartment: Department) {
    if (nextDepartment === department) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("department", nextDepartment);

    railRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function scroll(direction: "left" | "right") {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      left:
        direction === "right"
          ? rail.clientWidth * 0.75
          : -rail.clientWidth * 0.75,
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
        bg-[#090909]
        text-white
      "
    >
      {/* Heading */}
      <div
        className="
          shrink-0
          border-b
          border-white/10
          px-5
          pb-5
          pt-6

          sm:px-8

          lg:px-12
          lg:pb-7
          lg:pt-8
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-5
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-white/40
              "
            >
              PurpleYou Selection
            </p>

            <h2
              className="
                mt-2
                text-[26px]
                font-medium
                uppercase
                leading-none
                tracking-[-0.02em]

                sm:text-[30px]

                lg:text-[38px]
              "
            >
              {department === "women" ? "Women's Edit" : "Men's Edit"}
            </h2>
          </div>

          <Link
            href={getDepartmentCollectionHref(department, "all")}
            className="
              shrink-0
              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-white/55

              transition-colors
              hover:text-white
            "
          >
            View All →
          </Link>
        </div>

        {/* Women / Men */}
        <div
          className="
            mt-5
            flex
            gap-8
          "
        >
          <DepartmentTab
            active={department === "women"}
            onClick={() => changeDepartment("women")}
          >
            WOMEN&apos;S
          </DepartmentTab>

          <DepartmentTab
            active={department === "men"}
            onClick={() => changeDepartment("men")}
          >
            MEN&apos;S
          </DepartmentTab>
        </div>
      </div>

      {/* Products */}
      <div
        className="
          relative
          min-h-0
          flex-1
          overflow-hidden
        "
      >
        {products.length > 0 ? (
          <>
            <div
              ref={railRef}
              className="
                flex
                h-full
                snap-x
                snap-mandatory
                gap-3
                overflow-x-auto
                px-5
                pb-16
                pt-5

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:px-8

                lg:gap-6
                lg:px-12
              "
            >
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="
                      w-[57vw]
                      max-w-[240px]
                      shrink-0
                      snap-start

                      sm:w-[38vw]

                      lg:w-[220px]
                    "
                >
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>

            {/* Fade indicates more products */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-14
                right-0
                top-5
                w-12

                bg-gradient-to-l
                from-[#090909]
                to-transparent

                lg:hidden
              "
            />

            {/* Controls */}
            <div
              className="
                absolute
                bottom-4
                right-5
                flex
                gap-5

                sm:right-8

                lg:right-12
              "
            >
              <button
                type="button"
                aria-label="Previous products"
                onClick={() => scroll("left")}
                className="
                  text-xl
                  text-white/35
                  transition-colors
                  hover:text-white
                "
              >
                ‹
              </button>

              <button
                type="button"
                aria-label="Next products"
                onClick={() => scroll("right")}
                className="
                  text-xl
                  text-white/75
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
                  text-[10px]
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

interface DepartmentTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function DepartmentTab({ active, onClick, children }: DepartmentTabProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`
        relative
        pb-2
        text-[11px]
        font-medium
        uppercase
        tracking-[0.16em]

        transition-colors

        ${active ? "text-white" : "text-white/35"}
      `}
    >
      {children}

      <span
        aria-hidden="true"
        className={`
          absolute
          bottom-0
          left-0
          h-px
          bg-white

          transition-[width]
          duration-300

          ${active ? "w-full" : "w-0"}
        `}
      />
    </button>
  );
}
