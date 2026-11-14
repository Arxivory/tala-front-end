import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Info, Pause, PersonStanding, Play, Video } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ConfidenceBadge, DemoTag, MetricCard, StatusPill } from "@/components/tala";
import { researchDemoAssessment } from "@/data/research-demo-assessment";
import { createOpenSimViewer, type OpenSimViewerStatus } from "./opensimViewer";

type VideoView = "pose" | "original";

export default function BodyMapSection() {
  const [videoView, setVideoView] = useState<VideoView>("pose");
  const [viewerStatus, setViewerStatus] = useState<OpenSimViewerStatus>({ state: "loading" });
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [motionDuration, setMotionDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const viewerHostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineDuration = Math.min(videoDuration, motionDuration);
  const activeVideo =
    videoView === "pose" ? researchDemoAssessment.poseVideo : researchDemoAssessment.originalVideo;

  useEffect(() => {
    const container = viewerHostRef.current;
    if (!container) return;

    try {
      const viewer = createOpenSimViewer(
        container,
        (status) => {
          setViewerStatus(status);
          setMotionDuration(status.state === "ready" ? status.durationSeconds : 0);
        },
        () => videoRef.current?.currentTime ?? 0,
      );
      return () => viewer.dispose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to initialize the OpenSim viewer.";
      const errorTimer = window.setTimeout(() => setViewerStatus({ state: "error", message }), 0);
      return () => window.clearTimeout(errorTimer);
    }
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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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

      <section className="grid gap-6 xl:grid-cols-2">
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
            <DemoTag label="Approximate MOT-driven mirror" />
          </div>
          <div
            ref={viewerHostRef}
            className="mt-5 h-[420px] overflow-hidden rounded-2xl border border-primary-300/50 bg-[#f7f4fa]"
            role="application"
            aria-label="Approximate OpenSim motion mirror. Drag to orbit and use the scroll wheel to zoom."
          />
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
