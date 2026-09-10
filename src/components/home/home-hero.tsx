"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  getDepartmentCollectionHref,
  normalizeDepartment,
} from "@/lib/departments";

export function HomeHero() {
  const searchParams = useSearchParams();

  const department = normalizeDepartment(searchParams.get("department"));

  const collectionHref = getDepartmentCollectionHref(department, "all");

  return (
    <section
      id="home-hero"
      className="
        relative
        isolate
        min-h-[calc(100svh-112px)]
        overflow-hidden
        bg-[#080808]
        text-white
      "
    >
      {/* Temporary image — replace later with final PurpleYou campaign image */}
      <Image
        src="/images/mega-menu/new-arrivals.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="
          -z-30
          object-cover
          object-center
        "
      />

      {/* Main cinematic dark treatment */}
      <div
        className="
          absolute
          inset-0
          -z-20
          bg-gradient-to-b
          from-black/35
          via-black/15
          to-black/65
        "
      />

      {/* PurpleYou signature light */}
      <div
        className="
          absolute
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_70%_20%,rgba(141,76,183,0.22),transparent_42%)]
        "
      />

      {/* Slight edge vignette */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          shadow-[inset_0_0_180px_rgba(0,0,0,0.48)]
        "
      />

      <div
        className="
          site-container
          relative
          flex
          min-h-[calc(100svh-112px)]
          flex-col
          items-center
          justify-center
          px-5
          pb-24
          pt-20
          text-center

          sm:px-8

          lg:pb-28
          lg:pt-24
        "
      >
        {/* Small editorial label */}
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.34em]
            text-white/70

            sm:text-[10px]
          "
        >
          PurpleYou
        </p>

        {/* Main campaign heading */}
        <h1
          className="
            mt-5
            max-w-[1100px]
            text-[clamp(3rem,8vw,7.8rem)]
            font-medium
            leading-[0.86]
            tracking-[-0.055em]
            text-[#f5f1ed]
          "
        >
          Made to
          <br />
          Be Noticed
        </h1>

        <p
          className="
            mt-7
            max-w-md
            text-[11px]
            font-medium
            uppercase
            leading-6
            tracking-[0.22em]
            text-white/75

            sm:text-xs
          "
        >
          Jewelry for every version of you.
        </p>

        {/* Department-aware CTA */}
        <Link
          href={collectionHref}
          className="
            group
            relative
            mt-9
            inline-flex
            min-h-11
            items-center
            justify-center
            px-1
            text-[10px]
            font-medium
            uppercase
            tracking-[0.25em]
            text-white

            after:absolute
            after:bottom-0
            after:left-0
            after:h-px
            after:w-full
            after:origin-right
            after:bg-[#a96ad8]
            after:transition-transform
            after:duration-300

            hover:after:origin-left
            hover:after:scale-x-50
          "
        >
          Shop the Collection
        </Link>

        {/* Explore arrow */}
        <Link
          href={collectionHref}
          aria-label={`Explore ${department === "men" ? "men's" : "women's"} PurpleYou jewelry`}
          className="
            group
            absolute
            bottom-20
            left-1/2
            flex
            h-11
            w-11
            -translate-x-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/25
            bg-black/10
            text-white
            backdrop-blur-sm

            transition-all
            duration-300

            hover:border-[#a96ad8]
            hover:bg-[#a96ad8]/10

            sm:bottom-20

            lg:bottom-16
          "
        >
          <span
            aria-hidden="true"
            className="
              block
              h-[11px]
              w-[11px]
              -translate-y-[2px]
              rotate-45
              border-b
              border-r
              border-current

              transition-transform
              duration-300

              group-hover:translate-y-[2px]
            "
          />
        </Link>
      </div>
    </section>
  );
}
