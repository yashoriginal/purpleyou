export default function SearchLoading() {
  return (
    <main>
      {/* Search header */}
      <section className="border-b border-[var(--border)]">
        <div className="site-container py-10 sm:py-12 lg:py-14">
          <div
            className="
              h-2.5
              w-20
              animate-pulse
              bg-[var(--surface)]
            "
          />

          <div
            className="
              mt-5
              h-12
              w-[70%]
              max-w-[520px]
              animate-pulse
              bg-[var(--surface)]
              sm:h-14
            "
          />

          <div
            className="
              mt-5
              h-3
              w-36
              animate-pulse
              bg-[var(--surface)]
            "
          />
        </div>
      </section>

      {/* Results */}
      <section className="site-container py-8 sm:py-10 lg:py-12">
        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-8
            sm:gap-x-5
            md:grid-cols-3
            lg:grid-cols-4
            lg:gap-x-6
          "
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div key={index}>
              <div
                className="
                  mx-auto
                  aspect-square
                  w-full
                  max-w-[250px]
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              <div
                className="
                  mt-4
                  h-2
                  w-16
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              <div
                className="
                  mt-3
                  h-4
                  w-[80%]
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

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
