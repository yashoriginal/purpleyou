export function AnnouncementBar() {
  return (
    <div
      className="
        relative
        z-[110]
        block
        w-full
        shrink-0
        border-b
        border-white/10
        bg-black
        text-white
      "
    >
      <div
        className="
          flex
          h-[42px]
          w-full
          items-center
          justify-center
          px-4
          sm:h-[44px]
          lg:h-[46px]
        "
      >
        <p
          className="
            whitespace-nowrap
            text-center
            text-[10px]
            font-medium
            tracking-[0.055em]
            min-[375px]:text-[11px]
            sm:text-xs
            lg:text-[14px]
            lg:tracking-[0.07em]
          "
        >
          Standard Shipping ₹30 on all orders
          <span className="mx-1.5 text-white/50">•</span>
          Delivered within 7 days
        </p>
      </div>
    </div>
  );
}
