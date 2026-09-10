"use client";

import dynamic from "next/dynamic";

const CheckoutContent = dynamic(
  () =>
    import("@/components/checkout/checkout-content").then(
      (module) => module.CheckoutContent,
    ),
  {
    ssr: false,

    loading: () => <CheckoutClientLoading />,
  },
);

export function CheckoutClient() {
  return <CheckoutContent />;
}

function CheckoutClientLoading() {
  return (
    <div
      className="
        site-container
        flex
        min-h-[60vh]
        items-center
        justify-center
      "
    >
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-[var(--muted-foreground)]
        "
      >
        Loading checkout...
      </p>
    </div>
  );
}
