import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";
import AssistantSection from "@/components/tala-sections/assistant";

export const Route = createFileRoute("/app/assistant")({
  head: () => pageHead({
    title: "TALA Offline Clinical Assistant — Crew Operations Portal",
    description: "Answers from loaded NASA documents, with citations. Decision support, not diagnosis.",
  }),
  component: Assistant,
});

function Assistant() {
  return (
    <AssistantSection />
  );
}
