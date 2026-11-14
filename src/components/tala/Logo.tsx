import { cn } from "@/lib/utils";

/**
 * TALA logo mark: a four-point guiding star inside a softly rounded
 * helmet-visor shape, with a tiny heart-shaped negative space at the star's
 * center. Pink-to-lilac gradient fill in light mode; single-color outline in
 * night mode. Pure inline SVG.
 */
export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="tala-logo-grad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-primary-500)" />
          <stop offset="1" stopColor="var(--color-lilac-500)" />
        </linearGradient>
      </defs>
      {/* Helmet visor */}
      <path
        d="M24 4C13.5 4 6 11.5 6 22.5V33c0 6.1 4.9 11 11 11h14c6.1 0 11-4.9 11-11V22.5C42 11.5 34.5 4 24 4Z"
        className="fill-[url(#tala-logo-grad)] dark:fill-none dark:stroke-[2.5]"
        stroke="currentColor"
      />
      {/* Four-point star with heart negative space */}
      <path
        d="M24 12c1.2 6.4 5.6 10.8 12 12-6.4 1.2-10.8 5.6-12 12-1.2-6.4-5.6-10.8-12-12 6.4-1.2 10.8-5.6 12-12Z"
        className="fill-background dark:fill-current"
      />
      {/* Tiny heart at the center */}
      <path
        d="M24 26.2c-1.9-1.7-3.2-2.8-3.2-4.2 0-1.1.8-1.9 1.9-1.9.7 0 1.2.3 1.3.8.1-.5.6-.8 1.3-.8 1.1 0 1.9.8 1.9 1.9 0 1.4-1.3 2.5-3.2 4.2Z"
        className="fill-[url(#tala-logo-grad)] dark:fill-background"
      />
    </svg>
  );
}

export function Logo({
  className,
  size = 40,
  showCaption = true,
  captionClassName,
}: {
  className?: string;
  size?: number;
  showCaption?: boolean;
  captionClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          className="font-display font-extrabold tracking-wide text-strong"
          style={{ fontSize: size * 0.42 }}
        >
          TALA
        </span>
        {showCaption ? (
          <span
            className={cn("mt-1 text-muted-foreground", captionClassName)}
            style={{ fontSize: Math.max(10, size * 0.16) }}
          >
            Twin-based Astronaut Life Analytics
          </span>
        ) : null}
      </span>
    </span>
  );
}
