"use client";

import { useState } from "react";

interface ProductGalleryProps {
  productName: string;
  images: string[];
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] ?? null;

  const hasMultipleImages = images.length > 1;

  if (!selectedImage) {
    return (
      <div
        className="
          mx-auto
          flex
          aspect-square
          w-[82%]
          max-w-[420px]
          items-center
          justify-center
          bg-[var(--surface)]
          sm:w-full
          sm:max-w-[520px]
          lg:max-w-[620px]
        "
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.22em]
            text-[var(--muted-foreground)]
          "
        >
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <div
      className={
        hasMultipleImages
          ? `
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-[76px_minmax(0,1fr)]
            `
          : "block"
      }
    >
      {/* Thumbnails */}
      {hasMultipleImages && (
        <div
          className="
            order-2
            flex
            gap-3
            overflow-x-auto
            sm:order-1
            sm:flex-col
            sm:overflow-visible
          "
        >
          {images.map((image, index) => {
            const selected = selectedIndex === index;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`View ${productName} image ${index + 1}`}
                aria-pressed={selected}
                onClick={() => setSelectedIndex(index)}
                className={`
                    relative
                    aspect-square
                    w-[72px]
                    shrink-0
                    overflow-hidden
                    border
                    bg-[var(--surface)]
                    transition
                    ${
                      selected
                        ? "border-[var(--foreground)]"
                        : "border-[var(--border)] opacity-65 hover:opacity-100"
                    }
                  `}
              >
                <span
                  className="
                      absolute
                      inset-1
                      bg-contain
                      bg-center
                      bg-no-repeat
                    "
                  style={{
                    backgroundImage: `url("${image}")`,
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main image */}
      <div
        className={`
          min-w-0
          ${hasMultipleImages ? "order-1 sm:order-2" : ""}
        `}
      >
        <div
          role="img"
          aria-label={`${productName} image ${selectedIndex + 1}`}
          className="
            mx-auto
            aspect-square

            w-[82%]
            max-w-[420px]

            bg-[var(--surface)]
            bg-contain
            bg-center
            bg-no-repeat

            sm:w-full
            sm:max-w-[540px]

            lg:max-w-[680px]
          "
          style={{
            backgroundImage: `url("${selectedImage}")`,
          }}
        />

        {hasMultipleImages && (
          <p
            className="
              mx-auto
              mt-3
              w-[82%]
              max-w-[420px]
              text-right
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-[var(--muted-foreground)]

              sm:w-full
              sm:max-w-[540px]

              lg:max-w-[680px]
            "
          >
            {selectedIndex + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
