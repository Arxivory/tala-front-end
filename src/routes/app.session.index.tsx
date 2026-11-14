import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/head";
import SessionFlow from "@/components/tala-sections/sessionFlow";

export const Route = createFileRoute("/app/session/")({
  head: () =>
    pageHead({
      title: "TALA Record and Review — Crew Operations Portal",
      description:
        "Review a recorded movement sample, open its precomputed biomechanics analysis, and continue to the movement mirror.",
    }),
  component: SessionList,
});

function SessionList() {
  return <SessionFlow />;
}
