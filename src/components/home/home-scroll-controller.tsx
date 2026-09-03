"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface HomeScrollControllerProps {
  children: ReactNode;
}

export function HomeScrollController({ children }: HomeScrollControllerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const screens = Array.from(
        container.querySelectorAll<HTMLElement>("[data-home-screen]"),
      );

      if (screens.length === 0) {
        return;
      }

      /*
       * Ignore tiny trackpad movements.
       */
      if (Math.abs(event.deltaY) < 12) {
        return;
      }

      /*
       * Find the screen currently closest
       * to the top of our scroll container.
       */
      const containerTop = container.getBoundingClientRect().top;

      let currentIndex = 0;
      let smallestDistance = Infinity;

      screens.forEach((screen, index) => {
        const distance = Math.abs(
          screen.getBoundingClientRect().top - containerTop,
        );

        if (distance < smallestDistance) {
          smallestDistance = distance;
          currentIndex = index;
        }
      });

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      /*
       * At the very beginning/end,
       * allow normal browser behavior.
       */
      if (nextIndex < 0 || nextIndex >= screens.length) {
        return;
      }

      event.preventDefault();

      /*
       * Prevent trackpad momentum from
       * skipping several screens.
       */
      if (lockedRef.current) {
        return;
      }

      lockedRef.current = true;

      screens[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.setTimeout(() => {
        lockedRef.current = false;
      }, 700);
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <main ref={containerRef} className="home-scroll-shell">
      {children}
    </main>
  );
}
