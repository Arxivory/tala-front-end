import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { pageHead } from "@/lib/head";
import TrendsSection, { type TrendTab } from "@/components/tala-sections/trends";

const trendsSearchSchema = z.object({
  tab: z.enum(["overview", "movement", "sessions", "gravity"]).optional(),
});

export const Route = createFileRoute("/app/trends")({
  validateSearch: trendsSearchSchema,
  head: () =>
    pageHead({
      title: "TALA Trends — Movement and Gravity Analysis",
      description:
        "Review movement trends, illustrative baselines, research session history, and precomputed gravity scenarios.",
    }),
  component: Trends,
});

function Trends() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  const changeTab = (nextTab: TrendTab) => {
    void navigate({
      search: (previous) => ({ ...previous, tab: nextTab }),
    });
  };

  return <TrendsSection activeTab={tab ?? "overview"} onTabChange={changeTab} />;
}
