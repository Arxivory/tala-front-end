import type { StatusLevel } from "./types";

export interface MovementEstimate {
  id: "hip" | "knee" | "ankle";
  label: string;
  rightExcursionDeg: number;
  leftExcursionDeg: number;
  status: StatusLevel;
  confidence: "low";
  interpretation: string;
}

export const researchDemoAssessment = {
  source: "public/data/videos/squat_segment.mp4",
  originalVideo: "/data/videos/squat_segment.mp4",
  poseVideo: "/data/videos/visualizations/pose_overlay.mp4",
  durationSeconds: 9.4,
  frameCount: 282,
  samplingRateHz: 29.97,
  repetitionsDetected: 2,
  completeness: "incomplete",
  reconstructionStatus: "limited",
  rmsFittingErrorMeters: 0.030645953647046163,
  ascentPhases: 4,
  descentPhases: 3,
  baselineComparisonAvailable: false,
  jointLoadsAvailable: false,
  gravityContext: [
    { environment: "Microgravity (0g)", gravity: "0.00 m/s²", energyDifferenceJ: 0 },
    { environment: "Lunar (0.16g)", gravity: "1.62 m/s²", energyDifferenceJ: 23.122207698952344 },
    { environment: "Mars (0.38g)", gravity: "3.71 m/s²", energyDifferenceJ: 52.95271022414394 },
    {
      environment: "Earth reference (1g)",
      gravity: "9.81 m/s²",
      energyDifferenceJ: 139.9699988462537,
    },
  ],
  movementEstimates: [
    {
      id: "hip",
      label: "Hip coordinate excursion",
      rightExcursionDeg: 114.09,
      leftExcursionDeg: 90.89,
      status: "caution",
      confidence: "low",
      interpretation:
        "Estimated coordinate range from monocular video and OpenSim inverse kinematics; not a clinical range-of-motion assessment.",
    },
    {
      id: "knee",
      label: "Knee coordinate excursion",
      rightExcursionDeg: 139.78,
      leftExcursionDeg: 132.09,
      status: "caution",
      confidence: "low",
      interpretation:
        "Estimated coordinate range from monocular video and OpenSim inverse kinematics; not a clinical range-of-motion assessment.",
    },
    {
      id: "ankle",
      label: "Ankle coordinate excursion",
      rightExcursionDeg: 45.5,
      leftExcursionDeg: 41.12,
      status: "caution",
      confidence: "low",
      interpretation:
        "Estimated coordinate range from monocular video and OpenSim inverse kinematics; not a clinical range-of-motion assessment.",
    },
  ] satisfies MovementEstimate[],
} as const;
