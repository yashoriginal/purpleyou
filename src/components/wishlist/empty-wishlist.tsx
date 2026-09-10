import { EmptyState } from "@/components/ui/empty-state";

import {
  getDepartmentCollectionHref,
  type Department,
} from "@/lib/departments";

interface EmptyWishlistProps {
  department: Department;
}

export function EmptyWishlist({ department }: EmptyWishlistProps) {
  return (
    <EmptyState
      eyebrow="Wishlist"
      title="Nothing saved yet."
      description="Save the pieces you love and come back to them anytime."
      primaryAction={{
        label: "Shop All",
        href: getDepartmentCollectionHref(department, "all"),
      }}
      secondaryAction={{
        label: "Explore Rings",
        href: getDepartmentCollectionHref(department, "rings"),
      }}
    />
  );
}
