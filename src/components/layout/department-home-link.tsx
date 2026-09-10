"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { normalizeDepartment } from "@/lib/departments";

interface DepartmentHomeLinkProps {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function DepartmentHomeLink({
  className,
  children,
  ariaLabel,
}: DepartmentHomeLinkProps) {
  const searchParams = useSearchParams();

  const department = normalizeDepartment(searchParams.get("department"));

  return (
    <Link
      href={`/?department=${department}`}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </Link>
  );
}
