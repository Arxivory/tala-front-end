import { cn } from "@/lib/utils";

/** "82% of your 1g reference" style chip. */
export function ReferenceDeltaChip({
  value,
  of = "your 1g reference",
  className,
}: {
  value: number | null;
  of?: string;
  className?: string;
}) {
  if (value === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground",
          className,
        )}
      >
        No reference
      </span>
    );
  }
  const tone =
    value >= 70 && value <= 110
      ? "border-status-optimal/40 bg-status-optimal/15 text-status-optimal-text"
      : "border-status-caution/50 bg-status-caution/20 text-status-caution-text";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tnum",
        tone,
        className,
      )}
    >
      {value}% of {of}
    </span>
  );
}
