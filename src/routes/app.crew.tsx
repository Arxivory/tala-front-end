import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/app/crew")({
  head: () => pageHead({
    title: "TALA Crew — Crew Operations Portal",
    description: "Crew Medical Officer view: crew overview, review queue and threshold configuration.",
  }),
  component: Crew,
});

function Crew() {
  return (
    <PagePlaceholder
      title="Crew"
      description="The Crew Medical Officer view: crew overview, the anomaly review queue and threshold configuration with an audit log."
    />
  );
}
