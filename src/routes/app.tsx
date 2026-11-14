import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/tala/AppShell";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return <AppShell>{<Outlet />}</AppShell>;
}
