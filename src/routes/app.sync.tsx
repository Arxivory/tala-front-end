import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/app/sync")({
  head: () => pageHead({
    title: "TALA Sync — Crew Operations Portal",
    description: "Delay-tolerant sync monitor: bundle queue, link windows and one-way delay.",
  }),
  component: Sync,
});

function Sync() {
  return (
    <PagePlaceholder
      title="Sync"
      description="The delay-tolerant link monitor: queued bundles, contact windows and one-way delay. Everything here is a demo placeholder."
    />
  );
}
