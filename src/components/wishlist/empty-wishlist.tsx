import { EmptyState } from "@/components/ui/empty-state";

export function EmptyWishlist() {
  return (
    <EmptyState
      eyebrow="Wishlist"
      title="Nothing saved yet."
      description="Save the pieces you love and come back to them anytime."
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
