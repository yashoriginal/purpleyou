import { Product } from "@/types/product";

const API_URL = process.env.API_URL!;

export async function getProductBySlug(
  slug: string
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function getProductsByCollection(
  collection: string
): Promise<Product[]> {
  const res = await fetch(
    `${API_URL}/products?collection=${collection}`,
    { next: { revalidate: 600 } }
  );

  return res.json();
}
