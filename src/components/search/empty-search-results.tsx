import { EmptyState } from "@/components/ui/empty-state";

interface EmptySearchResultsProps {
  query: string;
}

export function EmptySearchResults({ query }: EmptySearchResultsProps) {
  return (
    <EmptyState
      eyebrow="Search"
      title="Nothing matched."
      description={
        query
          ? `We couldn't find anything for "${query}". Try another search or explore the full PurpleYou collection.`
          : "Start with a product name, category, or style to discover something from PurpleYou."
      }
      primaryAction={{
        label: "Shop All",
        href: "/collections/all",
      }}
      secondaryAction={{
        label: "Back Home",
        href: "/",
      }}
    />
  );
}
