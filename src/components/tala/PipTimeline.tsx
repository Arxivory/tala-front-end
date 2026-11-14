import { cn } from "@/lib/utils";
import { statusLabel } from "./StatusPill";
import type { RepRecord } from "@/data/types";

const dotColor: Record<string, string> = {
  optimal: "bg-status-optimal",
  caution: "bg-status-caution",
  anomaly: "bg-status-anomaly",
  neutral: "bg-status-neutral",
  "no-data": "bg-muted",
};

/**
 * One pip per rep, grouped by set. Hover shows the rep summary; click can
 * jump a replay to that rep.
 */
export function PipTimeline({
  reps,
  onSelect,
  activeIndex,
  className,
}: {
  reps: RepRecord[];
  onSelect?: (rep: RepRecord) => void;
  activeIndex?: number;
  className?: string;
}) {
  const sets = Array.from(new Set(reps.map((r) => r.set)));
  return (
    <div className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-1", className)} role="listbox" aria-label="Repetitions">
      {sets.map((s, si) => (
        <span key={s} className="flex items-center gap-1.5">
          {si > 0 ? <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" /> : null}
          {reps
            .filter((r) => r.set === s)
            .map((r) => (
              <button
                key={r.index}
                type="button"
                role="option"
                aria-selected={activeIndex === r.index}
                title={`Set ${r.set}, rep ${r.repInSet} · ${r.femoralStrainPct}% of 1g reference · ${statusLabel(r.status)} · ${r.confidence} confidence`}
                onClick={onSelect ? () => onSelect(r) : undefined}
                className={cn(
                  "size-3 rounded-full transition-transform duration-200",
                  dotColor[r.status] ?? "bg-muted",
                  onSelect && "hover:scale-125 cursor-pointer",
                  activeIndex === r.index && "ring-2 ring-primary-700 ring-offset-1 ring-offset-background",
                )}
              />
            ))}
        </span>
      ))}
    </div>
  );
}
