import type { Product } from "@/types/product";

export const devMenProducts: Product[] = [
  {
    productId: "DEV-MEN-RING-001",
    slug: "mens-silver-signet-ring-dev-men-ring-001",

    name: "Silver Signet Ring",

    category: "Ring" as Product["category"],
    subcategory: "Ring",

    description:
      "A bold silver-tone statement ring designed as an easy everyday staple.",

    state: "PUBLISHED",

    highlights: [
      "Premium Stainless Steel",
      "Polished Silver Finish",
      "Water Resistant",
      "Everyday Wear",
    ],

    base: {
      price: 799,
      undiscountedPrice: 999,
      stock: 18,

      images: ["/ring-1.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Silver",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Rings",
        productSubtype: "Ring",
      },
    },

    images: ["/ring-1.jpg"],

    variantSchema: {
      size: ["M", "L", "XL"],
    },

    variants: [],

    tags: ["men", "rings", "silver"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-RING-002",
    slug: "mens-heritage-ring-dev-men-ring-002",

    name: "Heritage Ring",

    category: "Ring" as Product["category"],
    subcategory: "Ring",

    description:
      "A masculine statement ring with a strong sculptural profile and polished metal finish.",

    state: "PUBLISHED",

    highlights: [
      "Premium Metal Construction",
      "High-Shine Finish",
      "Statement Design",
      "Everyday Styling",
    ],

    base: {
      price: 899,
      undiscountedPrice: 1199,
      stock: 14,

      images: ["/ring-2.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Oxidized Silver",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Rings",
        productSubtype: "Ring",
      },
    },

    images: ["/ring-2.jpg"],

    variantSchema: {
      size: ["M", "L", "XL"],
    },

    variants: [],

    tags: ["men", "rings", "statement"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-NECKLACE-001",
    slug: "mens-cuban-chain-dev-men-necklace-001",

    name: "Cuban Chain",

    category: "Necklace" as Product["category"],
    subcategory: "Chain",

    description:
      "A substantial chain necklace designed to add a strong finishing detail to everyday looks.",

    state: "PUBLISHED",

    highlights: [
      "Premium Stainless Steel",
      "Polished Finish",
      "Statement Chain",
      "Everyday Wear",
    ],

    base: {
      price: 1099,
      undiscountedPrice: 1399,
      stock: 12,

      images: ["/necklace-1.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Silver",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Necklaces",
        productSubtype: "Chain",
      },
    },

    images: ["/necklace-1.jpg"],

    variants: [],

    tags: ["men", "necklaces", "chains"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-NECKLACE-002",
    slug: "mens-byzantine-chain-dev-men-necklace-002",

    name: "Byzantine Chain",

    category: "Necklace" as Product["category"],
    subcategory: "Chain",

    description:
      "A detailed silver-tone chain with a textured link pattern and substantial profile.",

    state: "PUBLISHED",

    highlights: [
      "Textured Link Design",
      "Premium Stainless Steel",
      "Polished Finish",
      "Statement Styling",
    ],

    base: {
      price: 1299,
      undiscountedPrice: 1599,
      stock: 10,

      images: ["/necklace-2.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Silver",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Necklaces",
        productSubtype: "Chain",
      },
    },

    images: ["/necklace-2.jpg"],

    variants: [],

    tags: ["men", "necklaces", "chains"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-BRACELET-001",
    slug: "mens-gold-cuff-bracelet-dev-men-bracelet-001",

    name: "Gold Cuff Bracelet",

    category: "Bracelet" as Product["category"],
    subcategory: "Bracelet",

    description:
      "A clean gold-tone bracelet with a minimal profile built for effortless everyday styling.",

    state: "PUBLISHED",

    highlights: [
      "Gold-Tone Finish",
      "Minimal Design",
      "Everyday Wear",
      "Premium Construction",
    ],

    base: {
      price: 699,
      undiscountedPrice: 899,
      stock: 20,

      images: ["/bracelet-1.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Gold",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Bracelets",
        productSubtype: "Bracelet",
      },
    },

    images: ["/bracelet-1.jpg"],

    variants: [],

    tags: ["men", "bracelets", "gold"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-BRACELET-002",
    slug: "mens-heavy-chain-bracelet-dev-men-bracelet-002",

    name: "Heavy Chain Bracelet",

    category: "Bracelet" as Product["category"],
    subcategory: "Bracelet",

    description:
      "A substantial silver chain bracelet with a bold profile and polished finish.",

    state: "PUBLISHED",

    highlights: [
      "Heavy Link Design",
      "Premium Stainless Steel",
      "Polished Silver Finish",
      "Statement Styling",
    ],

    base: {
      price: 999,
      undiscountedPrice: 1299,
      stock: 15,

      images: ["/bracelet-2.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Silver",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Bracelets",
        productSubtype: "Bracelet",
      },
    },

    images: ["/bracelet-2.jpg"],

    variants: [],

    tags: ["men", "bracelets", "silver"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-EARRING-001",
    slug: "mens-gold-hoop-earring-dev-men-earring-001",

    name: "Gold Hoop Earring",

    category: "Earring" as Product["category"],
    subcategory: "Earring",

    description:
      "A compact gold-tone hoop designed as a subtle everyday accessory.",

    state: "PUBLISHED",

    highlights: [
      "Gold-Tone Finish",
      "Compact Hoop Design",
      "Lightweight",
      "Everyday Wear",
    ],

    base: {
      price: 499,
      undiscountedPrice: 699,
      stock: 22,

      images: ["/earring-1.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Gold",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Earrings",
        productSubtype: "Earring",
      },
    },

    images: ["/earring-1.jpg"],

    variants: [],

    tags: ["men", "earrings", "gold"],
    currency: "INR",
    brand: "purple_you",
  },

  {
    productId: "DEV-MEN-EARRING-002",
    slug: "mens-textured-hoops-dev-men-earring-002",

    name: "Textured Gold Hoops",

    category: "Earring" as Product["category"],
    subcategory: "Earring",

    description:
      "A pair of compact textured hoops with a polished gold-tone finish.",

    state: "PUBLISHED",

    highlights: [
      "Textured Detail",
      "Gold-Tone Finish",
      "Premium Construction",
      "Everyday Styling",
    ],

    base: {
      price: 599,
      undiscountedPrice: 799,
      stock: 18,

      images: ["/earring-2.jpg"],

      attributes: {
        material: "Stainless Steel",
        finish: "Gold",
      },

      taxonomy: {
        department: "Men",
        category: "Accessories",
        subcategory: "Jewelry",
        productType: "Earrings",
        productSubtype: "Earring",
      },
    },

    images: ["/earring-2.jpg"],

    variants: [],

    tags: ["men", "earrings", "gold"],
    currency: "INR",
    brand: "purple_you",
  },
];
