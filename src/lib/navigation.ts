export interface NavigationItem {
  label: string;
  href: string;
}

export const mainNavigation: NavigationItem[] = [
  {
    label: "Shop",
    href: "/collections/all",
  },
  {
    label: "Earrings",
    href: "/collections/earrings",
  },
  {
    label: "Necklaces",
    href: "/collections/necklaces",
  },
  {
    label: "Rings",
    href: "/collections/rings",
  },
  {
    label: "Bracelets",
    href: "/collections/bracelets",
  },
  {
    label: "About",
    href: "/about",
  },
];
