import type { GravityRegime } from "./types";

const GRAVITY_ANALYSIS_URL = "/data/tala-overall/tala_output.json";

const SCENARIOS: {
  key: string;
  regime: GravityRegime;
  environment: string;
}[] = [
  { key: "microgravity", regime: "0g", environment: "Microgravity" },
  { key: "moon", regime: "0.16g", environment: "Lunar" },
  { key: "mars", regime: "0.38g", environment: "Mars" },
  { key: "earth", regime: "1g", environment: "Earth reference" },
];

export interface GravityScenario {
  regime: GravityRegime;
  environment: string;
  gravityMetersPerSecondSquared: number;
  energyDifferenceJ: number;
}

export interface GravityAnalysisData {
  method: string;
  verticalAxis: string;
  modeledBodyMassKg: number;
  centerOfMassHeightExcursionMeters: number;
  energyMetric: string;
  interpretations: string[];
  limitations: string[];
  scenarios: GravityScenario[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`Gravity analysis data is missing ${label}.`);
  }
  return value;
}

function requireNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Gravity analysis data has an invalid ${label}.`);
  }
  return value;
}

function requireText(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Gravity analysis data is missing ${label}.`);
  }
  return value;
}

function requireTextList(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Gravity analysis data has an invalid ${label}.`);
  }
  return value;
}

export function parseGravityAnalysis(value: unknown): GravityAnalysisData {
  const root = requireRecord(value, "the output object");
  const assessment = requireRecord(root["assessment"], "the assessment");
  const context = requireRecord(assessment["gravity_context"], "the gravity context");
  const metrics = requireRecord(context["metrics"], "the whole-body metrics");
  const environments = requireRecord(context["environments"], "the gravity environments");
  const scenarios = SCENARIOS.map(({ key, regime, environment }) => {
    const scenario = requireRecord(environments[key], `${environment} scenario`);
    const scenarioMetrics = requireRecord(scenario["metrics"], `${environment} metrics`);

    return {
      regime,
      environment,
      gravityMetersPerSecondSquared: requireNumber(
        scenarioMetrics["gravity_m_per_s2"],
        `${environment} gravity`,
      ),
      energyDifferenceJ: requireNumber(
        scenarioMetrics["energy_difference_to_return_to_initial_height_j"],
        `${environment} potential-energy difference`,
      ),
    };
  });

  const interpretation = requireTextList(context["interpretation"], "interpretation notes");
  const limitations = requireTextList(context["limitations"], "limitations");
  if (interpretation.length === 0 || limitations.length === 0) {
    throw new Error("Gravity analysis data must include interpretation and limitation notes.");
  }

  return {
    method: requireText(context["method"], "the calculation method"),
    verticalAxis: requireText(context["vertical_axis"], "the vertical-axis definition"),
    modeledBodyMassKg: requireNumber(metrics["total_body_mass_kg"], "modeled body mass"),
    centerOfMassHeightExcursionMeters: requireNumber(
      metrics["com_height_excursion_m"],
      "center-of-mass height excursion",
    ),
    energyMetric:
      "Potential-energy difference from the lowest reconstructed center-of-mass height to the initial height.",
    interpretations: interpretation,
    limitations,
    scenarios,
  };
}

export async function loadGravityAnalysis(signal?: AbortSignal): Promise<GravityAnalysisData> {
  const response = await fetch(GRAVITY_ANALYSIS_URL, signal ? { signal } : undefined);
  if (!response.ok) {
    throw new Error(`Unable to load gravity analysis data (${response.status}).`);
  }
  return parseGravityAnalysis(await response.json());
}
