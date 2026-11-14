import type { TelemetrySample } from "./types";

/**
 * A recorded 60-second telemetry stream at 10 Hz for the Live HUD to replay.
 * Deterministic: built with pure arithmetic only, safe for module scope.
 * Includes one scripted lumbar anomaly at about second 38.
 */
function buildStream(): TelemetrySample[] {
  const samples: TelemetrySample[] = [];
  const hz = 10;
  for (let i = 0; i < 600; i++) {
    const t = i / hz;
    // Squat cycle of 4 s: angle oscillates between ~0 and ~95 degrees.
    const phase = (t % 4) / 4;
    const depth = Math.pow(Math.sin(phase * Math.PI), 2); // 0..1..0
    const hipAngle = depth * 95;
    const kneeAngle = depth * 92;
    const ankleAngle = depth * 24;
    const trunkLean = 12 + depth * 28;

    // Loads track depth with plausible peaks (1g-reference scaled ARED squat).
    const hipLoad = 620 + depth * 2280;
    const kneeLoad = 480 + depth * 1720;
    const ankleLoad = 310 + depth * 940;
    let lumbarMoment = 42 + depth * 96;

    // Gentle fatigue drift over the minute.
    const drift = t / 60;
    const hipLoad2 = hipLoad * (1 + drift * 0.05);
    const kneeLoad2 = kneeLoad * (1 + drift * 0.04);

    let poseConfidence = 0.97 - Math.abs(Math.sin(t * 1.7)) * 0.05 - drift * 0.04;

    // Scripted lumbar anomaly at ~38 s: trunk lean grows, lumbar moment spikes.
    const anomalyWindow = t >= 37.6 && t <= 40.2;
    if (anomalyWindow) {
      const ramp = Math.sin(((t - 37.6) / 2.6) * Math.PI);
      lumbarMoment += ramp * 78;
      poseConfidence -= ramp * 0.06;
    }

    // A short low-confidence window for demoing tracking loss.
    const lowConfWindow = t >= 20 && t <= 22;
    if (lowConfWindow) poseConfidence = 0.52;

    samples.push({
      t: Math.round(t * 10) / 10,
      hipAngle: Math.round(hipAngle * 10) / 10,
      kneeAngle: Math.round(kneeAngle * 10) / 10,
      ankleAngle: Math.round(ankleAngle * 10) / 10,
      trunkLeanAngle: Math.round(trunkLean * 10) / 10,
      hipLoad: Math.round(hipLoad2),
      kneeLoad: Math.round(kneeLoad2),
      ankleLoad: Math.round(ankleLoad),
      lumbarMoment: Math.round(lumbarMoment * 10) / 10,
      poseConfidence: Math.min(1, Math.max(0.4, Math.round(poseConfidence * 100) / 100)),
    });
  }
  return samples;
}

export const telemetry = {
  fps: 10,
  durationSec: 60,
  anomalyAtSec: 38,
  lowConfidenceFromSec: 20,
  lowConfidenceToSec: 22,
  samples: buildStream(),
};

/** Rep boundaries in seconds (one squat every 4 s, 24 reps). */
export const repBoundaries: number[] = Array.from({ length: 25 }, (_, i) => i * 4);
