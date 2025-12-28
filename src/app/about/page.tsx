import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About PURPLE YOU | Premium Fine Jewelry",
  description: "Learn about PURPLE YOU's commitment to sustainable, ethically crafted fine jewelry guaranteed for life.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="relative mx-auto max-w-7xl h-[400px] sm:h-[500px]">
          <Image
            src="/images/hero1.jpg"
            alt="Aurate jewelry craftsmanship"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-end pb-12">
            <div className="px-4 sm:px-8 text-white">
              <h1 className="text-4xl sm:text-5xl font-light tracking-wide">
                About Aurate
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Mission Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#305040] tracking-wide mb-6">
              Our Story
            </h2>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-4">
              Aurate was founded on a simple belief: jewelry should be beautiful, sustainable, and accessible. We create fine jewelry pieces designed to last a lifetime—not just for fashion, but for meaning.
            </p>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-4">
              Every piece in our collection is handcrafted by generational artisans who understand that true luxury isn't about excess—it's about excellence. We use only the finest ethically sourced materials and sustainable practices to ensure our gold, gemstones, and designs are something you can feel good about wearing.
            </p>
            <p className="text-base text-[#6b6b6b] font-light leading-relaxed">
              Real jewelry for real life. Made to withstand whatever life throws your way. Guaranteed for life.
            </p>
          </div>
          <div className="bg-[#f5f2f0] h-80 sm:h-96 rounded-lg overflow-hidden">
            <Image
              src="/images/hero1.jpg"
              alt="Aurate craftspeople"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-light text-[#305040] tracking-wide mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="border-t-2 border-[#305040] pt-6">
              <h3 className="text-lg font-light text-[#305040] tracking-wide mb-3">
                Sustainability
              </h3>
              <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
                Our gold is sustainably sourced and locally casted, polished, and perfected by generational craftsmen. We recycle excess materials and produce pieces on a made-to-order basis to minimize environmental impact.
              </p>
            </div>

            {/* Value 2 */}
            <div className="border-t-2 border-[#305040] pt-6">
              <h3 className="text-lg font-light text-[#305040] tracking-wide mb-3">
                Quality & Craftsmanship
              </h3>
              <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
                Every design goes through a rigorous 5-step testing process. Our commitment to excellence means pieces that shine with brilliance and endure through a lifetime of wear.
              </p>
            </div>

            {/* Value 3 */}
            <div className="border-t-2 border-[#305040] pt-6">
              <h3 className="text-lg font-light text-[#305040] tracking-wide mb-3">
                Ethical Pricing
              </h3>
              <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
                We believe luxury shouldn't come with excessive markups. By keeping operations local and efficient, we deliver exceptional quality at fair prices.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="bg-[#f5f2f0] rounded-lg px-8 sm:px-12 py-12 mb-20">
          <h2 className="text-3xl sm:text-4xl font-light text-[#305040] tracking-wide mb-6">
            Lifetime Guarantee
          </h2>
          <p className="text-base text-[#6b6b6b] font-light leading-relaxed mb-4">
            We stand behind every piece we create. Your Aurate jewelry is guaranteed for life—not just in materials, but in meaning. If anything ever needs adjustment, repair, or care, we're here to help.
          </p>
          <p className="text-base text-[#6b6b6b] font-light leading-relaxed">
            Because jewelry worth keeping is worth keeping forever.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-[#305040] tracking-wide mb-6">
            Discover Our Collection
          </h2>
          <p className="text-base text-[#6b6b6b] font-light mb-8 max-w-2xl mx-auto">
            Explore our curated selection of sustainable, ethically crafted fine jewelry.
          </p>
          <Link href="/collections/all">
            <button className="inline-flex items-center justify-center border border-[#305040] px-12 py-3 text-xs uppercase tracking-[0.15em] text-[#305040] bg-transparent hover:bg-[#305040] hover:text-white transition-colors duration-300">
              Shop Now
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
