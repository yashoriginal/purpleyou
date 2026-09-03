"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface RouteAwareFooterProps {
  children: ReactNode;
}

export function RouteAwareFooter({ children }: RouteAwareFooterProps) {
  const pathname = usePathname();

  /*
   * Homepage renders its own footer inside
   * the screen-by-screen scroll experience.
   */
  if (pathname === "/") {
    return null;
  }

  return <>{children}</>;
}
