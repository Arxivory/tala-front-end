import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileVideo2,
  Info,
  LoaderCircle,
  Play,
  RotateCcw,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ConfidenceBadge, DemoTag, MetricCard, StatusPill } from "@/components/tala";
import { researchDemoAssessment } from "@/data/research-demo-assessment";
import type { EquipmentName, ExerciseName, GravityRegime } from "@/data/types";

type SessionStage = "setup" | "countdown" | "recording" | "processing" | "results";

const exercises: ExerciseName[] = [
  "Squat",
  "Deadlift",
  "Heel raise",
  "Bench press",
  "Row",
  "Custom",
];
const equipmentOptions: EquipmentName[] = ["ARED", "Flywheel", "Bodyweight"];
const gravityOptions: { value: GravityRegime; label: string }[] = [
  { value: "0g", label: "0g" },
  { value: "0.16g", label: "0.16g Lunar" },
  { value: "0.38g", label: "0.38g Mars" },
  { value: "1g", label: "1g Ref" },
];

const stages: { id: "setup" | "recording" | "processing" | "results"; label: string }[] = [
  { id: "setup", label: "Pre-session" },
  { id: "recording", label: "Recording" },
  { id: "processing", label: "Biomechanics" },
  { id: "results", label: "Insights" },
];

export default function SessionFlow() {
  const [stage, setStage] = useState<SessionStage>("setup");
  const [exercise, setExercise] = useState<ExerciseName>("Squat");
  const [equipment, setEquipment] = useState<EquipmentName>("ARED");
  const [gravityRegime, setGravityRegime] = useState<GravityRegime>("0.16g");
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState(8);
  const [targetLoad, setTargetLoad] = useState(140);
  const [countdownNum, setCountdownNum] = useState(3);

  useEffect(() => {
    if (stage === "countdown") {
      const timer = window.setTimeout(() => {
        if (countdownNum > 1) {
          setCountdownNum(countdownNum - 1);
        } else {
          setStage("recording");
        }
      }, 1000);
      return () => window.clearTimeout(timer);
    }

    if (stage === "processing") {
      const timer = window.setTimeout(() => setStage("results"), 900);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [stage, countdownNum]);

  const beginAnalysis = () => setStage("processing");
  const beginDemoSession = () => {
    setCountdownNum(3);
    setStage("countdown");
  };
  const activeStage = stage === "countdown" ? "recording" : stage;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-6 sm:px-4 lg:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Session workflow</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-strong">
            Record, compute, review
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Review a recorded squat sample, open its precomputed movement analysis, then inspect the
            pose-estimation mirror.
          </p>
        </div>
        <DemoTag label="Video Credits from NASA Jonny Kim on Facebook Reel" />
      </header>

      <ol aria-label="Session steps" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((item, index) => {
          const currentIndex = stages.findIndex((step) => step.id === activeStage);
          const complete = currentIndex > index;
          const active = activeStage === item.id;
          const Icon = complete ? CheckCircle2 : active ? ScanLine : CircleDashed;
          return (
            <li
              key={item.id}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                active ? "border-primary-300 bg-primary-100/60" : "border-primary-300/40 bg-card"
              }`}
            >
              <Icon className="size-5 text-primary-700" aria-hidden="true" />
              <span className="text-sm font-medium text-strong">{item.label}</span>
            </li>
          );
        })}
      </ol>

      {stage === "setup" ? (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <ScanLine className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-strong">
                  Pre-session configuration
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set the session context before starting the demo recording.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-muted-foreground">
                  Target exercise
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {exercises.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={exercise === option ? "default" : "outline"}
                      className="h-10 rounded-xl"
                      aria-pressed={exercise === option}
                      onClick={() => setExercise(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-muted-foreground">
                  Resistance equipment
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {equipmentOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={equipment === option ? "default" : "outline"}
                      className="h-10 rounded-xl"
                      aria-pressed={equipment === option}
                      onClick={() => setEquipment(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-muted-foreground">
                  Gravity regime
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {gravityOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={gravityRegime === option.value ? "default" : "outline"}
                      className="h-10 rounded-xl px-2"
                      aria-pressed={gravityRegime === option.value}
                      onClick={() => setGravityRegime(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-3 gap-3">
                <NumberSetting
                  label="Sets"
                  value={targetSets}
                  min={1}
                  onChange={(value) => setTargetSets(Math.max(1, value || 1))}
                />
                <NumberSetting
                  label="Reps / set"
                  value={targetReps}
                  min={1}
                  onChange={(value) => setTargetReps(Math.max(1, value || 1))}
                />
                <NumberSetting
                  label="Load (kg)"
                  value={targetLoad}
                  min={0}
                  onChange={(value) => setTargetLoad(Math.max(0, value || 0))}
                />
              </div>

              <div className="rounded-2xl border border-dashed border-primary-300/50 bg-raised p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary-700" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-body">
                    These settings are retained for the demo only. The supplied recording is a fixed
                    squat sample, and changing these values does not alter its precomputed analysis.
                  </p>
                </div>
                <DemoTag className="mt-3" label="Demo configuration" />
              </div>
            </div>

            <Button className="mt-6 h-12 w-full rounded-full sm:w-auto" onClick={beginDemoSession}>
              <Play aria-hidden="true" />
              Start demo session
            </Button>
          </div>

          <aside className="rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-2">
              <Camera className="size-5 text-primary-700" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold text-strong">Recording readiness</h2>
            </div>
            <div className="mt-5 space-y-3">
              <ReadinessRow
                label="Original squat clip"
                detail={`${researchDemoAssessment.durationSeconds} s · ${researchDemoAssessment.frameCount} frames`}
              />
              <ReadinessRow label="CV pose-estimation video" detail="Available" />
              <ReadinessRow label="Precomputed biomechanics output" detail="Available" />
              <div className="flex items-start gap-3 rounded-xl border border-primary-300/40 bg-raised p-3">
                <CircleDashed
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-strong">Live camera</p>
                  <p className="text-xs text-muted-foreground">Not used in this demo</p>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              After the countdown, the prerecorded clip plays, then you can open the precomputed
              movement results.
            </p>
            <DemoTag className="mt-4" label="Fixed research recording" />
          </aside>
        </section>
      ) : null}

      {stage === "countdown" ? (
        <section
          aria-live="polite"
          className="flex min-h-[28rem] flex-col items-center justify-center gap-6 rounded-3xl border border-primary-300/40 bg-card p-8 text-center shadow-soft"
        >
          <div className="flex size-36 items-center justify-center rounded-full bg-gradient-to-br from-primary-300 to-lilac-300 shadow-soft motion-reduce:animate-none animate-pulse">
            <span className="font-display text-6xl font-bold tabular-nums text-strong">
              {countdownNum}
            </span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-strong">
              Stand by for the demo recording
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The prerecorded squat clip will begin after the countdown.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>{exercise}</span>
            <span aria-hidden="true">·</span>
            <span>{equipment}</span>
            <span aria-hidden="true">·</span>
            <span>{gravityRegime}</span>
            <span aria-hidden="true">·</span>
            <span>
              {targetSets} sets × {targetReps} reps
            </span>
            <span aria-hidden="true">·</span>
            <span>{targetLoad} kg</span>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => setStage("setup")}>
            <RotateCcw aria-hidden="true" />
            Cancel countdown
          </Button>
        </section>
      ) : null}

      {stage === "recording" ? (
        <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileVideo2 className="mt-1 size-5 shrink-0 text-primary-700" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl font-bold text-strong">
                  Demo recording in progress
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Prerecorded squat sample · {researchDemoAssessment.durationSeconds} seconds
                </p>
              </div>
            </div>
            <DemoTag label="Prerecorded demo" />
          </div>

          <video
            className="mx-auto mt-5 max-h-[60vh] w-full rounded-2xl bg-black object-contain sm:max-w-sm"
            autoPlay
            controls
            muted
            playsInline
            preload="auto"
            src={researchDemoAssessment.originalVideo}
          >
            Your browser does not support embedded video.
          </video>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" className="rounded-full" onClick={() => setStage("setup")}>
              <RotateCcw aria-hidden="true" />
              Back to configuration
            </Button>
            <Button className="rounded-full" onClick={beginAnalysis}>
              Compute biomechanics
              <Sparkles aria-hidden="true" />
            </Button>
          </div>
        </section>
      ) : null}

      {stage === "processing" ? (
        <section
          aria-live="polite"
          className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-primary-300/40 bg-card p-8 text-center shadow-soft"
        >
          <LoaderCircle
            className="size-9 animate-spin text-primary-700 motion-reduce:animate-none"
            aria-hidden="true"
          />
          <h2 className="mt-5 font-display text-xl font-bold text-strong">
            Loading biomechanics results
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            The demo is opening the precomputed reconstruction and movement analysis for this
            recording. No inference is running in the browser.
          </p>
          <DemoTag className="mt-4" label="Precomputed analysis" />
        </section>
      ) : null}

      {stage === "results" ? (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status="caution" />
                <span className="text-sm text-muted-foreground">
                  Recording completeness: incomplete
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-strong">
                Movement analysis
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                The clip does not sufficiently capture the expected start and end postures, so treat
                the reported values as reconstructed movement observations.
              </p>
            </div>
            <Button asChild className="shrink-0 rounded-full">
              <Link to="/app/body">
                Open movement mirror
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              className="border-primary-300/40"
              title="Repetitions detected"
              value={researchDemoAssessment.repetitionsDetected}
              unit="reps"
              status="caution"
              confidence="low"
              footnote="Estimated from the center-of-mass movement signal."
            />
            <MetricCard
              className="border-primary-300/40"
              title="Reconstruction fit residual"
              value={researchDemoAssessment.rmsFittingErrorMeters.toFixed(3)}
              unit="m RMS"
              status="caution"
              confidence="low"
              footnote="Marker-fit agreement does not establish anatomical accuracy."
            />
            <MetricCard
              className="border-primary-300/40"
              title="Movement phases"
              value={`${researchDemoAssessment.ascentPhases} / ${researchDemoAssessment.descentPhases}`}
              unit="ascent / descent"
              status="caution"
              confidence="low"
              footnote="Phase segmentation uses one estimated movement signal."
            />
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-primary-300/40 bg-card p-5 shadow-soft">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Baseline comparison</p>
                <p className="mt-2 font-display text-xl font-bold text-strong">Unavailable</p>
              </div>
              <StatusPill status="no-data" size="small" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                No compatible prior squat recording is available for comparison.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h3 className="font-display text-lg font-bold text-strong">
                Estimated coordinate excursions
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Degrees shown are model-estimated coordinate ranges, not clinical measurements.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {researchDemoAssessment.movementEstimates.map((estimate) => (
                <MetricCard
                  className="border-primary-300/40"
                  key={estimate.id}
                  title={estimate.label}
                  value={`${estimate.rightExcursionDeg.toFixed(2)} / ${estimate.leftExcursionDeg.toFixed(2)}`}
                  unit="° right / left"
                  status={estimate.status}
                  confidence={estimate.confidence}
                  footnote={estimate.interpretation}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h3 className="font-display text-lg font-bold text-strong">
                Modeled gravity context
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Modeled potential-energy difference from the lowest to the initial center-of-mass
                height, with the same reconstructed movement held fixed across environments. These
                values are not joint loading, muscle work, or an exercise-effort measure.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {researchDemoAssessment.gravityContext.scenarios.map((context) => (
                <MetricCard
                  className="border-primary-300/40"
                  key={context.regime}
                  title={`${context.environment} (${context.regime})`}
                  value={context.energyDifferenceJ.toFixed(2)}
                  unit="J"
                  status="neutral"
                  confidence="low"
                  footnote={`Modeled at ${context.gravityMetersPerSecondSquared.toFixed(2)} m/s²; same movement held fixed across environments.`}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-primary-700" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-strong">
                  Interpretation limits
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-body">
                Reconstruction quality is limited. Estimates depend on monocular pose tracking and
                approximate marker fitting; they do not establish movement quality, injury risk, or
                safety.
              </p>
              <p className="mt-3 text-sm font-medium text-strong">
                Joint loads and inverse dynamics were not calculated for this recording.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusPill status="caution" size="small" />
                <ConfidenceBadge level="low" />
              </div>
            </div>
            <div className="rounded-3xl border border-dashed border-primary-300/50 bg-raised p-6">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-primary-700" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-strong">Demo data</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-body">
                These results come from a precomputed backend research run. The same movement
                trajectory can be reviewed in the movement mirror with the computer-vision pose
                estimate.
              </p>
              <DemoTag className="mt-4" />
            </div>
          </div>

          <p className="rounded-2xl border border-primary-300/40 bg-card p-4 text-center text-sm text-muted-foreground">
            TALA shows reconstructed movement observations, not a diagnosis or exercise safety
            clearance.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" className="rounded-full" onClick={() => setStage("setup")}>
              Review another demo
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/app/body">
                Continue to movement mirror
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function NumberSetting({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        className="h-11 w-full rounded-xl border border-primary-300/50 bg-background px-2 text-center font-semibold tabular-nums text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        type="number"
        min={min}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function ReadinessRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary-300/40 bg-raised p-3">
      <CheckCircle2
        className="mt-0.5 size-4 shrink-0 text-status-optimal-text"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-medium text-strong">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
