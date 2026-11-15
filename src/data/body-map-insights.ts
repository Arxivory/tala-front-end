export interface MotionCoordinateInsight {
  name: string;
  label: string;
}

export interface BodyMotionInsight {
  bodyName: string;
  label: string;
  description: string;
  coordinates: readonly MotionCoordinateInsight[];
  heatmapCoordinate?: string;
  unavailableNote?: string;
}

export interface MovementPhaseSegment {
  phase: "ascent" | "descent";
  startTimeSeconds: number;
  endTimeSeconds: number;
}

export const BODY_MOTION_INSIGHTS: readonly BodyMotionInsight[] = [
  {
    bodyName: "pelvis",
    label: "Pelvis",
    description: "Estimated pelvis orientation during this recording.",
    coordinates: [
      { name: "pelvis_tilt", label: "Pelvis tilt" },
      { name: "pelvis_list", label: "Pelvis side tilt" },
      { name: "pelvis_rotation", label: "Pelvis rotation" },
    ],
    heatmapCoordinate: "pelvis_tilt",
  },
  {
    bodyName: "torso",
    label: "Torso",
    description: "Estimated lower-back and torso movement.",
    coordinates: [
      { name: "lumbar_extension", label: "Lower-back bend" },
      { name: "lumbar_bending", label: "Lower-back side bend" },
      { name: "lumbar_rotation", label: "Lower-back rotation" },
    ],
    heatmapCoordinate: "lumbar_extension",
  },
  {
    bodyName: "femur_r",
    label: "Right thigh",
    description: "Estimated right hip movement.",
    coordinates: [
      { name: "hip_flexion_r", label: "Hip bend" },
      { name: "hip_adduction_r", label: "Hip side movement" },
      { name: "hip_rotation_r", label: "Hip rotation" },
    ],
    heatmapCoordinate: "hip_flexion_r",
  },
  {
    bodyName: "femur_l",
    label: "Left thigh",
    description: "Estimated left hip movement.",
    coordinates: [
      { name: "hip_flexion_l", label: "Hip bend" },
      { name: "hip_adduction_l", label: "Hip side movement" },
      { name: "hip_rotation_l", label: "Hip rotation" },
    ],
    heatmapCoordinate: "hip_flexion_l",
  },
  {
    bodyName: "tibia_r",
    label: "Right lower leg",
    description: "Estimated right knee movement.",
    coordinates: [{ name: "knee_angle_r", label: "Knee bend" }],
    heatmapCoordinate: "knee_angle_r",
  },
  {
    bodyName: "tibia_l",
    label: "Left lower leg",
    description: "Estimated left knee movement.",
    coordinates: [{ name: "knee_angle_l", label: "Knee bend" }],
    heatmapCoordinate: "knee_angle_l",
  },
  {
    bodyName: "patella_r",
    label: "Right kneecap",
    description: "Model-estimated right kneecap movement.",
    coordinates: [{ name: "knee_angle_r_beta", label: "Kneecap movement" }],
    heatmapCoordinate: "knee_angle_r_beta",
  },
  {
    bodyName: "patella_l",
    label: "Left kneecap",
    description: "Model-estimated left kneecap movement.",
    coordinates: [{ name: "knee_angle_l_beta", label: "Kneecap movement" }],
    heatmapCoordinate: "knee_angle_l_beta",
  },
  {
    bodyName: "talus_r",
    label: "Right ankle joint",
    description: "Estimated right ankle movement.",
    coordinates: [{ name: "ankle_angle_r", label: "Ankle bend" }],
    heatmapCoordinate: "ankle_angle_r",
  },
  {
    bodyName: "talus_l",
    label: "Left ankle joint",
    description: "Estimated left ankle movement.",
    coordinates: [{ name: "ankle_angle_l", label: "Ankle bend" }],
    heatmapCoordinate: "ankle_angle_l",
  },
  {
    bodyName: "calcn_r",
    label: "Right foot",
    description: "Estimated right foot movement beneath the ankle.",
    coordinates: [{ name: "subtalar_angle_r", label: "Foot tilt" }],
    heatmapCoordinate: "subtalar_angle_r",
  },
  {
    bodyName: "calcn_l",
    label: "Left foot",
    description: "Estimated left foot movement beneath the ankle.",
    coordinates: [{ name: "subtalar_angle_l", label: "Foot tilt" }],
    heatmapCoordinate: "subtalar_angle_l",
  },
  {
    bodyName: "toes_r",
    label: "Right toes",
    description: "Estimated right toe movement.",
    coordinates: [{ name: "mtp_angle_r", label: "Toe bend" }],
    heatmapCoordinate: "mtp_angle_r",
  },
  {
    bodyName: "toes_l",
    label: "Left toes",
    description: "Estimated left toe movement.",
    coordinates: [{ name: "mtp_angle_l", label: "Toe bend" }],
    heatmapCoordinate: "mtp_angle_l",
  },
  {
    bodyName: "humerus_r",
    label: "Right upper arm",
    description: "The right arm was held in an assumed neutral pose.",
    coordinates: [],
    unavailableNote: "Right arm movement was not estimated from this recording.",
  },
  {
    bodyName: "humerus_l",
    label: "Left upper arm",
    description: "Estimated left shoulder movement.",
    coordinates: [
      { name: "arm_flex_l", label: "Arm forward movement" },
      { name: "arm_add_l", label: "Arm side movement" },
      { name: "arm_rot_l", label: "Arm rotation" },
    ],
    heatmapCoordinate: "arm_flex_l",
  },
  {
    bodyName: "ulna_r",
    label: "Right forearm",
    description: "The right arm was held in an assumed neutral pose.",
    coordinates: [],
    unavailableNote: "Right arm movement was not estimated from this recording.",
  },
  {
    bodyName: "radius_r",
    label: "Right forearm rotation",
    description: "The right arm was held in an assumed neutral pose.",
    coordinates: [],
    unavailableNote: "Right arm movement was not estimated from this recording.",
  },
  {
    bodyName: "ulna_l",
    label: "Left forearm",
    description: "Estimated left elbow and forearm movement.",
    coordinates: [
      { name: "elbow_flex_l", label: "Elbow bend" },
      { name: "pro_sup_l", label: "Forearm rotation" },
    ],
    heatmapCoordinate: "elbow_flex_l",
  },
  {
    bodyName: "radius_l",
    label: "Left forearm rotation",
    description: "Estimated left forearm rotation.",
    coordinates: [{ name: "pro_sup_l", label: "Forearm rotation" }],
    heatmapCoordinate: "pro_sup_l",
  },
];

export function getRangeColorRatio(value: number, minimum: number, maximum: number) {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum) ||
    maximum <= minimum
  ) {
    return undefined;
  }
  return Math.max(0, Math.min(1, (value - minimum) / (maximum - minimum)));
}

export function parseMovementPhases(value: unknown): MovementPhaseSegment[] {
  const root = asRecord(value);
  const segmentation = root && asRecord(root["segmentation"]);
  const segments = segmentation?.["segments"];
  if (!Array.isArray(segments) || !segments.length) {
    throw new Error("Movement analysis is missing its phase segments.");
  }

  const parsedSegments = segments.map((segment, index): MovementPhaseSegment => {
    const record = asRecord(segment);
    const phase = record?.["phase"];
    const startTimeSeconds = record?.["start_time"];
    const endTimeSeconds = record?.["end_time"];
    if (
      (phase !== "ascent" && phase !== "descent") ||
      typeof startTimeSeconds !== "number" ||
      !Number.isFinite(startTimeSeconds) ||
      typeof endTimeSeconds !== "number" ||
      !Number.isFinite(endTimeSeconds) ||
      endTimeSeconds <= startTimeSeconds
    ) {
      throw new Error(`Movement analysis contains an invalid phase segment (${index + 1}).`);
    }
    return { phase, startTimeSeconds, endTimeSeconds };
  });

  for (let index = 1; index < parsedSegments.length; index++) {
    const previous = parsedSegments[index - 1];
    const current = parsedSegments[index];
    if (!previous || !current || current.startTimeSeconds < previous.startTimeSeconds) {
      throw new Error("Movement analysis phase segments are not time-ordered.");
    }
  }

  return parsedSegments;
}

export function findMovementPhase(segments: readonly MovementPhaseSegment[], timeSeconds: number) {
  if (!Number.isFinite(timeSeconds)) return undefined;
  return (
    segments.find(
      (segment, index) =>
        timeSeconds >= segment.startTimeSeconds &&
        (timeSeconds < segment.endTimeSeconds ||
          (index === segments.length - 1 && timeSeconds <= segment.endTimeSeconds)),
    )?.phase ?? undefined
  );
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
