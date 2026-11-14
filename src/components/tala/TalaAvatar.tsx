import { cn } from "@/lib/utils";

/**
 * "Tala" companion avatar: a calm glowing star-orb with no facial
 * expression. Used in the assistant, onboarding and empty states.
 */
export function TalaAvatar({
  className,
  size = 48,
  glow = true,
}: {
  className?: string;
  size?: number;
  glow?: boolean;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {glow ? (
        <span
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: "var(--color-lilac-500)", opacity: 0.35 }}
        />
      ) : null}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="relative">
        <defs>
          <radialGradient id="tala-orb" cx="0.38" cy="0.32" r="0.85">
            <stop offset="0" stopColor="var(--color-primary-100)" />
            <stop offset="0.55" stopColor="var(--color-primary-300)" />
            <stop offset="1" stopColor="var(--color-lilac-500)" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#tala-orb)" />
        <circle cx="24" cy="24" r="20" stroke="var(--color-primary-700)" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />
        {/* small four-point star */}
        <path
          d="M24 14c0.7 4 3.3 6.6 7.3 7.3-4 0.7-6.6 3.3-7.3 7.3-0.7-4-3.3-6.6-7.3-7.3 4-0.7 6.6-3.3 7.3-7.3Z"
          fill="var(--color-background)"
          opacity="0.9"
        />
        <circle cx="24" cy="21.4" r="1.6" fill="var(--color-primary-700)" opacity="0.55" />
      </svg>
    </span>
  );
}
