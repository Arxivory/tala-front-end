import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { IconCamera } from "./icons";
import { statusCopy, type StrainStatus } from "@/lib/mock-data";
import cameraStill from "@/assets/camera-feed.jpg";

export function StatusChip({
  status,
  label,
  className,
}: {
  status: StrainStatus;
  label?: string | undefined;
  className?: string | undefined;
}) {
  const tone =
    status === "safe"
      ? "bg-safe/60 text-safe-ink"
      : status === "caution"
        ? "bg-caution/60 text-caution-ink"
        : "bg-risk/60 text-risk-ink";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label ?? statusCopy[status]}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border-soft bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  support,
  align = "left",
  className,
}: {
  eyebrow?: string | undefined;
  title: string;
  support?: string | undefined;
  align?: "left" | "center";
  className?: string | undefined;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="text-display mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {support ? <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{support}</p> : null}
    </div>
  );
}

export function PanelHeader({
  title,
  support,
  action,
}: {
  title: string;
  support?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {support ? <p className="mt-1 text-xs text-muted-foreground">{support}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Metric({
  value,
  label,
  hint,
  className,
}: {
  value: string;
  label: string;
  hint?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("card-soft p-5", className)}>
      <p className="num-lg text-3xl">{value}</p>
      <p className="mt-2 text-xs font-medium text-foreground">{label}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Mocked camera feed panel — paired with the twin viewport everywhere. */
export function CameraPanel({
  className = "h-[360px]",
  label = "Cabin camera · tracking active",
  quiet = false,
}: {
  className?: string | undefined;
  label?: string | undefined;
  quiet?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-foreground/90", className)}>
      <img
        src={cameraStill}
        alt="Mocked cabin camera view of an astronaut exercising"
        loading="lazy"
        className="photo-tint h-full w-full object-cover opacity-90"
      />
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-background/40" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-[11px] font-medium">
        <span className={cn("size-1.5 rounded-full", quiet ? "bg-muted-foreground" : "bg-risk-ink animate-pulse")} />
        {label}
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-[11px] text-muted-foreground">
        <IconCamera size={14} /> 1080p · 30 fps · markerless
      </div>
    </div>
  );
}

export function NavItem({
  to,
  icon,
  label,
  exact = false,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-foreground"
    >
      <span className="text-muted-foreground group-hover:text-primary-strong group-data-[status=active]:text-primary-strong">
        {icon}
      </span>
      {label}
    </Link>
  );
}
