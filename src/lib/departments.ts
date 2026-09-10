import type { Product } from "@/types/product";

export const departments = ["women", "men"] as const;

export type Department = (typeof departments)[number];

export const DEFAULT_DEPARTMENT: Department = "women";

export function normalizeDepartment(
  value: string | null | undefined,
): Department {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "men") {
    return "men";
  }

  return "women";
}

export function getDepartmentLabel(department: Department) {
  return department === "men" ? "Men" : "Women";
}

export function productMatchesDepartment(
  product: Product,
  department: Department,
) {
  return product.base.taxonomy?.department?.trim().toLowerCase() === department;
}

export function getDepartmentCollectionHref(
  department: Department,
  collection = "all",
) {
  return `/collections/${collection}?department=${department}`;
}
