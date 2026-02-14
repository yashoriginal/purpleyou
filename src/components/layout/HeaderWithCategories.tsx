import Header from "./Header";
import { getAllCategories } from "@/services/product.service";

export default async function HeaderWithCategories() {
  const categories = await getAllCategories();

  return <Header categories={categories} />;
}
