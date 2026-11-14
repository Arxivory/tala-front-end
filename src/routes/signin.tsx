import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/tala/Logo";
import { DemoTag } from "@/components/tala/DemoTag";
import { pageHead } from "@/lib/head";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/signin")({
  head: () => pageHead({
    title: "TALA Sign in — Crew Operations Portal",
    description: "Sign in with your crew ID, or open demo mode with all mock data.",
  }),
  component: SignIn,
});

function SignIn() {
  const { enterDemoMode } = useApp();
  const navigate = useNavigate();

  const openDemo = () => {
    enterDemoMode();
    void navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-soft">
        <Logo size={44} />
        <h1 className="mt-8 font-display text-xl font-bold text-strong">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Data stays on this device until a ground link is available.
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); openDemo(); }}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="crew-id" className="text-sm font-medium text-body">Crew ID</label>
            <input
              id="crew-id"
              name="crewId"
              autoComplete="username"
              className="h-11 rounded-2xl border border-input bg-background px-4 text-sm text-strong placeholder:text-muted-foreground"
              placeholder="e.g. ARIVERA"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pin" className="text-sm font-medium text-body">PIN</label>
            <input
              id="pin"
              name="pin"
              type="password"
              autoComplete="current-password"
              className="h-11 rounded-2xl border border-input bg-background px-4 text-sm text-strong placeholder:text-muted-foreground"
              placeholder="••••"
            />
          </div>
          <Button type="submit" className="h-11 rounded-full text-sm font-semibold">
            Sign in
          </Button>
        </form>
        <div className="mt-3 flex flex-col gap-2">
          <Button variant="secondary" className="h-11 rounded-full text-sm font-semibold" onClick={openDemo}>
            Open demo mode
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Link
            to="/"
            className="text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-body hover:underline"
          >
            Switch crew member
          </Link>
        </div>
        <div className="mt-6 flex justify-center">
          <DemoTag label="Prototype — sign-in is mocked" />
        </div>
      </div>
    </div>
  );
}
