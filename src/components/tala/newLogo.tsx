import mascot from "@/assets/tala-logo.png";
import { cn } from "@/lib/utils";

export function Mascot({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <img
      src={mascot}
      alt="TALA astronaut companion"
      width={size}
      height={size}
      loading="lazy"
      className={cn("select-none", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function MascotSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <div className="animate-bounce">
        <Mascot size={44} />
      </div>
      <p className="text-xs text-muted-foreground">{label}…</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Mascot size={52} className="opacity-70" />
      <p className="font-display text-sm font-semibold">{title}</p>
      {description ? (
        <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function Wordmark({
  withTagline = false,
  size = 32,
  className,
}: {
  withTagline?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Mascot size={size} />
      <span className="flex flex-col leading-none">
        <span
          className="font-display font-semibold tracking-[0.14em] text-foreground"
          style={{ fontSize: size * 0.52 }}
        >
          TALA
        </span>
        {withTagline ? (
          <span className="mt-1 text-[10px] leading-tight text-muted-foreground">
            Twin-based Astronaut Life Analytics
          </span>
        ) : null}
      </span>
    </span>
  );
}
