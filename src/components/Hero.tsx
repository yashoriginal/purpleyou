import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#4e1d1a] text-white">
      <div className="relative mx-auto max-w-6xl">
        <div className="relative h-[520px] sm:h-[640px]">
          <Image
            src="/images/hero1.jpg"
            alt="Purple You tennis bracelets"
            fill
            className="object-cover"
            priority
          />

          {/* Dark gradient overlay (optional) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-white/10 to-transparent" />

          {/* CENTERED overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center bottom-24 ">
            <p className="text-xs tracking-[0.25em] uppercase">
              Holiday Sale!
            </p>
            <h1 className="text-4xl sm:text-5xl font-light tracking-[0.1em]">
              25% OFF
            </h1>
            <button className="mt-2 inline-flex items-center justify-center border border-white/80 px-10 py-3 text-xs uppercase tracking-[0.25em] bg-transparent hover:bg-white hover:text-[#4e1d1a] transition-colors duration-200">
              Shop now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
