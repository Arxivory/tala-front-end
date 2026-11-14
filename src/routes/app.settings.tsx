import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/app/settings")({
  head: () => pageHead({
    title: "TALA Settings — Crew Operations Portal",
    description: "Profile, display, session defaults, units, data and about.",
  }),
  component: Settings,
});

function Settings() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Profile, display, session defaults, units, data management and about."
    />
  );
}
