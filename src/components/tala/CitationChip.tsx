import { BookOpen } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { DemoTag } from "./DemoTag";

import { cn } from "@/lib/utils";
import { documents } from "@/data/documents";

/**
 * Lilac citation chip. Clicking opens a side sheet with the document ID,
 * section, page and highlighted excerpt. Falls back to an "Unverified"
 * notice when the excerpt is not in the loaded library.
 */
export function CitationChip({
  citation,
  className,
}: {
  /** e.g. "NASA-STD-3001, 6.4" */
  citation: string;
  className?: string;
}) {
  const [documentId, sectionStart = ""] = citation.split(",").map((s) => s.trim());
  const doc = documents.find(
    (d) => d.documentId === documentId && d.section.startsWith(sectionStart),
  );
  const unverified = !doc || !doc.verified;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-lilac-300/70 bg-lilac-100 px-2.5 py-1",
            "text-xs font-medium text-body transition-colors hover:bg-lilac-100/70",
            unverified && "border-status-caution/60 bg-status-caution/15",
            className,
          )}
        >
          <BookOpen className="size-3.5" aria-hidden="true" />
          {citation}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-lg text-strong">Source</SheetTitle>
        </SheetHeader>
        {doc ? (
          <div className="flex flex-col gap-4 px-4 pb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-strong">{doc.documentId}</span>
              <span className="text-muted-foreground">· {doc.version}</span>
              {!doc.verified ? <DemoTag label="Unverified" /> : null}
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
              <span className="text-muted-foreground">Section</span>
              <span className="text-body">{doc.section}</span>
              <span className="text-muted-foreground">Page</span>
              <span className="tnum text-body">{doc.page}</span>
            </div>
            <div className="rounded-xl border border-border bg-raised p-4">
              <p className="text-xs font-medium text-muted-foreground">Excerpt</p>
              <p className="mt-2 rounded-md bg-primary-100 p-3 text-sm leading-relaxed text-body">
                {doc.excerpt}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Decision support, not diagnosis. Guidance cites loaded documents only.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4 pb-8">
            <DemoTag label="Unverified" />
            <p className="text-sm text-body">
              This citation is not in the loaded document library on this device. Ask the CMO or
              the ground team for the source text.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
