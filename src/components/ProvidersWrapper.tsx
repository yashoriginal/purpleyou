import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamically import Providers with ssr disabled to ensure it only runs on client
const Providers = dynamic(() => import("./Providers").then((mod) => ({ default: mod.Providers })), {
  ssr: false,
});

export function ProvidersWrapper({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
