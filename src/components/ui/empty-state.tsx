import Link from "next/link";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;

  primaryAction?: {
    label: string;
    href: string;
  };

  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <section
      className="
        flex
        min-h-[420px]
        items-center
        justify-center
        border
        border-[var(--border)]
        px-6
        py-16
        text-center
        sm:min-h-[480px]
        sm:px-10
      "
    >
      <div className="mx-auto max-w-lg">
        {eyebrow && (
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
        )}

        <h2
          className="
            mt-4
            text-3xl
            font-medium
            tracking-[-0.035em]
            sm:text-4xl
            lg:text-5xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mx-auto
            mt-5
            max-w-md
            text-sm
            leading-7
            text-[var(--muted-foreground)]
          "
        >
          {description}
        </p>

        {(primaryAction || secondaryAction) && (
          <div
            className="
              mt-9
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="
                  flex
                  min-h-12
                  min-w-[170px]
                  items-center
                  justify-center
                  bg-[var(--foreground)]
                  px-6
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[var(--background)]
                  transition-opacity
                  hover:opacity-80
                "
              >
                {primaryAction.label}
              </Link>
            )}

            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="
                  flex
                  min-h-12
                  min-w-[170px]
                  items-center
                  justify-center
                  border
                  border-[var(--border)]
                  px-6
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  transition-colors
                  hover:border-[var(--foreground)]
                "
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
