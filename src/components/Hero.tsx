import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative h-[400px] sm:h-[600px]">
          <Image
            src="/images/hero1.jpg"
            alt="Purple You Premium Jewelry"
            fill
            className="object-cover"
            priority
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

          {/* Centered overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="space-y-4">
              <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white font-semibold">
                Premium Jewelry for Every Moment
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-wider text-white leading-tight">
                Most Versatile Accessories in Town
              </h1>
              <p className="text-sm sm:text-base text-white/95 max-w-2xl mx-auto font-light leading-relaxed">
                Crafted with care. Designed for you. Made to last.
              </p>
            </div>
            <Link href="/collections/all">
              <button className="mt-6 inline-flex items-center justify-center bg-[#D3C9FF] text-[#111111] px-8 sm:px-12 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-white transition-colors duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
