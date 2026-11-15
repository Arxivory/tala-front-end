import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ConfidenceBadge, DemoTag, MetricCard, StatusPill } from "@/components/tala";
import { loadGravityAnalysis, type GravityAnalysisData } from "@/data/gravity-analysis";
import type { GravityRegime } from "@/data/types";

const GRAVITY_REGIMES: { regime: GravityRegime; environment: string }[] = [
  { regime: "0g", environment: "Microgravity" },
  { regime: "0.16g", environment: "Lunar" },
  { regime: "0.38g", environment: "Mars" },
  { regime: "1g", environment: "Earth reference" },
];

function formatNumber(value: number, decimals = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function GravityAnalysisPanel({
  selectedRegime,
  onSelectRegime,
}: {
  selectedRegime: GravityRegime;
  onSelectRegime: (regime: GravityRegime) => void;
}) {
  const [analysis, setAnalysis] = useState<GravityAnalysisData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setAnalysis(null);
    setLoadError(null);
    void loadGravityAnalysis(controller.signal)
      .then(setAnalysis)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(
          error instanceof Error ? error.message : "Unable to load gravity analysis data.",
        );
      });
    return () => controller.abort();
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gravity analysis</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-strong">
              Potential-energy context
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              The same reconstructed squat movement is evaluated under four gravity assumptions.
              Selecting a scenario highlights its precomputed result; it does not recalculate the
              movement or baseline. This research result is separate from the date, exercise, and
              source filters above.
            </p>
          </div>
          <DemoTag label="tala_output.json · research output" />
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Highlight a gravity scenario
          </legend>
          <div className="flex flex-wrap gap-2">
            {GRAVITY_REGIMES.map((scenario) => (
              <Button
                key={scenario.regime}
                type="button"
                size="sm"
                variant={selectedRegime === scenario.regime ? "default" : "outline"}
                className="min-h-10 rounded-full"
                aria-pressed={selectedRegime === scenario.regime}
                onClick={() => onSelectRegime(scenario.regime)}
              >
                {scenario.environment} · {scenario.regime}
              </Button>
            ))}
          </div>
        </fieldset>

        {loadError ? (
          <div
            role="alert"
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-status-caution/50 bg-status-caution/10 p-4 text-sm"
          >
            <p className="text-body">{loadError}</p>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Retry
            </Button>
          </div>
        ) : analysis ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <MetricCard
              title="Modeled OpenSim body mass"
              value={formatNumber(analysis.modeledBodyMassKg)}
              unit="kg"
              status="neutral"
              confidence="low"
              footnote="Model-derived value for this research reconstruction; not a current astronaut measurement."
            />
            <MetricCard
              title="Reconstructed center-of-mass excursion"
              value={formatNumber(analysis.centerOfMassHeightExcursionMeters, 3)}
              unit="m"
              status="neutral"
              confidence="low"
              footnote={`Estimated from the fixed reconstructed trajectory along the ${analysis.verticalAxis} vertical axis.`}
            />
          </div>
        ) : (
          <p role="status" className="mt-5 text-sm text-muted-foreground">
            Loading precomputed gravity analysis…
          </p>
        )}
      </section>

      {analysis ? (
        <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-bold text-strong">Scenario comparison</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {analysis.method} Vertical axis: {analysis.verticalAxis}. {analysis.energyMetric}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status="neutral" size="small" />
              <ConfidenceBadge level="low" />
            </div>
          </div>

          <div
            className="mt-4 h-72 w-full"
            role="img"
            aria-label="Bar chart comparing modeled potential-energy differences across microgravity, lunar, Mars, and Earth reference scenarios. The reconstructed movement is held fixed."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...analysis.scenarios]}
                layout="vertical"
                margin={{ top: 8, right: 24, bottom: 8, left: 12 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, "dataMax"]}
                  tickFormatter={(value: number) => formatNumber(value, 0)}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Potential-energy difference (J)",
                    position: "insideBottom",
                    offset: -4,
                    fill: "var(--muted-foreground)",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="environment"
                  width={112}
                  tick={{ fill: "var(--foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    `${formatNumber(Number(value))} J`,
                    "Potential-energy difference",
                  ]}
                  labelFormatter={(label) => `${label} · same fixed trajectory`}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar
                  dataKey="energyDifferenceJ"
                  name="Potential-energy difference"
                  radius={[0, 6, 6, 0]}
                >
                  {analysis.scenarios.map((scenario) => (
                    <Cell
                      key={scenario.regime}
                      fill={
                        selectedRegime === scenario.regime ? "var(--chart-1)" : "var(--chart-2)"
                      }
                      fillOpacity={selectedRegime === scenario.regime ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">
                Modeled gravity scenario, acceleration, potential-energy difference, status, and
                confidence
              </caption>
              <thead className="border-y border-border bg-muted/50 text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Scenario</th>
                  <th className="px-3 py-3 text-right">Gravity</th>
                  <th className="px-3 py-3 text-right">Potential-energy difference</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {analysis.scenarios.map((scenario) => (
                  <tr
                    key={scenario.regime}
                    className={`border-b border-border/70 ${
                      selectedRegime === scenario.regime ? "bg-primary-100/50" : ""
                    }`}
                  >
                    <th scope="row" className="px-3 py-3 font-medium text-strong">
                      {scenario.environment} ({scenario.regime})
                      {selectedRegime === scenario.regime ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          Selected context
                        </span>
                      ) : null}
                    </th>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatNumber(scenario.gravityMetersPerSecondSquared)} m/s²
                    </td>
                    <td className="px-3 py-3 text-right font-medium tabular-nums text-strong">
                      {formatNumber(scenario.energyDifferenceJ)} J
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status="neutral" size="small" />
                    </td>
                    <td className="px-3 py-3">
                      <ConfidenceBadge level="low" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold text-strong">Interpretation</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                {analysis.interpretations.map((interpretation) => (
                  <li key={interpretation}>{interpretation}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold text-strong">Model limitations</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                {analysis.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            This single research reconstruction does not establish an astronaut baseline. Scenario
            values are not muscle work, metabolic expenditure, exercise effort, joint loading,
            adaptation, or a clinical assessment.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/app/body">Review the movement reconstruction</Link>
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
