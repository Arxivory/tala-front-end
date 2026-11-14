import { cn } from "@/lib/utils";

/** Dashed tag marking anything mocked (sync, compression, mission control…). */
export function DemoTag({ className, label = "Demo placeholder" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-dashed border-lilac-300 px-1.5 py-0.5",
        "text-[11px] font-medium text-body",
        className,
      )}
    >
      {label}
    </span>
  );
}
