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
  repetitionDurationsSeconds: [2.5689605278, 2.8692286415],
  completeness: "incomplete",
  reconstructionStatus: "limited",
  rmsFittingErrorMeters: 0.030645953647046163,
  ascentPhases: 4,
  descentPhases: 3,
  baselineComparisonAvailable: false,
  jointLoadsAvailable: false,
  gravityContext: {
    method:
      "Whole-body gravitational potential-energy comparison using the OpenSim model center of mass.",
    verticalAxis: "OpenSim Y",
    modeledBodyMassKg: 74.30439078738935,
    centerOfMassHeightExcursionMeters: 0.6841703142436071,
    energyMetric:
      "Potential-energy difference from the lowest reconstructed center-of-mass height to the initial height.",
    interpretation:
      "The same reconstructed movement is evaluated under each gravity condition. These values are not measured muscle work, metabolic expenditure, movement adaptation, muscle activation, joint loading, or exercise resistance.",
    limitations: [
      "Center-of-mass estimates depend on the scaled OpenSim model and reconstructed kinematics.",
      "The input is a monocular-video-derived reconstruction, not calibrated motion capture.",
      "The reconstructed movement is held fixed across gravitational environments.",
      "Phase boundaries are estimated from the smoothed center-of-mass signal.",
    ],
    scenarios: [
      {
        regime: "0g",
        environment: "Microgravity",
        gravityMetersPerSecondSquared: 0,
        energyDifferenceJ: 0,
      },
      {
        regime: "0.16g",
        environment: "Lunar",
        gravityMetersPerSecondSquared: 1.62,
        energyDifferenceJ: 23.122207698952344,
      },
      {
        regime: "0.38g",
        environment: "Mars",
        gravityMetersPerSecondSquared: 3.71,
        energyDifferenceJ: 52.95271022414394,
      },
      {
        regime: "1g",
        environment: "Earth reference",
        gravityMetersPerSecondSquared: 9.80665,
        energyDifferenceJ: 139.9699988462537,
      },
    ],
  },
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
