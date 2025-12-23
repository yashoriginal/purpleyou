import ProductGrid from "@/components/product/ProductGrid";
import { getProductsByCollection } from "@/services/product.service";

export const revalidate = 600;

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const products = await getProductsByCollection(params.slug);

  return (
    <>
      <h1 className="text-xl font-medium capitalize">
        {params.slug.replace("-", " ")}
      </h1>

      <ProductGrid products={products} />
    </>
  );
}
