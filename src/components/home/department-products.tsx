import { DepartmentProductsClient } from "@/components/home/department-products-client";
import { productMatchesDepartment } from "@/lib/departments";
import { getProducts } from "@/services/products.service";

import type { Product } from "@/types/product";

export async function DepartmentProducts() {
  let womenProducts: Product[] = [];
  let menProducts: Product[] = [];

  try {
    const result = await getProducts({
      limit: 12,
    });

    womenProducts = result.products
      .filter((product) => productMatchesDepartment(product, "women"))
      .slice(0, 6);

    menProducts = result.products
      .filter((product) => productMatchesDepartment(product, "men"))
      .slice(0, 6);
  } catch (error) {
    console.error("Unable to load department products:", error);

    return null;
  }

  if (womenProducts.length === 0 && menProducts.length === 0) {
    return null;
  }

  return (
    <DepartmentProductsClient
      womenProducts={womenProducts}
      menProducts={menProducts}
    />
  );
}
