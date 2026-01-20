"use client";

import { ReactNode, useEffect, useState } from "react";

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnlyWrapper({
  children,
  fallback = null,
}: ClientOnlyWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
