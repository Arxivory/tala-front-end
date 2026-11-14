import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";
import Home from "@/components/tala-sections/home";

export const Route = createFileRoute("/app/")({
  head: () => pageHead({
    title: "TALA Home — Crew Operations Portal",
    description: "Today's status, today's plan and one primary action: start your session.",
  }),
  component: AppHome,
});

function AppHome() {
  return (
    <Home />
  );
}
