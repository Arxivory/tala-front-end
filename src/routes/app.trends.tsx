import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/head";
import TrendsSection from "@/components/tala-sections/trends";

export const Route = createFileRoute("/app/trends")({
  head: () =>
    pageHead({
      title: "TALA Trends — Crew Operations Portal",
      description:
        "Longitudinal movement observations, illustrative baselines, and research session history.",
    }),
  component: Trends,
});

function Trends() {
  return <TrendsSection />;
}
