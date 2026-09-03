interface CollectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  productCount: number;
}

export function CollectionHeader({
  eyebrow,
  title,
  description,
  productCount,
}: CollectionHeaderProps) {
  return (
    <header
      className="
        border-b
        border-[var(--border)]
      "
    >
      <div
        className="
          site-container
          pb-10
          pt-14
          sm:pb-14
          sm:pt-18
          lg:pb-16
          lg:pt-24
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-[var(--muted-foreground)]
          "
        >
          {eyebrow}
        </p>

        <div
          className="
            mt-5
            flex
            flex-col
            justify-between
            gap-6
            lg:flex-row
            lg:items-end
          "
        >
          <div>
            <h1
              className="
                text-5xl
                font-medium
                tracking-[-0.045em]
                sm:text-6xl
                lg:text-7xl
              "
            >
              {title}
            </h1>

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-[var(--muted-foreground)]
                sm:text-base
              "
            >
              {description}
            </p>
          </div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.22em]
              text-[var(--muted-foreground)]
            "
          >
            {productCount} {productCount === 1 ? "Piece" : "Pieces"}
          </p>
        </div>
      </div>
    </header>
  );
}
