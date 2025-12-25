import Link from "next/link";
import { products } from "@/lib/data";

export const revalidate = 600;

export default function CollectionsIndex() {
  const categories = Array.from(
    new Set(products.map((p) => p.category.toLowerCase()))
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Collections</h1>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <li key={cat}>
            <Link
              href={`/collections/${cat}`}
              className="block rounded-lg border p-4 text-center hover:shadow"
            >
              <span className="capitalize">{cat.replace("-", " ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
