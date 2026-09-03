"use client";

import { useEffect, useState } from "react";

import { CollectionSidebar } from "@/components/collection/collection-sidebar";

interface MobileCollectionFiltersProps {
  productCount: number;
  minAvailablePrice?: number;
  maxAvailablePrice?: number;
}

export function MobileCollectionFilters({
  productCount,
  minAvailablePrice,
  maxAvailablePrice,
}: MobileCollectionFiltersProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--border)]
          py-5
          lg:hidden
        "
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.2em]
          "
        >
          Filter & Sort
        </button>

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-[var(--muted-foreground)]
          "
        >
          {productCount} {productCount === 1 ? "Piece" : "Pieces"}
        </p>
      </div>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            lg:hidden
          "
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="
              absolute
              inset-0
              bg-black/70
            "
          />

          {/* Drawer */}
          <div
            className="
              absolute
              bottom-0
              right-0
              top-0
              w-[92%]
              max-w-[430px]
              overflow-y-auto
              border-l
              border-[var(--border)]
              bg-[var(--background)]
            "
          >
            <div
              className="
                sticky
                top-0
                z-10
                flex
                items-center
                justify-between
                border-b
                border-[var(--border)]
                bg-[var(--background)]
                px-5
                py-5
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-[var(--muted-foreground)]
                  "
                >
                  PurpleYou
                </p>

                <h2
                  className="
                    mt-1
                    text-xl
                    font-medium
                  "
                >
                  Filter & Sort
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setOpen(false)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-3xl
                  font-light
                "
              >
                ×
              </button>
            </div>

            <div className="px-5 py-2">
              <CollectionSidebar
                productCount={productCount}
                minAvailablePrice={minAvailablePrice}
                maxAvailablePrice={maxAvailablePrice}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
