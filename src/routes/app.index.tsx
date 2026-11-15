import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/head";
import Home from "@/components/tala-sections/home";

export const Route = createFileRoute("/app/")({
  head: () =>
    pageHead({
      title: "TALA Home — Movement Monitoring",
      description:
        "Review the latest precomputed movement analysis, check-in state, and movement insights.",
    }),
  component: AppHome,
});

function AppHome() {
  return <Home />;
}
