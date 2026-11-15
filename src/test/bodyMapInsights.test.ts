import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  BODY_MOTION_INSIGHTS,
  findMovementPhase,
  getRangeColorRatio,
  parseMovementPhases,
} from "@/data/body-map-insights";
import { parseOpenSimMot } from "@/components/tala-sections/opensimViewer";

describe("Body Map movement insights", () => {
  it("maps modeled body parts to coordinates available in the supplied MOT", async () => {
    const motionText = await readFile(
      resolve(process.cwd(), "public", "data", "opensim-models", "opensim_motion.mot"),
      "utf8",
    );
    const motion = parseOpenSimMot(motionText);

    for (const insight of BODY_MOTION_INSIGHTS) {
      for (const coordinate of insight.coordinates) {
        expect(motion.columnIndices.has(coordinate.name), coordinate.name).toBe(true);
      }
      if (insight.heatmapCoordinate) {
        expect(motion.columnIndices.has(insight.heatmapCoordinate)).toBe(true);
      }
    }

    expect(
      BODY_MOTION_INSIGHTS.filter((insight) => insight.unavailableNote).map(
        (insight) => insight.bodyName,
      ),
    ).toEqual(["humerus_r", "ulna_r", "radius_r"]);
  });

  it("normalizes the selected value only within its observed range", () => {
    expect(getRangeColorRatio(2, 0, 4)).toBe(0.5);
    expect(getRangeColorRatio(-2, 0, 4)).toBe(0);
    expect(getRangeColorRatio(6, 0, 4)).toBe(1);
    expect(getRangeColorRatio(4, 4, 4)).toBeUndefined();
  });

  it("parses supplied squat phases and resolves the phase at each sample time", async () => {
    const analysisText = await readFile(
      resolve(process.cwd(), "public", "data", "movement-analysis", "movement_analysis.json"),
      "utf8",
    );
    const phases = parseMovementPhases(JSON.parse(analysisText) as unknown);

    expect(phases).toHaveLength(7);
    expect(findMovementPhase(phases, 1)).toBe("ascent");
    expect(findMovementPhase(phases, 2)).toBe("descent");
    expect(findMovementPhase(phases, 10)).toBeUndefined();
    expect(() => parseMovementPhases({ segmentation: { segments: [] } })).toThrow(
      "missing its phase segments",
    );
  });
});
