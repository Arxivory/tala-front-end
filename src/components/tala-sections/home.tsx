import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  ClipboardCheck,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ConfidenceBadge, DemoTag, StatusPill, TalaAvatar } from "@/components/tala";
import { researchDemoAssessment } from "@/data/research-demo-assessment";
import { useApp } from "@/lib/app-state";

type DashboardState =
  "available" | "limited" | "insufficient" | "unavailable" | "submitted" | "awaiting";

const statePresentation: Record<
  DashboardState,
  { icon: LucideIcon; label: string; className: string }
> = {
  available: {
    icon: CheckCircle2,
    label: "Available",
    className: "text-body",
  },
  limited: {
    icon: AlertTriangle,
    label: "Limited",
    className: "text-status-caution-text",
  },
  insufficient: {
    icon: CircleDashed,
    label: "Insufficient history",
    className: "text-muted-foreground",
  },
  unavailable: {
    icon: CircleDashed,
    label: "Unavailable",
    className: "text-muted-foreground",
  },
  submitted: {
    icon: CheckCircle2,
    label: "Submitted",
    className: "text-body",
  },
  awaiting: {
    icon: Clock3,
    label: "Awaiting input",
    className: "text-muted-foreground",
  },
};

function StateLabel({ state, label }: { state: DashboardState; label?: string }) {
  const presentation = statePresentation[state];
  const Icon = presentation.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${presentation.className}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {label ?? presentation.label}
    </span>
  );
}

function SnapshotCard({
  title,
  state,
  detail,
  confidence,
  tag,
}: {
  title: string;
  state: DashboardState;
  detail: string;
  confidence?: "high" | "medium" | "low";
  tag?: string;
}) {
  return (
    <article className="flex min-h-44 flex-col rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
        {tag ? <DemoTag label={tag} /> : null}
      </div>
      <div className="mt-4">
        <StateLabel state={state} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      {confidence ? (
        <div className="mt-auto pt-3">
          <ConfidenceBadge level={confidence} />
        </div>
      ) : null}
    </article>
  );
}

function ObservationMetric({
  label,
  value,
  unit,
  state,
  confidence,
}: {
  label: string;
  value: string;
  unit?: string;
  state: DashboardState;
  confidence?: "high" | "medium" | "low";
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-strong">
        {value}
        {unit ? (
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">{unit}</span>
        ) : null}
      </dd>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StateLabel state={state} />
        {confidence ? <ConfidenceBadge level={confidence} /> : null}
      </div>
    </div>
  );
}

export default function Home() {
  const { currentUser, hasCheckInToday } = useApp();
  const [showMovementProfile, setShowMovementProfile] = useState(false);
  const firstName =
    currentUser.name.replace(/^(Dr|Mr|Ms)\.?\s+/i, "").split(" ")[0] ?? "Crew member";
  const baselineAvailable = researchDemoAssessment.baselineComparisonAvailable;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-6 sm:px-4 lg:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 font-display text-3xl font-bold text-strong">
            Good morning, {firstName}!
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Review the latest movement analysis, check in for today, and explore movement insights.
            This prototype uses one precomputed research recording and clearly labeled illustrative
            history.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DemoTag label="Sample account" />
          <DemoTag label="Research prototype" />
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[32px] border border-primary-300/40 bg-card p-6 shadow-soft sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary-100/70 blur-3xl"
        />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <TalaAvatar size={44} />
              <StateLabel state="available" label="Prototype ready" />
            </div>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Your movement-monitoring workspace is ready. The latest squat analysis is precomputed;
              review its reconstruction limits before exploring the movement mirror.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button asChild size="lg" className="min-h-12 rounded-full px-6">
              <Link to="/app/body">
                Explore latest analysis
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12 rounded-full px-6">
              <Link to="/app/checkin">
                <ClipboardCheck className="size-4" aria-hidden="true" />
                Quick check-in
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-label="Movement and check-in snapshot">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-strong">
              Movement &amp; check-in snapshot
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current research output and device-local check-in state
            </p>
          </div>
          <DemoTag label="Precomputed research output" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SnapshotCard
            title="Movement analysis"
            state="available"
            detail="Two repetitions detected in an incomplete recording."
            confidence="low"
          />
          <SnapshotCard
            title="Kinematic reconstruction"
            state="limited"
            detail="The supplied inverse-kinematics report rates reconstruction quality as limited."
            confidence="low"
          />
          <SnapshotCard
            title="Personal baseline"
            state={baselineAvailable ? "available" : "insufficient"}
            detail={
              baselineAvailable
                ? "A compatible personal reference is available."
                : "One research sample is available; compatible personal session history is not."
            }
            tag="Research output"
          />
          <SnapshotCard
            title="Daily check-in"
            state={hasCheckInToday ? "submitted" : "awaiting"}
            detail={
              hasCheckInToday
                ? "Today's check-in is saved on this device."
                : "No check-in is saved for today."
            }
            tag="Device-only prototype"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.8fr)]">
        <article className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-primary-700" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-strong">
                  Latest movement observation
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Squat · one precomputed research recording · capture date unavailable
              </p>
            </div>
            <DemoTag label="Research output · not astronaut history" />
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ObservationMetric
              label="Detected repetitions"
              value={String(researchDemoAssessment.repetitionsDetected)}
              unit="reps"
              state="available"
              confidence="low"
            />
            <ObservationMetric
              label="Source video duration"
              value={researchDemoAssessment.durationSeconds.toFixed(1)}
              unit="s"
              state="available"
            />
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <dt className="text-sm text-muted-foreground">Reconstruction quality</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-2">
                <StatusPill status="caution" size="small" />
                <ConfidenceBadge level="low" />
              </dd>
              <p className="mt-2 text-sm font-semibold text-strong">Limited</p>
            </div>
            <ObservationMetric label="Baseline comparison" value="—" state="unavailable" />
          </dl>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-4">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The recording starts and ends mid-movement. These observations are estimates, not a
              clinical finding or a validated movement-quality score.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/app/body">
                Open detailed analysis
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </article>

        <aside className="flex flex-col rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-2">
            <CircleDashed className="size-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-strong">Baseline readiness</h2>
          </div>
          <div className="mt-4">
            <StateLabel
              state={baselineAvailable ? "available" : "insufficient"}
              label={baselineAvailable ? "Available" : "Insufficient history"}
            />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {baselineAvailable
              ? "Compatible session records are available for a personal movement reference."
              : "One research recording is available. Additional compatible session records are needed before personal comparisons can be established."}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            A personal movement reference is not a healthy reference standard. Illustrative history
            in Trends is kept separate from this research output.
          </p>
          <div className="mt-auto pt-5">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link to="/app/trends">
                Explore movement trends
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-strong">
              Explore movement insights
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest reconstructed hip, knee, and ankle coordinate excursions. Full playback and
              session comparisons are in Body Map and Trends.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 shrink-0 rounded-full"
            aria-expanded={showMovementProfile}
            aria-controls="home-movement-profile"
            onClick={() => setShowMovementProfile((shown) => !shown)}
          >
            {showMovementProfile ? "Hide movement profile" : "View movement profile"}
          </Button>
        </div>

        {showMovementProfile ? (
          <div id="home-movement-profile" className="mt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Estimated coordinate excursions for this recording · degrees
              </p>
              <DemoTag label="Precomputed research output" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <caption className="sr-only">
                  Right and left estimated joint-coordinate excursions for the squat research
                  recording
                </caption>
                <thead className="border-y border-border bg-muted/50 text-xs font-medium text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3">Movement coordinate</th>
                    <th className="px-3 py-3 text-right">Right</th>
                    <th className="px-3 py-3 text-right">Left</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {researchDemoAssessment.movementEstimates.map((estimate) => (
                    <tr key={estimate.id} className="border-b border-border/70">
                      <th scope="row" className="px-3 py-3 font-medium text-strong">
                        {estimate.label}
                      </th>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-strong">
                        {estimate.rightExcursionDeg.toFixed(2)}°
                      </td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-strong">
                        {estimate.leftExcursionDeg.toFixed(2)}°
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={estimate.status} size="small" />
                      </td>
                      <td className="px-3 py-3">
                        <ConfidenceBadge level={estimate.confidence} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
                Coordinate excursions are estimated from monocular video and OpenSim inverse
                kinematics. They are not clinical range-of-motion assessments. Reconstruction
                quality is limited and recording endpoints are incomplete.
              </p>
              <Button asChild variant="link" className="shrink-0">
                <Link to="/app/trends">
                  View movement history
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <footer className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Research values come from one precomputed public-video sample, not live monitoring or an
          astronaut health record. Illustrative history is labeled separately. TALA does not provide
          a clinical finding or validated personal baseline.
        </p>
      </footer>
    </main>
  );
}
