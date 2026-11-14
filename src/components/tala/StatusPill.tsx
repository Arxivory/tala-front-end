import { CheckCircle2, AlertTriangle, OctagonAlert, MinusCircle, CircleDashed } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StatusLevel } from "@/data/types";

const config: Record<
  StatusLevel,
  { label: string; icon: typeof CheckCircle2; className: string } | null
> = {
  optimal: {
    label: "Optimal",
    icon: CheckCircle2,
    className: "bg-status-optimal/20 text-status-optimal-text border-status-optimal/40",
  },
  caution: {
    label: "Caution",
    icon: AlertTriangle,
    className: "bg-status-caution/25 text-status-caution-text border-status-caution/50",
  },
  anomaly: {
    label: "Anomaly",
    icon: OctagonAlert,
    className: "bg-status-anomaly/25 text-status-anomaly-text border-status-anomaly/50",
  },
  neutral: {
    label: "Neutral",
    icon: MinusCircle,
    className: "bg-status-neutral/25 text-body border-status-neutral/50",
  },
  "no-data": {
    label: "No data",
    icon: CircleDashed,
    className: "bg-muted text-muted-foreground border-border",
  },
};

/** Status is always color + icon + text label, never color alone. */
export function StatusPill({
  status,
  className,
  size = "default",
}: {
  status: StatusLevel;
  className?: string;
  size?: "default" | "small";
}) {
  const c = config[status];
  if (!c) return null;
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "small" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        c.className,
      )}
    >
      <Icon className={size === "small" ? "size-3.5" : "size-4"} aria-hidden="true" />
      {c.label}
    </span>
  );
}

export function statusLabel(status: StatusLevel): string {
  return config[status]?.label ?? status;
}
