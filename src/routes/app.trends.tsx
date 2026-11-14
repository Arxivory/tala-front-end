import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";
import TrendsSection from "@/components/tala-sections/trends";

export const Route = createFileRoute("/app/trends")({
  head: () => pageHead({
    title: "TALA Trends — Crew Operations Portal",
    description: "Mechanical Loading Index and loading trends over time, compared with your 1g reference.",
  }),
  component: Trends,
});

function Trends() {
  return (
    <TrendsSection/>
  );
}
