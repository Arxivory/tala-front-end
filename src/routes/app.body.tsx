import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/head";
import BodyMapSection from "@/components/tala-sections/bodyMap";

export const Route = createFileRoute("/app/body")({
  head: () =>
    pageHead({
      title: "TALA Body Map — Crew Operations Portal",
      description:
        "Review a recorded movement video beside its computer-vision pose-estimation render and reconstructed observations.",
    }),
  component: BodyMap,
});

function BodyMap() {
  return <BodyMapSection />;
}
