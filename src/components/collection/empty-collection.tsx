import { EmptyState } from "@/components/ui/empty-state";

export function EmptyCollection() {
  return (
    <EmptyState
      eyebrow="Collection"
      title="No pieces found."
      description="Nothing matches the filters you've selected. Try adjusting them or explore the full PurpleYou collection."
      primaryAction={{
        label: "Shop All",
        href: "/collections/all",
      }}
    />
  );
}
