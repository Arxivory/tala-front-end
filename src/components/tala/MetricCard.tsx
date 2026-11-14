import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

import { ConfidenceBadge } from "./ConfidenceBadge";
import { InfoTooltip } from "./InfoTooltip";
import { SparklineWithBand } from "./SparklineWithBand";
import { StatusPill } from "./StatusPill";

import { cn } from "@/lib/utils";
import type { StatusLevel } from "@/data/types";

/**
 * Metric card: title, big tabular value + unit, optional delta vs the 1g
 * reference, status pill, confidence badge, mini sparkline and an optional
 * hover "View trend" link. Every model-derived number carries its unit and a
 * status/confidence affordance.
 */
export function MetricCard({
  title,
  value,
  unit,
  delta,
  status,
  confidence,
  sparkline,
  band,
  tooltip,
  trendTo,
  footnote,
  className,
  children,
}: {
  title: string;
  value: string | number;
  unit?: string;
  delta?: { text: string; direction: "up" | "down" | "flat" };
  status?: StatusLevel;
  confidence?: "high" | "medium" | "low";
  sparkline?: number[];
  band?: { lower: number[]; upper: number[] } | { lower: number; upper: number };
  tooltip?: string;
  trendTo?: string;
  footnote?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow duration-200 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="flex items-center gap-1.5">
          {confidence ? <ConfidenceBadge level={confidence} /> : null}
          {tooltip ? <InfoTooltip>{tooltip}</InfoTooltip> : null}
        </span>
      </div>
      {children ? (
        children
      ) : (
        <p className="font-display text-3xl font-bold tnum text-strong">
          {value}
          {unit ? <span className="ml-1.5 text-base font-semibold text-muted-foreground">{unit}</span> : null}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {status ? <StatusPill status={status} size="small" /> : null}
          {delta ? (
            <span
              className={cn(
                "text-xs font-medium tnum",
                delta.direction === "up" && "text-status-caution-text",
                delta.direction === "down" && "text-status-optimal-text",
                delta.direction === "flat" && "text-muted-foreground",
              )}
            >
              {delta.text}
            </span>
          ) : null}
        </span>
        {sparkline ? (
          <SparklineWithBand data={sparkline} band={band} className="w-24 text-primary-700" />
        ) : null}
      </div>
      {footnote ? <p className="text-xs text-muted-foreground">{footnote}</p> : null}
      {trendTo ? (
        <Link
          to={trendTo}
          className="absolute inset-x-5 bottom-4 hidden items-center gap-1 text-xs font-medium text-primary-700 group-hover:flex"
        >
          <TrendingUp className="size-3.5" aria-hidden="true" />
          View trend
        </Link>
      ) : null}
    </div>
  );
}
