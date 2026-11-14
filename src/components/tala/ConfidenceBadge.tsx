import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const labels = { high: "High", medium: "Medium", low: "Low" } as const;

const filled = { high: 3, medium: 2, low: 1 } as const;

/**
 * Three-dot confidence badge with a tooltip explaining what the dots mean.
 */
export function ConfidenceBadge({
  level,
  className,
}: {
  level: "high" | "medium" | "low";
  className?: string;
}) {
  const dots = filled[level];
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
              "border-border bg-muted/60",
              className,
            )}
            aria-label={`Model confidence: ${labels[level]}`}
          >
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "size-1.5 rounded-full",
                    i < dots ? "bg-lilac-500" : "bg-border",
                  )}
                />
              ))}
            </span>
            <span className="text-xs font-medium text-body">{labels[level]}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-xs">
          Model confidence: {labels[level]}. Based on pose-tracking quality for this estimate. Low
          confidence suppresses flags.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
