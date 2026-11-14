import { Table2, ChartLine } from "lucide-react";

import { cn } from "@/lib/utils";

/** Toggle shown next to every chart: switch between chart and table view. */
export function ViewAsTableToggle({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={open}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1",
        "text-xs font-medium text-body hover:bg-muted",
        className,
      )}
    >
      {open ? (
        <>
          <ChartLine className="size-3.5" aria-hidden="true" /> View as chart
        </>
      ) : (
        <>
          <Table2 className="size-3.5" aria-hidden="true" /> View as table
        </>
      )}
    </button>
  );
}
