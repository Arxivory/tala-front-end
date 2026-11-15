import { describe, expect, it } from "vitest";

import {
  getBaselineSummary,
  getSessionSummary,
  getTrendSessions,
  illustrativeTrendSessions,
  researchTrendSession,
} from "@/data/trends";

describe("Trends data", () => {
  it("keeps research output separate from illustrative session history", () => {
    expect(getTrendSessions("illustrative", "all")).toEqual(illustrativeTrendSessions);
    expect(getTrendSessions("research", "all")).toEqual([researchTrendSession]);
    expect(researchTrendSession.date).toBeNull();
    expect(researchTrendSession.processedOn).toBe("2026-11-13");
    expect(researchTrendSession.averageRepetitionDurationSeconds).toBeCloseTo(2.7191, 4);
  });

  it("filters selected date windows using the reference date", () => {
    expect(getTrendSessions("illustrative", "7d").map((session) => session.id)).toEqual([
      "DEMO-007",
      "DEMO-008",
    ]);
    expect(getTrendSessions("research", "7d")).toEqual([researchTrendSession]);
    expect(getTrendSessions("illustrative", "30d")).toHaveLength(8);
  });

  it("derives the illustrative baseline only from designated compatible demo sessions", () => {
    const baseline = getBaselineSummary("illustrative");

    expect(baseline.state).toBe("established");
    expect(baseline.compatibleSessionCount).toBe(8);
    expect(baseline.referenceSessionCount).toBe(4);
    expect(baseline.mean?.hip).toBeCloseTo(107.35);
    expect(baseline.range?.knee).toEqual({ min: 132.1, max: 137.4 });
    expect(getBaselineSummary("illustrative", illustrativeTrendSessions.slice(0, 3)).state).toBe(
      "provisional",
    );
    expect(getBaselineSummary("illustrative", illustrativeTrendSessions.slice(0, 2)).state).toBe(
      "insufficient",
    );
    expect(getBaselineSummary("research")).toMatchObject({
      state: "insufficient",
      compatibleSessionCount: 0,
      mean: null,
    });
  });

  it("computes average repetition duration weighted by detected repetitions", () => {
    const summary = getSessionSummary([
      { ...illustrativeTrendSessions[0]!, repetitions: 2, averageRepetitionDurationSeconds: 3 },
      { ...illustrativeTrendSessions[1]!, repetitions: 4, averageRepetitionDurationSeconds: 1.5 },
    ]);

    expect(summary).toEqual({
      sessionCount: 2,
      repetitions: 6,
      averageRepetitionDurationSeconds: 2,
    });
    expect(getSessionSummary([]).averageRepetitionDurationSeconds).toBeNull();
  });
});
