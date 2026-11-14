import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/app/session/live")({
  head: () =>
    pageHead({
      title: "TALA Recorded Session Demo — Crew Operations Portal",
      description:
        "Live capture and inference are not part of this demo. Use the record-and-review workflow.",
    }),
  component: LiveSessionNotice,
});

function LiveSessionNotice() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-12">
      <h1 className="font-display text-2xl font-bold text-strong">
        Live capture is not part of this demo
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        TALA currently demonstrates a record, compute, and review flow using precomputed research
        results. Continue to the session workflow to review the available recording.
      </p>
      <Link
        to="/app/session"
        className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Open session workflow
      </Link>
    </main>
  );
}
