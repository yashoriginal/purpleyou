import { DepartmentCategoryCarousel } from "@/components/home/department-category-carousel";
import { productMatchesDepartment } from "@/lib/departments";
import { getCategoryShowcaseProducts } from "@/services/products.service";

const categories = [
  {
    title: "Rings",
    productType: "Rings",
    collection: "rings",
    fallbackImage: "/ring-1.jpg",
  },
  {
    title: "Necklaces",
    productType: "Necklaces",
    collection: "necklaces",
    fallbackImage: "/necklace-1.jpg",
  },
  {
    title: "Bracelets",
    productType: "Bracelets",
    collection: "bracelets",
    fallbackImage: "/bracelet-1.jpg",
  },
  {
    title: "Earrings",
    productType: "Earrings",
    collection: "earrings",
    fallbackImage: "/earring-1.jpg",
  },
];

export async function CategoryShowcase() {
  const results = await Promise.all(
    categories.map(async (category) => {
      try {
        const products = await getCategoryShowcaseProducts(
          category.productType,
        );

        const womenProduct = products.find((product) =>
          productMatchesDepartment(product, "women"),
        );

        const menProduct = products.find((product) =>
          productMatchesDepartment(product, "men"),
        );

        return {
          ...category,
          womenImage: womenProduct?.images[0] ?? null,
          menImage: menProduct?.images[0] ?? null,
        };
      } catch (error) {
        console.error(`Unable to load ${category.title}:`, error);

        return {
          ...category,
          womenImage: null,
          menImage: null,
        };
      }
    }),
  );

  return <DepartmentCategoryCarousel categories={results} />;
}
