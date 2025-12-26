import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative h-[400px] sm:h-[600px]">
          <Image
            src="/images/hero1.jpg"
            alt="Aurate sustainable fine jewelry"
            fill
            className="object-cover"
            priority
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Centered overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="space-y-4">
              <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white font-light">
                Sustainable Fine Jewelry
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[0.05em] text-white leading-tight">
                Real jewelry for real life
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                Made to withstand whatever life throws your way. Guaranteed for life.
              </p>
            </div>
            <Link href="/collections/all">
              <button className="mt-4 inline-flex items-center justify-center border border-white px-8 sm:px-12 py-3 text-xs uppercase tracking-[0.15em] text-white bg-transparent hover:bg-white hover:text-[#305040] transition-colors duration-300">
                Explore Collection
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
