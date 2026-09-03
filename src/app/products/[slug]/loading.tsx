export default function ProductLoading() {
  return (
    <main>
      <section className="site-container py-6 sm:py-8 lg:py-12">
        <div
          className="
            grid
            grid-cols-1
            gap-10
            lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]
            lg:gap-16
          "
        >
          {/* Product image */}
          <div>
            <div
              className="
                mx-auto
                aspect-square
                w-[82%]
                max-w-[420px]
                animate-pulse
                bg-[var(--surface)]
                sm:w-full
                sm:max-w-[540px]
                lg:max-w-[680px]
              "
            />
          </div>

          {/* Product information */}
          <div className="lg:pt-6">
            {/* Category */}
            <div
              className="
                h-2.5
                w-24
                animate-pulse
                bg-[var(--surface)]
              "
            />

            {/* Product name */}
            <div
              className="
                mt-7
                h-14
                w-[85%]
                animate-pulse
                bg-[var(--surface)]
                sm:h-16
              "
            />

            <div
              className="
                mt-3
                h-14
                w-[55%]
                animate-pulse
                bg-[var(--surface)]
                sm:h-16
              "
            />

            {/* Price */}
            <div
              className="
                mt-10
                h-6
                w-32
                animate-pulse
                bg-[var(--surface)]
              "
            />

            {/* Stock */}
            <div
              className="
                mt-10
                border-y
                border-[var(--border)]
                py-6
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
            </div>

            {/* Description */}
            <div className="mt-8 space-y-3">
              <div
                className="
                  h-3
                  w-full
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              <div
                className="
                  h-3
                  w-[92%]
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              <div
                className="
                  h-3
                  w-[68%]
                  animate-pulse
                  bg-[var(--surface)]
                "
              />
            </div>

            {/* Variant / purchase area */}
            <div
              className="
                mt-10
                border-t
                border-[var(--border)]
                pt-8
              "
            >
              <div
                className="
                  h-3
                  w-20
                  animate-pulse
                  bg-[var(--surface)]
                "
              />

              <div
                className="
                  mt-5
                  grid
                  grid-cols-3
                  gap-3
                "
              >
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-12
                      animate-pulse
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                    "
                  />
                ))}
              </div>

              {/* Add to bag */}
              <div
                className="
                  mt-7
                  h-14
                  w-full
                  animate-pulse
                  bg-[var(--surface)]
                "
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
