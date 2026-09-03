export default function CollectionLoading() {
  return (
    <main>
      {/* Collection header */}
      <section className="border-b border-[var(--border)]">
        <div className="site-container py-10 sm:py-12 lg:py-14">
          <div
            className="
              h-2.5
              w-24
              animate-pulse
              bg-[var(--surface)]
            "
          />

          <div
            className="
              mt-5
              h-12
              w-56
              animate-pulse
              bg-[var(--surface)]
              sm:h-14
              sm:w-72
            "
          />

          <div
            className="
              mt-5
              h-3
              w-32
              animate-pulse
              bg-[var(--surface)]
            "
          />
        </div>
      </section>

      <section className="site-container py-6 sm:py-8 lg:py-10">
        {/* Mobile filter bar */}
        <div
          className="
            mb-7
            flex
            items-center
            justify-between
            border-y
            border-[var(--border)]
            py-4
            lg:hidden
          "
        >
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
              h-3
              w-16
              animate-pulse
              bg-[var(--surface)]
            "
          />
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-10
            lg:grid-cols-[240px_minmax(0,1fr)]
            xl:grid-cols-[270px_minmax(0,1fr)]
          "
        >
          {/* Desktop sidebar */}
          <aside
            className="
              hidden
              lg:block
            "
          >
            <div
              className="
                sticky
                top-28
                space-y-8
              "
            >
              {/* Sort */}
              <div>
                <div
                  className="
                    h-3
                    w-16
                    animate-pulse
                    bg-[var(--surface)]
                  "
                />

                <div
                  className="
                    mt-4
                    h-11
                    w-full
                    animate-pulse
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                  "
                />
              </div>

              {/* Categories */}
              <div
                className="
                  border-t
                  border-[var(--border)]
                  pt-7
                "
              >
                <div
                  className="
                    h-3
                    w-24
                    animate-pulse
                    bg-[var(--surface)]
                  "
                />

                <div className="mt-5 space-y-4">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="
                        h-3
                        w-[70%]
                        animate-pulse
                        bg-[var(--surface)]
                      "
                    />
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div
                className="
                  border-t
                  border-[var(--border)]
                  pt-7
                "
              >
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
                    h-4
                    w-[80%]
                    animate-pulse
                    bg-[var(--surface)]
                  "
                />
              </div>

              {/* Price */}
              <div
                className="
                  border-t
                  border-[var(--border)]
                  pt-7
                "
              >
                <div
                  className="
                    h-3
                    w-14
                    animate-pulse
                    bg-[var(--surface)]
                  "
                />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div
                    className="
                      h-10
                      animate-pulse
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                    "
                  />

                  <div
                    className="
                      h-10
                      animate-pulse
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                    "
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
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
                    w-[78%]
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
        </div>
      </section>
    </main>
  );
}
