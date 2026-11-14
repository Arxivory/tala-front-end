import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/app/session/summary/$id")({
  head: () => pageHead({
    title: "TALA Session Summary — Crew Operations Portal",
    description: "Three levels of disclosure for a completed session, from headline metrics to method details.",
  }),
  component: SessionSummary,
});

function SessionSummary() {
  return (
    <PagePlaceholder
      title="Session summary"
      description="Headline metrics, replay, joint load profiles, femoral strain per rep and the events log."
    />
  );
}
