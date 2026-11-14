import { cn } from "@/lib/utils";

/** Softly pulsing loading ring. */
export function LoadingRing({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={cn("animate-spin [animation-duration:1.4s]", className)}
      aria-label="Loading"
      role="status"
    >
      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-primary-100)" strokeWidth="4" />
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="var(--color-primary-500)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="66 88"
      />
    </svg>
  );
}
