export default function Loading() {
  return (
    <main>
      {/* Page heading skeleton */}
      <section className="border-b border-[var(--border)]">
        <div className="site-container py-10 sm:py-14 lg:py-16">
          <div
            className="
              h-3
              w-24
              animate-pulse
              bg-[var(--surface)]
            "
          />

          <div
            className="
              mt-5
              h-12
              w-[70%]
              max-w-[420px]
              animate-pulse
              bg-[var(--surface)]
              sm:h-14
            "
          />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="site-container py-8 sm:py-10 lg:py-12">
        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-8
            sm:gap-x-5
            md:grid-cols-3
            lg:gap-x-6
            xl:grid-cols-4
          "
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div key={index}>
              {/* Product image */}
              <div
                className="
                  aspect-square
                  w-full
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              {/* Category */}
              <div
                className="
                  mt-4
                  h-2
                  w-16
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              {/* Product name */}
              <div
                className="
                  mt-3
                  h-4
                  w-[80%]
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              {/* Price */}
              <div
                className="
                  mt-3
                  h-3
                  w-20
                  animate-pulse
                  bg-[var(--surface)]
                "
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
