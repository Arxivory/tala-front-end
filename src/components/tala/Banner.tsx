import { Info, AlertTriangle, OctagonAlert, ShieldAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

type BannerVariant = "info" | "caution" | "anomaly" | "emergency";

const styles: Record<BannerVariant, { className: string; icon: typeof Info }> = {
  info: { className: "border-sky-300/60 bg-sky-100/70 text-body", icon: Info },
  caution: { className: "border-status-caution/60 bg-status-caution/15 text-status-caution-text", icon: AlertTriangle },
  anomaly: { className: "border-status-anomaly/60 bg-status-anomaly/15 text-status-anomaly-text", icon: OctagonAlert },
  emergency: { className: "border-status-anomaly/70 bg-status-anomaly/20 text-status-anomaly-text", icon: ShieldAlert },
};

/**
 * Calm banner with icon + text. Anomaly banners require explicit dismissal;
 * emergency banners never auto-hide.
 */
export function Banner({
  variant = "info",
  title,
  children,
  onDismiss,
  className,
}: {
  variant?: BannerVariant;
  title?: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const s = styles[variant];
  const Icon = s.icon;
  return (
    <div
      role={variant === "anomaly" || variant === "emergency" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        s.className,
        className,
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        {children ? <div className="text-sm leading-relaxed opacity-90">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 hover:bg-background/40"
          aria-label="Dismiss"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
