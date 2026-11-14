import { Logo } from "./Logo";
import { DemoTag } from "./DemoTag";

/** Calm scaffold page shown for routes that arrive in a later build stage. */
export function PagePlaceholder({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={className ?? "flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center"}
    >
      <Logo size={56} showCaption={false} />
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-bold text-strong">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <DemoTag label="Scaffold — content arrives in a later build stage" />
    </div>
  );
}
