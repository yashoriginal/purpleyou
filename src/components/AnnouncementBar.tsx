"use client";

import { useEffect, useState } from "react";

const SALE_END = new Date(Date.now() + 16 * 60 * 60 * 1000);

function formatRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "00 : 00 : 00";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

export default function AnnouncementBar() {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState("00 : 00 : 00");

  useEffect(() => {
    setMounted(true); // now we are on client
    setRemaining(formatRemaining(SALE_END));

    const id = setInterval(() => {
      setRemaining(formatRemaining(SALE_END));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // While SSR, render stable markup without time text
  return (
    <div className="w-full bg-purpleDeep text-white text-xs sm:text-sm">
      <div className="mx-auto max-w-6xl flex items-center justify-center gap-3 py-2 px-4">
        <span className="uppercase tracking-wide">
          Final hours  25% off! Use code: HOLIDAY
        </span>
        <span className="font-semibold tabular-nums">
          {mounted ? remaining : "  -- : -- : --  "}
        </span>
      </div>
    </div>
  );
}
