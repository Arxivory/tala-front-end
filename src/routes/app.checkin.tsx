import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/tala/PagePlaceholder";
import { pageHead } from "@/lib/head";
import DailyCheckIn from "@/components/tala-sections/dailyCheckIn";

export const Route = createFileRoute("/app/checkin")({
  head: () => pageHead({
    title: "TALA Check-in — Crew Operations Portal",
    description: "A daily check-in you can finish in under a minute: sleep, fatigue, soreness and notes.",
  }),
  component: CheckIn,
});

function CheckIn() {
  return (
    <DailyCheckIn />
  );
}
