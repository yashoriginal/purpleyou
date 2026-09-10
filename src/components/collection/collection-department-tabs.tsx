"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { Department } from "@/lib/departments";

export function CollectionDepartmentTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const department: Department =
    searchParams.get("department")?.toLowerCase() === "men" ? "men" : "women";

  function getDepartmentHref(nextDepartment: Department) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("department", nextDepartment);

    return `${pathname}?${params.toString()}`;
  }

  return (
    <div
      className="
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      <div
        className="
          site-container
          grid
          h-[58px]
          grid-cols-2

          sm:h-[64px]

          lg:max-w-[520px]
          lg:px-0
          lg:mx-0
        "
      >
        <DepartmentLink
          href={getDepartmentHref("women")}
          active={department === "women"}
        >
          WOMEN&apos;S
        </DepartmentLink>

        <DepartmentLink
          href={getDepartmentHref("men")}
          active={department === "men"}
        >
          MEN&apos;S
        </DepartmentLink>
      </div>
    </div>
  );
}

interface DepartmentLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function DepartmentLink({ href, active, children }: DepartmentLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`
        relative
        flex
        items-center
        justify-start

        text-[13px]
        font-medium
        uppercase
        tracking-[0.14em]

        transition-colors
        duration-300

        ${
          active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
        }
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
          bg-[var(--foreground)]

          transition-[width]
          duration-300

          ${active ? "w-[78px]" : "w-0"}
        `}
      />
    </Link>
  );
}
