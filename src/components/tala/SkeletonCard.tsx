import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

/** Soft loading placeholder matching the card layout. */
export function SkeletonCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft", className)}>
      <Skeleton className="h-4 w-1/3 rounded-full" />
      <div className="mt-4 space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full rounded-full" style={{ width: `${90 - i * 18}%` }} />
        ))}
      </div>
    </div>
  );
}
