import type { ReactNode } from "react";

import { TalaAvatar } from "./TalaAvatar";

/** Empty state: Tala avatar, one calm line, one button. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "flex flex-col items-center justify-center gap-4 py-12 text-center"}>
      <TalaAvatar size={64} />
      <div>
        <p className="font-display text-lg font-semibold text-strong">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
