import { EmptyState } from "@/components/ui/empty-state";

import {
  getDepartmentCollectionHref,
  type Department,
} from "@/lib/departments";

interface EmptySearchResultsProps {
  query: string;
  department: Department;
}

export function EmptySearchResults({
  query,
  department,
}: EmptySearchResultsProps) {
  const shopAllHref = getDepartmentCollectionHref(department, "all");

  const homeHref = `/?department=${department}`;

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
        href: shopAllHref,
      }}
      secondaryAction={{
        label: "Back Home",
        href: homeHref,
      }}
    />
  );
}
