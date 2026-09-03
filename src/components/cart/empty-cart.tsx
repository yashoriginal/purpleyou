import { EmptyState } from "@/components/ui/empty-state";

export function EmptyCart() {
  return (
    <EmptyState
      eyebrow="Your Bag"
      title="Your bag is empty."
      description="Discover something worth keeping. Your selected PurpleYou pieces will appear here."
      primaryAction={{
        label: "Shop All",
        href: "/collections/all",
      }}
      secondaryAction={{
        label: "Explore Rings",
        href: "/collections/rings",
      }}
    />
  );
}
