import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HomeHero } from "@/components/home/home-hero";
import { HomeScrollController } from "@/components/home/home-scroll-controller";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <HomeScrollController>
      <section data-home-screen className="home-scroll-screen">
        <HomeHero />
      </section>

      <section data-home-screen className="home-scroll-screen">
        <FeaturedProducts />
      </section>

      <section data-home-screen className="home-scroll-screen">
        <CategoryShowcase />
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
