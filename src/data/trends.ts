import { researchDemoAssessment, type MovementEstimate } from "./research-demo-assessment";

export type TrendSource = "illustrative" | "research";
export type TrendDateRange = "7d" | "30d" | "90d" | "all";
export type MovementMetric = "hip" | "knee" | "ankle";

export interface TrendSession {
  id: string;
  source: TrendSource;
  exercise: "Squat";
  date: string | null;
  processedOn: string | null;
  repetitions: number;
  recordingDurationSeconds: number;
  averageRepetitionDurationSeconds: number;
  coordinateExcursionsDeg: Record<MovementMetric, number>;
  phaseSegments: { ascent: number; descent: number } | null;
  baselineReference: boolean;
  reconstructionStatus: string;
  reconstructionQuality: "illustrative" | "limited";
  confidence?: "low";
  status?: MovementEstimate["status"];
  movementEstimates?: readonly MovementEstimate[];
}

export const TRENDS_REFERENCE_DATE = "2026-11-15";

export const illustrativeTrendSessions: TrendSession[] = [
  {
    id: "DEMO-001",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-10-18",
    processedOn: null,
    repetitions: 12,
    recordingDurationSeconds: 39.4,
    averageRepetitionDurationSeconds: 2.64,
    coordinateExcursionsDeg: { hip: 105.4, knee: 132.1, ankle: 46.8 },
    phaseSegments: null,
    baselineReference: true,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-002",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-10-21",
    processedOn: null,
    repetitions: 12,
    recordingDurationSeconds: 40.1,
    averageRepetitionDurationSeconds: 2.71,
    coordinateExcursionsDeg: { hip: 108.2, knee: 135.7, ankle: 47.5 },
    phaseSegments: null,
    baselineReference: true,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-003",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-10-24",
    processedOn: null,
    repetitions: 10,
    recordingDurationSeconds: 36.8,
    averageRepetitionDurationSeconds: 2.58,
    coordinateExcursionsDeg: { hip: 106.7, knee: 134.2, ankle: 46.1 },
    phaseSegments: null,
    baselineReference: true,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-004",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-10-27",
    processedOn: null,
    repetitions: 12,
    recordingDurationSeconds: 41.3,
    averageRepetitionDurationSeconds: 2.76,
    coordinateExcursionsDeg: { hip: 109.1, knee: 137.4, ankle: 48.2 },
    phaseSegments: null,
    baselineReference: true,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-005",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-11-01",
    processedOn: null,
    repetitions: 14,
    recordingDurationSeconds: 43.5,
    averageRepetitionDurationSeconds: 2.69,
    coordinateExcursionsDeg: { hip: 107.8, knee: 136.8, ankle: 47.1 },
    phaseSegments: null,
    baselineReference: false,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-006",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-11-05",
    processedOn: null,
    repetitions: 12,
    recordingDurationSeconds: 40.7,
    averageRepetitionDurationSeconds: 2.81,
    coordinateExcursionsDeg: { hip: 111.3, knee: 139.6, ankle: 49.4 },
    phaseSegments: null,
    baselineReference: false,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-007",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-11-09",
    processedOn: null,
    repetitions: 15,
    recordingDurationSeconds: 46.2,
    averageRepetitionDurationSeconds: 2.73,
    coordinateExcursionsDeg: { hip: 110.2, knee: 138.9, ankle: 48.6 },
    phaseSegments: null,
    baselineReference: false,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
  {
    id: "DEMO-008",
    source: "illustrative",
    exercise: "Squat",
    date: "2026-11-14",
    processedOn: null,
    repetitions: 12,
    recordingDurationSeconds: 40.9,
    averageRepetitionDurationSeconds: 2.68,
    coordinateExcursionsDeg: { hip: 112.4, knee: 141.2, ankle: 50.1 },
    phaseSegments: null,
    baselineReference: false,
    reconstructionStatus: "Illustrative demo record",
    reconstructionQuality: "illustrative",
  },
];

function meanExcursion(metric: MovementMetric): number {
  const estimate = researchDemoAssessment.movementEstimates.find((item) => item.id === metric);
  if (!estimate) {
    throw new Error(`Research movement output is missing the ${metric} estimate.`);
  }
  return (estimate.rightExcursionDeg + estimate.leftExcursionDeg) / 2;
}

const averageResearchRepDuration =
  researchDemoAssessment.repetitionDurationsSeconds.reduce(
    (total, duration) => total + duration,
    0,
  ) / researchDemoAssessment.repetitionDurationsSeconds.length;

export const researchTrendSession: TrendSession = {
  id: "RCH-001",
  source: "research",
  exercise: "Squat",
  date: null,
  processedOn: "2026-11-13",
  repetitions: researchDemoAssessment.repetitionsDetected,
  recordingDurationSeconds: researchDemoAssessment.durationSeconds,
  averageRepetitionDurationSeconds: averageResearchRepDuration,
  coordinateExcursionsDeg: {
    hip: meanExcursion("hip"),
    knee: meanExcursion("knee"),
    ankle: meanExcursion("ankle"),
  },
  phaseSegments: {
    ascent: researchDemoAssessment.ascentPhases,
    descent: researchDemoAssessment.descentPhases,
  },
  baselineReference: false,
  reconstructionStatus: "Incomplete recording",
  reconstructionQuality: "limited",
  confidence: "low",
  status: "caution",
  movementEstimates: researchDemoAssessment.movementEstimates,
};

export const trendSessions: TrendSession[] = [...illustrativeTrendSessions, researchTrendSession];

export function getTrendSessions(
  source: TrendSource,
  range: TrendDateRange,
  referenceDate = TRENDS_REFERENCE_DATE,
): TrendSession[] {
  const sourceSessions = trendSessions.filter((session) => session.source === source);
  if (range === "all") return sourceSessions;

  const dayCount = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const reference = Date.parse(`${referenceDate}T00:00:00Z`);
  const earliest = reference - (dayCount - 1) * 24 * 60 * 60 * 1000;

  return sourceSessions.filter((session) => {
    const date = session.date ?? session.processedOn;
    if (!date) return false;
    const timestamp = Date.parse(`${date}T00:00:00Z`);
    return timestamp >= earliest && timestamp <= reference;
  });
}

export interface BaselineSummary {
  state: "insufficient" | "provisional" | "established";
  compatibleSessionCount: number;
  referenceSessionCount: number;
  mean: Record<MovementMetric, number> | null;
  range: Record<MovementMetric, { min: number; max: number }> | null;
}

export function getBaselineSummary(
  source: TrendSource,
  sessions: readonly TrendSession[] = illustrativeTrendSessions,
): BaselineSummary {
  if (source !== "illustrative") {
    return {
      state: "insufficient",
      compatibleSessionCount: 0,
      referenceSessionCount: 0,
      mean: null,
      range: null,
    };
  }

  const compatible = sessions
    .filter((session) => session.source === "illustrative" && session.exercise === "Squat")
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  const referenceSessions = compatible.filter((session) => session.baselineReference);
  const state =
    compatible.length >= 6
      ? "established"
      : compatible.length >= 3
        ? "provisional"
        : "insufficient";

  if (referenceSessions.length < 3) {
    return {
      state,
      compatibleSessionCount: compatible.length,
      referenceSessionCount: referenceSessions.length,
      mean: null,
      range: null,
    };
  }

  const mean = {} as Record<MovementMetric, number>;
  const range = {} as Record<MovementMetric, { min: number; max: number }>;

  for (const metric of ["hip", "knee", "ankle"] as const) {
    const values = referenceSessions.map((session) => session.coordinateExcursionsDeg[metric]);
    mean[metric] = values.reduce((total, value) => total + value, 0) / values.length;
    range[metric] = { min: Math.min(...values), max: Math.max(...values) };
  }

  return {
    state,
    compatibleSessionCount: compatible.length,
    referenceSessionCount: referenceSessions.length,
    mean,
    range,
  };
}

export function getSessionSummary(sessions: readonly TrendSession[]) {
  const repetitions = sessions.reduce((total, session) => total + session.repetitions, 0);
  const weightedDuration = sessions.reduce(
    (total, session) => total + session.averageRepetitionDurationSeconds * session.repetitions,
    0,
  );

  return {
    sessionCount: sessions.length,
    repetitions,
    averageRepetitionDurationSeconds: repetitions ? weightedDuration / repetitions : null,
  };
}
