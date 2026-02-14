import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-light text-[#111111] tracking-wide mb-4">
          Page not found
        </h1>
        <p className="text-[#6b6b6b] mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <button className="bg-[#5540b7] text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors">
            Go Home
          </button>
        </Link>
      </div>
    </section>
  );
}
