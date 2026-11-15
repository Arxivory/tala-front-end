import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Info, Pause, PersonStanding, Play, Video } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ConfidenceBadge, DemoTag, MetricCard, StatusPill } from "@/components/tala";
import {
  BODY_MOTION_INSIGHTS,
  findMovementPhase,
  getRangeColorRatio,
  parseMovementPhases,
  type MovementPhaseSegment,
} from "@/data/body-map-insights";
import { researchDemoAssessment } from "@/data/research-demo-assessment";
import {
  createOpenSimViewer,
  type OpenSimViewerFrame,
  type OpenSimViewerHandle,
  type OpenSimViewerStatus,
} from "./opensimViewer";

type VideoView = "pose" | "original";
const MOVEMENT_ANALYSIS_URL = "/data/movement-analysis/movement_analysis.json";

export default function BodyMapSection() {
  const [videoView, setVideoView] = useState<VideoView>("pose");
  const [viewerStatus, setViewerStatus] = useState<OpenSimViewerStatus>({ state: "loading" });
  const [selectedBodyName, setSelectedBodyName] = useState<string | null>(null);
  const [motionFrame, setMotionFrame] = useState<OpenSimViewerFrame | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [movementPhases, setMovementPhases] = useState<MovementPhaseSegment[]>([]);
  const [phaseError, setPhaseError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [motionDuration, setMotionDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const viewerHostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSimViewerHandle | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineDuration = Math.min(videoDuration, motionDuration);
  const activeVideo =
    videoView === "pose" ? researchDemoAssessment.poseVideo : researchDemoAssessment.originalVideo;
  const selectedInsight = BODY_MOTION_INSIGHTS.find(
    (insight) => insight.bodyName === selectedBodyName,
  );
  const currentPhase = motionFrame
    ? findMovementPhase(movementPhases, motionFrame.timeSeconds)
    : undefined;

  const toggleHeatmap = () => {
    const nextEnabled = !heatmapEnabled;
    setHeatmapEnabled(nextEnabled);
    viewerRef.current?.setHeatmapEnabled(nextEnabled);
  };

  const selectBody = (bodyName: string) => {
    viewerRef.current?.setSelectedBody(bodyName || null);
  };

  useEffect(() => {
    const container = viewerHostRef.current;
    if (!container) return;

    try {
      const viewer = createOpenSimViewer(
        container,
        {
          onStatus: (status) => {
            setViewerStatus(status);
            setMotionDuration(status.state === "ready" ? status.durationSeconds : 0);
          },
          onBodySelect: setSelectedBodyName,
          onFrame: setMotionFrame,
        },
        () => videoRef.current?.currentTime ?? 0,
      );
      viewerRef.current = viewer;
      return () => {
        viewerRef.current = null;
        viewer.dispose();
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to initialize the OpenSim viewer.";
      const errorTimer = window.setTimeout(() => setViewerStatus({ state: "error", message }), 0);
      return () => window.clearTimeout(errorTimer);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(MOVEMENT_ANALYSIS_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load movement phases (${response.status}).`);
        }
        return response.json() as Promise<unknown>;
      })
      .then((analysis) => setMovementPhases(parseMovementPhases(analysis)))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setPhaseError(
          error instanceof Error ? error.message : "Unable to load squat phase information.",
        );
      });
    return () => controller.abort();
  }, []);

  const selectVideoView = (view: VideoView) => {
    if (view === videoView) return;
    videoRef.current?.pause();
    setVideoView(view);
    setCurrentTime(0);
    setVideoDuration(0);
    setIsPlaying(false);
    setPlaybackError(null);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || !timelineDuration) return;

    setPlaybackError(null);
    if (video.paused) {
      if (video.currentTime >= timelineDuration) {
        video.currentTime = 0;
        setCurrentTime(0);
      }
      void video.play().catch((error: unknown) => {
        setIsPlaying(false);
        setPlaybackError(
          error instanceof Error
            ? `Video playback failed: ${error.message}`
            : "Video playback failed.",
        );
      });
    } else {
      video.pause();
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-6 sm:px-4 lg:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Body Map</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-strong">Movement mirror</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Compare the source squat clip with its computer-vision pose-estimation render, then
            review the reconstructed joint-coordinate observations.
          </p>
        </div>
        <DemoTag label="Precomputed research sample" />
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Video className="size-4 text-primary-700" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-strong">Recorded squat</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {videoView === "pose" ? "CV pose-estimation render" : "Original source video"}
              </p>
            </div>
            <div className="flex gap-2" aria-label="Video view">
              <Button
                type="button"
                variant={videoView === "pose" ? "default" : "outline"}
                className="rounded-full"
                aria-pressed={videoView === "pose"}
                onClick={() => selectVideoView("pose")}
              >
                Pose estimate
              </Button>
              <Button
                type="button"
                variant={videoView === "original" ? "default" : "outline"}
                className="rounded-full"
                aria-pressed={videoView === "original"}
                onClick={() => selectVideoView("original")}
              >
                Original
              </Button>
            </div>
          </div>

          <video
            ref={videoRef}
            key={videoView}
            className="mx-auto mt-5 max-h-[72vh] w-full rounded-2xl border border-primary-300/50 bg-black object-contain sm:max-w-md"
            playsInline
            preload="metadata"
            src={activeVideo}
            onLoadedMetadata={(event) => {
              const duration = event.currentTarget.duration;
              if (!Number.isFinite(duration) || duration <= 0) {
                setPlaybackError("The selected video does not have a valid duration.");
                return;
              }
              setVideoDuration(duration);
              event.currentTarget.currentTime = Math.min(currentTime, duration);
            }}
            onTimeUpdate={(event) => {
              const time = event.currentTarget.currentTime;
              if (timelineDuration > 0 && time >= timelineDuration) {
                event.currentTarget.pause();
                event.currentTarget.currentTime = timelineDuration;
                setCurrentTime(timelineDuration);
                return;
              }
              setCurrentTime(time);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setCurrentTime(timelineDuration);
              setIsPlaying(false);
            }}
            onError={() => setPlaybackError("Unable to load the selected research video.")}
          >
            Your browser does not support embedded video.
          </video>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <DemoTag label="Research video" />
            <span className="text-xs text-muted-foreground">
              {researchDemoAssessment.durationSeconds} s · {researchDemoAssessment.frameCount}{" "}
              frames · {researchDemoAssessment.samplingRateHz} frames/s
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-strong">OpenSim motion mirror</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                VTP geometry driven by OpenSim MOT coordinates
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={heatmapEnabled ? "default" : "outline"}
                className="rounded-full"
                aria-pressed={heatmapEnabled}
                disabled={viewerStatus.state !== "ready"}
                onClick={toggleHeatmap}
              >
                Relative motion heatmap {heatmapEnabled ? "on" : "off"}
              </Button>
              <DemoTag label="Approximate MOT-driven mirror" />
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div
              ref={viewerHostRef}
              className="h-[420px] overflow-hidden rounded-2xl border border-primary-300/50 bg-[#f7f4fa]"
              role="application"
              aria-label="Approximate OpenSim motion mirror. Click a body part to inspect it. Drag to orbit and use the scroll wheel to zoom."
            />
            <aside
              className="flex h-[420px] flex-col overflow-y-auto rounded-2xl border border-primary-300/40 bg-raised p-4"
              aria-label="Selected body part information"
            >
              <h3 className="font-display text-base font-bold text-strong">Movement detail</h3>
              <label htmlFor="body-map-segment" className="mt-3 text-xs font-medium text-strong">
                Select a body part
              </label>
              <select
                id="body-map-segment"
                className="mt-1 rounded-xl border border-primary-300/50 bg-card px-3 py-2 text-sm text-body"
                value={selectedBodyName ?? ""}
                disabled={viewerStatus.state !== "ready"}
                onChange={(event) => selectBody(event.currentTarget.value)}
              >
                <option value="">Choose a part or click the model</option>
                {BODY_MOTION_INSIGHTS.map((insight) => (
                  <option key={insight.bodyName} value={insight.bodyName}>
                    {insight.label}
                  </option>
                ))}
              </select>

              {heatmapEnabled ? (
                <div className="mt-3 rounded-xl border border-primary-300/30 bg-card p-3">
                  <p className="text-xs font-medium text-strong">Within this recording</p>
                  <div
                    className="mt-2 h-3 rounded-full"
                    style={{ background: "linear-gradient(90deg, #f6bfd7, #ffb17a)" }}
                    role="img"
                    aria-label="Color scale from lower to higher estimated angle in this recording"
                  />
                  <div className="mt-1 flex justify-between gap-2 text-[10px] text-muted-foreground">
                    <span>Lower recorded angle</span>
                    <span>Higher recorded angle</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Each part uses its own estimated coordinate range. Colors are not comparable
                    between parts.
                  </p>
                </div>
              ) : null}

              <div className="mt-3 rounded-xl border border-primary-300/30 bg-card p-3">
                <p className="text-xs font-semibold text-strong">Current squat phase</p>
                <p className="mt-1 text-sm text-body">
                  {currentPhase === "ascent"
                    ? "Rising"
                    : currentPhase === "descent"
                      ? "Lowering"
                      : "Not available"}
                </p>
                {phaseError ? (
                  <p role="alert" className="mt-1 text-xs text-status-anomaly-text">
                    {phaseError}
                  </p>
                ) : null}
              </div>

              {selectedInsight ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <h4 className="font-display text-sm font-bold text-strong">
                      {selectedInsight.label}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {selectedInsight.description}
                    </p>
                  </div>
                  {selectedInsight.unavailableNote ? (
                    <div className="rounded-xl border border-dashed border-primary-300/50 p-3">
                      <StatusPill status="no-data" size="small" />
                      <p className="mt-2 text-xs leading-relaxed text-body">
                        {selectedInsight.unavailableNote}
                      </p>
                    </div>
                  ) : (
                    selectedInsight.coordinates.map((coordinate) => (
                      <CoordinateInsight
                        key={coordinate.name}
                        label={coordinate.label}
                        coordinateName={coordinate.name}
                        frame={motionFrame}
                      />
                    ))
                  )}
                </div>
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-primary-300/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  Click a modeled part, or choose one above, to see its estimated movement for the
                  current frame.
                </p>
              )}

              <p className="mt-auto pt-3 text-[11px] leading-relaxed text-muted-foreground">
                Estimates describe this recording only. They are not clinical measurements,
                diagnoses, or exercise safety guidance.
              </p>
            </aside>
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
            {viewerStatus.state === "loading"
              ? "Loading OpenSim model, VTP geometry, and MOT coordinates…"
              : viewerStatus.state === "error"
                ? viewerStatus.message
                : "Drag to orbit · scroll to zoom · right-click and drag to pan"}
          </p>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-primary-300/50 bg-raised p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-primary-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-body">
              This approximate mirror uses geometry scales, joint frames, and motion coordinates
              from the supplied OpenSim files. It is not a validated biomechanical simulation.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-primary-300/40 bg-card p-4 shadow-soft sm:p-5">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="shrink-0 rounded-full"
            aria-label={isPlaying ? "Pause synchronized playback" : "Play synchronized playback"}
            disabled={!timelineDuration}
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-3">
              <label htmlFor="shared-motion-timeline" className="text-sm font-medium text-strong">
                Video and model timeline
              </label>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatPlaybackTime(currentTime)} / {formatPlaybackTime(timelineDuration)}
              </span>
            </div>
            <input
              id="shared-motion-timeline"
              className="w-full accent-primary"
              type="range"
              min={0}
              max={timelineDuration}
              step={1 / researchDemoAssessment.samplingRateHz}
              value={Math.min(currentTime, timelineDuration)}
              disabled={!timelineDuration}
              onChange={(event) => {
                const time = Number(event.currentTarget.value);
                const video = videoRef.current;
                if (!video) return;
                video.currentTime = time;
                setCurrentTime(time);
              }}
            />
          </div>
        </div>
        {playbackError ? (
          <p role="alert" className="mt-2 text-sm text-status-anomaly-text">
            {playbackError}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          Playback and scrubbing follow the selected video and the supplied opensim_motion.mot.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <PersonStanding className="size-5 text-primary-700" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-strong">Reconstruction summary</h2>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusPill status="caution" />
            <ConfidenceBadge level="low" />
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <SummaryRow label="Movement" value="Squat" />
            <SummaryRow label="Recording completeness" value="Incomplete" />
            <SummaryRow label="Reconstruction quality" value="Limited" />
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            This single-camera reconstruction has known limitations. Its estimates are not
            camera-calibrated measurements or a clinical movement assessment.
          </p>
        </div>
        <div className="rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold text-strong">Output boundaries</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-body">
            <li>Coordinate excursions describe the reconstructed motion only.</li>
            <li>No joint loads or inverse dynamics were calculated.</li>
            <li>No baseline comparison is available for this recording.</li>
          </ul>
          <div className="mt-4">
            <DemoTag label="Precomputed analysis" />
          </div>
        </div>
      </section>

      <section>
        <MetricCard
          className="border-primary-300/40"
          title="Repetitions detected"
          value={researchDemoAssessment.repetitionsDetected}
          unit="reps"
          status="caution"
          confidence="low"
          footnote="Estimated from the center-of-mass movement signal."
        />
      </section>

      <section>
        <div className="mb-3">
          <h2 className="font-display text-xl font-bold text-strong">
            Estimated joint-coordinate excursions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Values are degrees, shown right / left. They are not clinical range-of-motion measures.
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
      </section>

      <div className="rounded-2xl border border-primary-300/40 bg-card p-4 text-sm text-muted-foreground">
        Shows reconstructed movement observations, not bone status, a diagnosis, or exercise safety
        clearance.
      </div>

      <div>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/app/session">
            <ArrowLeft aria-hidden="true" />
            Back to session workflow
          </Link>
        </Button>
      </div>
    </main>
  );
}

function CoordinateInsight({
  label,
  coordinateName,
  frame,
}: {
  label: string;
  coordinateName: string;
  frame: OpenSimViewerFrame | null;
}) {
  const value = frame?.coordinates.get(coordinateName);
  const range = frame?.coordinateRanges.get(coordinateName);
  if (value === undefined || !range || !frame?.angularCoordinates.has(coordinateName)) {
    return (
      <div className="rounded-xl border border-dashed border-primary-300/50 p-3">
        <p className="text-xs font-medium text-strong">{label}</p>
        <div className="mt-2">
          <StatusPill status="no-data" size="small" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          No estimated angle is available for this frame.
        </p>
      </div>
    );
  }

  const toDegrees = (coordinate: number) =>
    frame.inDegrees ? coordinate : (coordinate * 180) / Math.PI;
  const valueDegrees = toDegrees(value);
  const minimumDegrees = toDegrees(range.minimum);
  const maximumDegrees = toDegrees(range.maximum);
  const ratio = getRangeColorRatio(value, range.minimum, range.maximum);

  return (
    <div className="rounded-xl border border-primary-300/30 p-3">
      <p className="text-xs font-medium text-strong">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-strong">
        {valueDegrees.toFixed(1)}°
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Estimated angle at this frame
      </p>
      <p className="mt-2 text-xs leading-relaxed text-body">
        This recording: {minimumDegrees.toFixed(1)}° to {maximumDegrees.toFixed(1)}°
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {describeRelativePosition(ratio)}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusPill status="neutral" size="small" />
        <ConfidenceBadge level="low" />
      </div>
    </div>
  );
}

function describeRelativePosition(ratio: number | undefined) {
  if (ratio === undefined) return "No variation appears in the supplied motion samples.";
  if (ratio < 0.33) return "Near the lower end of this recording's estimated range.";
  if (ratio > 0.67) return "Near the higher end of this recording's estimated range.";
  return "Around the middle of this recording's estimated range.";
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-primary-300/40 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-strong">{value}</dd>
    </div>
  );
}

function formatPlaybackTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  const centiseconds = Math.floor((time % 1) * 100)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
}
