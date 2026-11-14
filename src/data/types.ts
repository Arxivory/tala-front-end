// TALA core domain types. Shared by every mock-data module and component.

export type Role = "astronaut" | "cmo";

export type GravityRegime = "0g" | "0.16g" | "0.38g" | "1g";

export type StatusLevel = "optimal" | "caution" | "anomaly" | "neutral" | "no-data";

export type ExerciseName =
  | "Squat"
  | "Deadlift"
  | "Heel raise"
  | "Bench press"
  | "Row"
  | "Custom";

export type EquipmentName = "ARED" | "Flywheel" | "Bodyweight";

export type SyncState = "Queued" | "Sending" | "Delivered" | "Retrying";

export interface CrewMember {
  id: string;
  name: string;
  role: Role;
  title: string;
  heightCm: number;
  massKg: number;
  sex: "female" | "male";
  age: number;
  dominantSide: "left" | "right";
}

export interface RepRecord {
  /** Global rep index across the session, 1-based. */
  index: number;
  set: number;
  repInSet: number;
  /** Seconds from session start. */
  timestamp: number;
  status: StatusLevel;
  femoralStrainPct: number;
  confidence: "high" | "medium" | "low";
}

export interface PeakLoads {
  /** Joint reaction forces in newtons. */
  hip: number;
  knee: number;
  ankle: number;
  /** Lumbar moment in newton-metres. */
  lumbar: number;
}

export interface Session {
  id: string;
  crewId: string;
  /** Mission day the session was performed. */
  missionDay: number;
  /** ISO date string. */
  date: string;
  exercise: ExerciseName;
  regime: GravityRegime;
  equipment: EquipmentName;
  sets: number;
  repsPerSet: number;
  targetLoadKg: number;
  durationSec: number;
  peaks: PeakLoads;
  /** Femoral mechanical strain as a percent of the astronaut's 1g reference session. */
  femoralStrainPct: number;
  /** Minimum margin to any cited upper bound, percent. */
  safetyMargin: number;
  /** Form stability score, 0 to 100. */
  formStability: number;
  confidence: "high" | "medium" | "low";
  status: StatusLevel;
  flags?: string[] | undefined;
  reviewedByCmo?: boolean | undefined;
  notes?: string | undefined;
  reps: RepRecord[];
}

export interface ThresholdRow {
  id: string;
  metric: string;
  value: number;
  unit: string;
  citation: string;
  note: string;
  lastEditedBy: string;
  lastEditedDate: string;
}

export interface DocExcerpt {
  id: string;
  documentId: string;
  title: string;
  section: string;
  page: number;
  excerpt: string;
  verified: boolean;
  chunks: number;
  lastIndexed: string;
  version: string;
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  sourceIds: string[];
  retrievalConfidence: "high" | "medium" | "low";
}

export interface SyncBundle {
  id: string;
  contents: string;
  sizeBytes: number;
  compressedBytes: number;
  priority: "routine" | "priority" | "anomaly";
  state: SyncState;
  createdAt: string;
  anomalyRef?: string;
}

export interface TelemetrySample {
  /** Seconds from session start. */
  t: number;
  /** Joint angles in degrees. */
  hipAngle: number;
  kneeAngle: number;
  ankleAngle: number;
  trunkLeanAngle: number;
  /** Joint reaction forces in newtons; lumbar is a moment in newton-metres. */
  hipLoad: number;
  kneeLoad: number;
  ankleLoad: number;
  lumbarMoment: number;
  poseConfidence: number;
}

export interface CheckIn {
  /** ISO date (yyyy-mm-dd). */
  date: string;
  sleepHours: number;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  fatigue: "none" | "mild" | "moderate" | "high" | "severe";
  soreness: { site: string; severity: "mild" | "moderate" | "high" }[];
  mood?: 1 | 2 | 3 | 4 | 5;
  stress?: 1 | 2 | 3 | 4 | 5;
  hydration?: boolean;
  nutrition?: boolean;
  note?: string;
  skipped?: boolean;
}
