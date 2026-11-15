import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { describe, expect, it } from "vitest";

import { parseGravityAnalysis } from "@/data/gravity-analysis";

const output = {
  assessment: {
    gravity_context: {
      method: "Potential-energy analysis",
      vertical_axis: "OpenSim Y",
      metrics: {
        total_body_mass_kg: 74.3,
        com_height_excursion_m: 0.684,
      },
      environments: {
        microgravity: {
          metrics: {
            gravity_m_per_s2: 0,
            energy_difference_to_return_to_initial_height_j: 0,
          },
        },
        moon: {
          metrics: {
            gravity_m_per_s2: 1.62,
            energy_difference_to_return_to_initial_height_j: 23.12,
          },
        },
        mars: {
          metrics: {
            gravity_m_per_s2: 3.71,
            energy_difference_to_return_to_initial_height_j: 52.95,
          },
        },
        earth: {
          metrics: {
            gravity_m_per_s2: 9.80665,
            energy_difference_to_return_to_initial_height_j: 139.97,
          },
        },
      },
      interpretation: ["The same trajectory is compared across environments."],
      limitations: ["The reconstruction is approximate."],
    },
  },
};

describe("Gravity analysis data", () => {
  it("maps the reported JSON scenarios into typed, unit-ready values", () => {
    expect(parseGravityAnalysis(output)).toMatchObject({
      method: "Potential-energy analysis",
      verticalAxis: "OpenSim Y",
      modeledBodyMassKg: 74.3,
      centerOfMassHeightExcursionMeters: 0.684,
      scenarios: [
        { regime: "0g", environment: "Microgravity", gravityMetersPerSecondSquared: 0 },
        {
          regime: "0.16g",
          environment: "Lunar",
          gravityMetersPerSecondSquared: 1.62,
          energyDifferenceJ: 23.12,
        },
        {
          regime: "0.38g",
          environment: "Mars",
          gravityMetersPerSecondSquared: 3.71,
          energyDifferenceJ: 52.95,
        },
        {
          regime: "1g",
          environment: "Earth reference",
          gravityMetersPerSecondSquared: 9.80665,
          energyDifferenceJ: 139.97,
        },
      ],
    });
  });

  it("parses the checked-in research output", async () => {
    const source = await readFile(
      join(cwd(), "public", "data", "tala-overall", "tala_output.json"),
      "utf8",
    );

    const result = parseGravityAnalysis(JSON.parse(source));
    expect(result.scenarios).toHaveLength(4);
    expect(result.scenarios[1]).toMatchObject({
      environment: "Lunar",
      energyDifferenceJ: expect.closeTo(23.122207698952344),
    });
    expect(result.interpretations.length).toBeGreaterThan(0);
    expect(result.limitations.length).toBeGreaterThan(0);
  });

  it("rejects incomplete or non-finite source data instead of showing fallback values", () => {
    expect(() =>
      parseGravityAnalysis({
        assessment: { gravity_context: { ...output.assessment.gravity_context, environments: {} } },
      }),
    ).toThrow("Microgravity scenario");

    const invalidOutput = structuredClone(output);
    invalidOutput.assessment.gravity_context.metrics.total_body_mass_kg = Number.NaN;
    expect(() => parseGravityAnalysis(invalidOutput)).toThrow("modeled body mass");
  });
});
