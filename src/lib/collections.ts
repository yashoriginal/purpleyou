import type { ProductTaxonomy } from "@/types/product";

export interface CollectionConfig {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  taxonomy?: ProductTaxonomy;
}

export const collections: Record<string, CollectionConfig> = {
  all: {
    slug: "all",
    title: "All Jewelry",
    eyebrow: "PurpleYou Collection",
    description: "Explore the complete PurpleYou collection.",
  },

  rings: {
    slug: "rings",
    title: "Rings",
    eyebrow: "PurpleYou Rings",
    description: "Statement pieces designed for everyday expression.",
    taxonomy: {
      productType: "Rings",
    },
  },

  earrings: {
    slug: "earrings",
    title: "Earrings",
    eyebrow: "PurpleYou Earrings",
    description: "Small details designed to make an impression.",
    taxonomy: {
      productType: "Earrings",
    },
  },

  necklaces: {
    slug: "necklaces",
    title: "Necklaces",
    eyebrow: "PurpleYou Necklaces",
    description: "Pieces designed to stand alone or layer together.",
    taxonomy: {
      productType: "Necklaces",
    },
  },

  bracelets: {
    slug: "bracelets",
    title: "Bracelets",
    eyebrow: "PurpleYou Bracelets",
    description: "Distinctive details made for the wrist.",
    taxonomy: {
      productType: "Bracelets",
    },
  },
};

export function getCollection(slug: string): CollectionConfig | null {
  return collections[slug] ?? null;
}
