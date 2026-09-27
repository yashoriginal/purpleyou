import { DepartmentCategoryCarousel } from "@/components/home/department-category-carousel";
import { productMatchesDepartment } from "@/lib/departments";
import { getProducts } from "@/services/products.service";

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  rings: "/ring-1.jpg",
  necklaces: "/necklace-1.jpg",
  bracelets: "/bracelet-1.jpg",
  earrings: "/earring-1.jpg",
};

const PREFERRED_ORDER = [
  "rings",
  "necklaces",
  "bracelets",
  "earrings",
  "anklets",
];

export async function CategoryShowcase() {
  try {
    const { products } = await getProducts({ limit: 100 });

    const categoryMap = new Map<
      string,
      {
        title: string;
        collection: string;
        productType: string;
        womenImage: string | null;
        menImage: string | null;
        womenCount: number;
        menCount: number;
        fallbackImage?: string | null;
      }
    >();

    for (const product of products) {
      const rawType =
        product.base?.taxonomy?.productType?.trim() ||
        product.category?.trim();

      if (!rawType) continue;

      const collection = rawType.toLowerCase();
      const title =
        rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();

      if (!categoryMap.has(collection)) {
        categoryMap.set(collection, {
          title,
          collection,
          productType: rawType,
          womenImage: null,
          menImage: null,
          womenCount: 0,
          menCount: 0,
          fallbackImage: FALLBACK_CATEGORY_IMAGES[collection] ?? null,
        });
      }

      const entry = categoryMap.get(collection)!;
      const isWomen = productMatchesDepartment(product, "women");
      const isMen = productMatchesDepartment(product, "men");

      if (isWomen) {
        entry.womenCount++;
        if (!entry.womenImage && product.images.length > 0) {
          entry.womenImage = product.images[0];
        }
      }

      if (isMen) {
        entry.menCount++;
        if (!entry.menImage && product.images.length > 0) {
          entry.menImage = product.images[0];
        }
      }
    }

    const categories = Array.from(categoryMap.values());

    categories.sort((a, b) => {
      const indexA = PREFERRED_ORDER.indexOf(a.collection);
      const indexB = PREFERRED_ORDER.indexOf(b.collection);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.title.localeCompare(b.title);
    });

    return <DepartmentCategoryCarousel categories={categories} />;
  } catch (error) {
    console.error("Unable to load category showcase:", error);
    return null;
  }
}

