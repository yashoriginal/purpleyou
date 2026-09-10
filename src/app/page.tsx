import { CategoryShowcase } from "@/components/home/category-showcase";
import { HomeHero } from "@/components/home/home-hero";
import { HomeScrollController } from "@/components/home/home-scroll-controller";
import { Footer } from "@/components/layout/footer";
import { DepartmentProducts } from "@/components/home/department-products";

export default function HomePage() {
  return (
    <HomeScrollController>
      <section data-home-screen className="home-scroll-screen">
        <HomeHero />
      </section>

      <section data-home-screen className="home-scroll-screen">
        <CategoryShowcase />
      </section>
      <section data-home-screen className="home-scroll-screen">
        <DepartmentProducts />
      </section>
      <section
        data-home-screen
        className="
    home-scroll-screen
    home-scroll-screen-natural
  "
      >
        <Footer />
      </section>
    </HomeScrollController>
  );
}
