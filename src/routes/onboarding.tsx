import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/tala/newLogo";
import { TalaAvatar } from "@/components/tala/TalaAvatar";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/onboarding")({
  head: () => pageHead({
    title: "TALA Onboarding — Crew Operations Portal",
    description: "Four-step setup: crew profile, camera, 1g reference session and baseline check-in.",
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Mascot size={44} />
      <TalaAvatar size={72} />
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-bold text-strong">Onboarding</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Four calm steps: crew profile, camera setup, your 1g reference session and a baseline
          check-in. The wizard arrives in the next build stage.
        </p>
      </div>
      <Button className="rounded-full px-6 font-semibold" onClick={() => void navigate({ to: "/app" })}>
        Preview the portal
      </Button>
      <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
        Back to start
      </Link>
    </div>
  );
}
