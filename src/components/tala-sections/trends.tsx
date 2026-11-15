import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  LineChart as LineChartIcon,
  Video,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { GravityAnalysisPanel } from "@/components/tala-sections/GravityAnalysisPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ConfidenceBadge,
  DemoTag,
  MetricCard,
  StatusPill,
  ViewAsTableToggle,
} from "@/components/tala";
import {
  getBaselineSummary,
  getSessionSummary,
  getTrendSessions,
  researchTrendSession,
  TRENDS_REFERENCE_DATE,
  type BaselineSummary,
  type MovementMetric,
  type TrendDateRange,
  type TrendSession,
  type TrendSource,
} from "@/data/trends";
import { useApp } from "@/lib/app-state";

export type TrendTab = "overview" | "movement" | "sessions" | "gravity";
type TrendView = "chart" | "table";
type ValueMode = "measurement" | "deviation";

interface TrendPoint {
  sessionId: string;
  source: string;
  date: string;
  shortDate: string;
  value: number;
  deviation: number | null;
}

interface TooltipPoint {
  sessionId: string;
  source: string;
  date: string;
}

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    color?: string;
    payload?: TooltipPoint;
  }>;
  unit: string;
}

const DATE_RANGES: { id: TrendDateRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All" },
];

const TABS: { id: TrendTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "movement", label: "Movement trends", icon: LineChartIcon },
  { id: "sessions", label: "Sessions", icon: CalendarDays },
  { id: "gravity", label: "Gravity analysis", icon: Activity },
];

const METRICS: { id: MovementMetric; label: string; fullLabel: string }[] = [
  { id: "hip", label: "Hip", fullLabel: "Hip coordinate excursion" },
  { id: "knee", label: "Knee", fullLabel: "Knee coordinate excursion" },
  { id: "ankle", label: "Ankle", fullLabel: "Ankle coordinate excursion" },
];

const METRIC_COLORS: Record<MovementMetric, string> = {
  hip: "var(--chart-1)",
  knee: "var(--chart-2)",
  ankle: "var(--chart-3)",
};

const TABS_CLASS =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatNumber(value: number, decimals = 1) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatSigned(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(value))}`;
}

function displayDate(session: TrendSession) {
  if (session.date) return formatDate(session.date);
  return session.processedOn
    ? `Recording date unavailable · processed ${formatDate(session.processedOn)}`
    : "Date unavailable";
}

function toTrendPoints(
  sessions: readonly TrendSession[],
  metric: MovementMetric,
  baseline: BaselineSummary,
): TrendPoint[] {
  return [...sessions]
    .sort((a, b) => (a.date ?? a.processedOn ?? "").localeCompare(b.date ?? b.processedOn ?? ""))
    .flatMap((session) => {
      const date = session.date ?? session.processedOn;
      if (!date) return [];
      const value = session.coordinateExcursionsDeg[metric];
      return [
        {
          sessionId: session.id,
          source: session.source,
          date,
          shortDate: formatDate(date).replace(/, \d{4}$/, ""),
          value,
          deviation: baseline.mean ? value - baseline.mean[metric] : null,
        },
      ];
    });
}

function TrendTooltip({ active, payload, unit }: TrendTooltipProps) {
  const item = payload?.[0];
  const point = item?.payload;
  if (!active || !item || !point || typeof item.value !== "number") return null;

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-soft">
      <p className="font-semibold">{point.date ? formatDate(point.date) : "Date unavailable"}</p>
      <p className="mt-1 tabular-nums">
        {formatNumber(item.value)} {unit}
      </p>
      <p className="text-xs text-muted-foreground">
        {point.sessionId} ·{" "}
        {point.source === "illustrative" ? "Illustrative demo data" : "Research output"}
      </p>
    </div>
  );
}

function SessionCalendar({
  sessions,
  onSelect,
}: {
  sessions: readonly TrendSession[];
  onSelect: (session: TrendSession) => void;
}) {
  const availableDates = sessions.flatMap((session) => (session.date ? [session.date] : []));
  const anchorDate = availableDates.length
    ? new Date(`${availableDates[availableDates.length - 1]}T00:00:00Z`)
    : new Date(`${TRENDS_REFERENCE_DATE}T00:00:00Z`);
  const [monthOffset, setMonthOffset] = useState(0);
  const monthDate = new Date(
    Date.UTC(anchorDate.getUTCFullYear(), anchorDate.getUTCMonth() + monthOffset, 1),
  );
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const canGoForward =
    year < anchorDate.getUTCFullYear() ||
    (year === anchorDate.getUTCFullYear() && month < anchorDate.getUTCMonth());
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const mondayOffset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;
  const sessionsByDate = new Map<string, TrendSession[]>();

  for (const session of sessions) {
    if (!session.date) continue;
    const sameDay = sessionsByDate.get(session.date) ?? [];
    sameDay.push(session);
    sessionsByDate.set(session.date, sameDay);
  }

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(monthDate);

  return (
    <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-strong">Session activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {monthLabel}. Neutral markers show recorded demo activity, not health status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoTag label="Illustrative history" />
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-border text-body hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous month"
            onClick={() => setMonthOffset((offset) => offset - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-border text-body hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next month"
            disabled={!canGoForward}
            onClick={() => setMonthOffset((offset) => offset + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day} className="pb-1 text-center text-xs font-medium text-muted-foreground">
            {day}
          </span>
        ))}
        {Array.from({ length: cells }, (_, cellIndex) => {
          const day = cellIndex - mondayOffset + 1;
          if (day < 1 || day > daysInMonth) {
            return <span key={`blank-${cellIndex}`} aria-hidden="true" className="min-h-12" />;
          }
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const daySessions = sessionsByDate.get(date) ?? [];
          const label = `${formatDate(date)}: ${
            daySessions.length
              ? `${daySessions.length} illustrative session${daySessions.length === 1 ? "" : "s"}`
              : "no session recorded"
          }`;

          return (
            <button
              key={date}
              type="button"
              onClick={() => daySessions[0] && onSelect(daySessions[0])}
              disabled={!daySessions.length}
              aria-label={label}
              title={label}
              className={`flex min-h-12 flex-col items-center justify-center rounded-xl border text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                daySessions.length
                  ? "border-primary-300/60 bg-primary-100/70 font-semibold text-strong hover:bg-primary-100"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}
            >
              <span>{day}</span>
              {daySessions.length ? (
                <span className="mt-0.5 text-[10px] leading-none">
                  {daySessions.length} session{daySessions.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EmptyChart({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-5 text-center">
      <Info className="size-5 text-muted-foreground" aria-hidden="true" />
      <p className="max-w-lg text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function ResearchDisclosure({ compact = false }: { compact?: boolean }) {
  const estimates = researchTrendSession.movementEstimates ?? [];
  return (
    <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Video className="size-4 text-primary-700" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-strong">Research recording</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            One precomputed public-video squat analysis, kept separate from illustrative history.
          </p>
        </div>
        <DemoTag label="Research output · not astronaut history" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Repetitions detected"
          value={researchTrendSession.repetitions}
          unit="reps"
          status="neutral"
          confidence="low"
          footnote="Detected movement cycles"
        />
        <MetricCard
          title="Recording duration"
          value={formatNumber(researchTrendSession.recordingDurationSeconds)}
          unit="s"
          status="neutral"
          confidence="low"
          footnote="Source clip duration"
        />
        <MetricCard
          title="Average repetition duration"
          value={formatNumber(researchTrendSession.averageRepetitionDurationSeconds)}
          unit="s / rep"
          status="neutral"
          confidence="low"
          footnote="Mean of two detected cycles"
        />
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">Reconstruction quality</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status="caution" size="small" />
            <ConfidenceBadge level="low" />
          </div>
          <p className="mt-3 text-sm font-semibold text-strong">Limited</p>
          <p className="mt-1 text-xs text-muted-foreground">Recording endpoints are incomplete.</p>
        </div>
      </div>

      {!compact ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetricCard
              title="Ascent phase segments"
              value={researchTrendSession.phaseSegments?.ascent ?? "—"}
              unit="segments"
              status="neutral"
              confidence="low"
              footnote="Estimated from the supplied movement signal"
            />
            <MetricCard
              title="Descent phase segments"
              value={researchTrendSession.phaseSegments?.descent ?? "—"}
              unit="segments"
              status="neutral"
              confidence="low"
              footnote="Estimated from the supplied movement signal"
            />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {estimates.map((estimate) => (
              <div key={estimate.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-strong">{estimate.label}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <StatusPill status={estimate.status} size="small" />
                    <ConfidenceBadge level={estimate.confidence} />
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Right</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-strong">
                      {formatNumber(estimate.rightExcursionDeg)}°
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Left</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-strong">
                      {formatNumber(estimate.leftExcursionDeg)}°
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Coordinate excursion estimate; not a clinical range-of-motion assessment.
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-4">
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              A single recording cannot establish a personal baseline or a longitudinal trend. The
              recording starts and ends mid-movement; these estimates do not represent a health
              finding.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/app/body">Open movement mirror</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            This research result is not included in the illustrative counts or baseline.
          </p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/app/body">Open movement mirror</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

export default function TrendsSection({
  activeTab,
  onTabChange,
}: {
  activeTab: TrendTab;
  onTabChange: (tab: TrendTab) => void;
}) {
  const { gravity, setGravity } = useApp();
  const [source, setSource] = useState<TrendSource>("illustrative");
  const [dateRange, setDateRange] = useState<TrendDateRange>("30d");
  const [exerciseFilter, setExerciseFilter] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState<MovementMetric>("knee");
  const [valueMode, setValueMode] = useState<ValueMode>("measurement");
  const [activityView, setActivityView] = useState<TrendView>("chart");
  const [durationView, setDurationView] = useState<TrendView>("chart");
  const [movementView, setMovementView] = useState<TrendView>("chart");
  const [selectedSession, setSelectedSession] = useState<TrendSession | null>(null);

  const baseline = getBaselineSummary(source);
  const filteredSessions = useMemo(
    () =>
      getTrendSessions(source, dateRange).filter(
        (session) => exerciseFilter === "all" || session.exercise === exerciseFilter,
      ),
    [dateRange, exerciseFilter, source],
  );
  const summary = getSessionSummary(filteredSessions);
  const movementPoints = toTrendPoints(filteredSessions, selectedMetric, baseline);
  const selectedMetricLabel =
    METRICS.find((metric) => metric.id === selectedMetric)?.fullLabel ?? "Coordinate excursion";
  const hasDemoHistory = source === "illustrative";
  const baselineStatus =
    baseline.state === "established"
      ? "Established"
      : baseline.state === "provisional"
        ? "Provisional"
        : "Insufficient history";

  const activityPoints = [...filteredSessions]
    .sort((a, b) => (a.date ?? a.processedOn ?? "").localeCompare(b.date ?? b.processedOn ?? ""))
    .map((session) => ({
      ...session,
      date: session.date ?? session.processedOn ?? "",
      shortDate: formatDate(session.date ?? session.processedOn ?? TRENDS_REFERENCE_DATE).replace(
        /, \d{4}$/,
        "",
      ),
      sessionId: session.id,
      source: session.source,
    }));

  const durationPoints = activityPoints.map((session) => ({
    ...session,
    value: session.averageRepetitionDurationSeconds,
  }));
  const baselineMean = baseline.mean?.[selectedMetric] ?? null;
  const baselineRange = baseline.range?.[selectedMetric] ?? null;
  const movementColor = METRIC_COLORS[selectedMetric];
  const latestKneePoint = toTrendPoints(filteredSessions, "knee", baseline).at(-1);
  const latestKneeDeviation =
    hasDemoHistory && baseline.mean && latestKneePoint
      ? latestKneePoint.value - baseline.mean.knee
      : null;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-6 sm:px-4 lg:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Longitudinal movement monitoring
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-strong">
            Trends &amp; baselines
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Review recorded movement observations across compatible sessions. A personal movement
            reference is not a healthy reference standard.
          </p>
        </div>
        <DemoTag
          label={hasDemoHistory ? "Illustrative prototype data" : "Precomputed research data"}
        />
      </header>

      <section
        aria-label="Trend filters"
        className="flex flex-col gap-4 rounded-3xl border border-primary-300/40 bg-card p-4 shadow-soft sm:p-5"
      >
        <div className="flex flex-wrap items-end gap-4">
          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
              Data source
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["illustrative", "Illustrative history"],
                  ["research", "Research output"],
                ] as const
              ).map(([id, label]) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={source === id ? "default" : "outline"}
                  className="min-h-10 rounded-full"
                  aria-pressed={source === id}
                  onClick={() => setSource(id)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-muted-foreground">Date range</legend>
            <div className="flex flex-wrap gap-1 rounded-full bg-muted p-1">
              {DATE_RANGES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`min-h-9 rounded-full px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    dateRange === id
                      ? "bg-card font-semibold text-strong shadow-sm"
                      : "text-muted-foreground hover:text-strong"
                  }`}
                  aria-pressed={dateRange === id}
                  onClick={() => setDateRange(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="min-w-40">
            <label
              htmlFor="trend-exercise"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Exercise
            </label>
            <select
              id="trend-exercise"
              value={exerciseFilter}
              onChange={(event) => setExerciseFilter(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All exercises</option>
              <option value="Squat">Squat</option>
            </select>
          </div>
        </div>
        <p className="flex items-start gap-2 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {hasDemoHistory
            ? "Illustrative history is shown on its own. Its baseline is calculated only from compatible illustrative squat sessions."
            : "This research output is shown on its own. Its processing date is not a supplied recording date and it is not included in demo history."}
        </p>
      </section>

      <nav
        aria-label="Trends sections"
        className="flex flex-wrap gap-2 border-b border-border pb-3"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`${TABS_CLASS} ${
              activeTab === id
                ? "bg-primary-100 text-strong"
                : "text-muted-foreground hover:bg-muted hover:text-strong"
            }`}
            aria-current={activeTab === id ? "page" : undefined}
            onClick={() => onTabChange(id)}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && hasDemoHistory ? (
        <div className="space-y-6">
          <section
            aria-label="Illustrative movement summary"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <MetricCard
              title="Sessions recorded"
              value={summary.sessionCount}
              unit="sessions"
              footnote="Illustrative records in selected range"
            />
            <MetricCard
              title="Repetitions detected"
              value={summary.repetitions}
              unit="reps"
              footnote="Illustrative records in selected range"
            />
            <MetricCard
              title="Average repetition duration"
              value={
                summary.averageRepetitionDurationSeconds === null
                  ? "—"
                  : formatNumber(summary.averageRepetitionDurationSeconds)
              }
              unit={summary.averageRepetitionDurationSeconds === null ? "" : "s / rep"}
              footnote="Weighted by repetitions in each illustrative record"
            />
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-sm font-medium text-muted-foreground">Baseline status</p>
              <p className="mt-2 font-display text-2xl font-bold text-strong">{baselineStatus}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-body">
                <Info className="size-3.5" aria-hidden="true" />
                {baselineStatus}
              </span>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {baseline.compatibleSessionCount} compatible demo sessions. Prototype rule: fewer
                than 3 is insufficient, 3–5 provisional, and 6 or more established.
              </p>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-strong">
                    Repetitions per session
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Activity count by illustrative session · repetitions
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <DemoTag label="Illustrative demo data" />
                  <ViewAsTableToggle
                    open={activityView === "table"}
                    onToggle={() =>
                      setActivityView((view) => (view === "chart" ? "table" : "chart"))
                    }
                  />
                </div>
              </div>
              {activityPoints.length === 0 ? (
                <div className="mt-5">
                  <EmptyChart>No illustrative sessions match these filters.</EmptyChart>
                </div>
              ) : activityView === "table" ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Repetitions per illustrative session</caption>
                    <thead className="text-xs text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Session</th>
                        <th className="px-3 py-2 text-right">Repetitions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityPoints.map((point) => (
                        <tr key={point.id} className="border-b border-border/70">
                          <td className="px-3 py-2">{displayDate(point)}</td>
                          <td className="px-3 py-2">{point.id}</td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums">
                            {point.repetitions} reps
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="mt-5 h-64"
                  role="img"
                  aria-label="Bar chart of repetitions per illustrative squat session. Values are demonstration data, not astronaut records."
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityPoints}
                      margin={{ top: 8, right: 8, bottom: 4, left: -18 }}
                    >
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="shortDate"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<TrendTooltip unit="reps" />} />
                      <Bar
                        dataKey="repetitions"
                        name="Repetitions"
                        fill="var(--chart-1)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-strong">
                    Repetition duration
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Average duration by session · seconds per repetition
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <DemoTag label="Illustrative demo data" />
                  <ViewAsTableToggle
                    open={durationView === "table"}
                    onToggle={() =>
                      setDurationView((view) => (view === "chart" ? "table" : "chart"))
                    }
                  />
                </div>
              </div>
              {durationPoints.length === 0 ? (
                <div className="mt-5">
                  <EmptyChart>No illustrative sessions match these filters.</EmptyChart>
                </div>
              ) : durationView === "table" ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">
                      Average repetition duration per illustrative session
                    </caption>
                    <thead className="text-xs text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Session</th>
                        <th className="px-3 py-2 text-right">Mean duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {durationPoints.map((point) => (
                        <tr key={point.id} className="border-b border-border/70">
                          <td className="px-3 py-2">{displayDate(point)}</td>
                          <td className="px-3 py-2">{point.id}</td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums">
                            {formatNumber(point.value)} s / rep
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="mt-5 h-64"
                  role="img"
                  aria-label="Line chart of average repetition duration in seconds per repetition across illustrative squat sessions."
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={durationPoints}
                      margin={{ top: 8, right: 8, bottom: 4, left: -18 }}
                    >
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="shortDate"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value: number) => value.toFixed(1)}
                      />
                      <Tooltip content={<TrendTooltip unit="s / rep" />} />
                      <Line
                        dataKey="value"
                        name="Average duration"
                        type="monotone"
                        stroke="var(--chart-2)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "var(--chart-2)" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </div>

          <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 size-5 shrink-0 text-primary-700" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg font-bold text-strong">Movement observation</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {latestKneeDeviation !== null
                    ? `The latest illustrative knee coordinate excursion is ${formatSigned(latestKneeDeviation)}° relative to the demo reference average. This is a movement-pattern observation, not a health outcome.`
                    : baseline.mean === null
                      ? "More compatible illustrative squat sessions are needed to compare movement observations with a demo reference."
                      : "No illustrative session in the selected date range is available for comparison with the demo reference."}
                </p>
              </div>
            </div>
          </section>

          <ResearchDisclosure compact />
        </div>
      ) : null}

      {activeTab === "overview" && !hasDemoHistory ? (
        <div className="space-y-6">
          {filteredSessions.length ? (
            <ResearchDisclosure />
          ) : (
            <section className="rounded-3xl border border-primary-300/40 bg-card p-6 shadow-soft">
              <EmptyChart>
                No research output falls within the selected processing-date range.
              </EmptyChart>
            </section>
          )}
          <section className="rounded-3xl border border-border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                The recording date was not supplied. Date-range filtering for this source uses the
                research processing date only. One research output is insufficient for a personal
                baseline or longitudinal comparison.
              </p>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "movement" && hasDemoHistory ? (
        <div className="space-y-6">
          <section className="rounded-3xl border border-primary-300/40 bg-card p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-strong">
                  Joint-coordinate trends
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Compare the same squat coordinate-excursion definition across illustrative
                  sessions. Differences are observations, not automatic improvement, deterioration,
                  or warnings.
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <fieldset>
                  <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Movement metric
                  </legend>
                  <select
                    value={selectedMetric}
                    onChange={(event) => setSelectedMetric(event.target.value as MovementMetric)}
                    className="h-10 min-w-48 rounded-xl border border-input bg-background px-3 text-sm text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Movement metric"
                  >
                    {METRICS.map((metric) => (
                      <option key={metric.id} value={metric.id}>
                        {metric.fullLabel}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset>
                  <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
                    Display
                  </legend>
                  <div className="flex gap-1 rounded-full bg-muted p-1">
                    {(
                      [
                        ["measurement", "Measured"],
                        ["deviation", "Difference"],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        className={`min-h-8 rounded-full px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          valueMode === mode
                            ? "bg-card font-semibold text-strong shadow-sm"
                            : "text-muted-foreground hover:text-strong"
                        }`}
                        aria-pressed={valueMode === mode}
                        onClick={() => setValueMode(mode)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="flex flex-col items-end gap-2">
                  <DemoTag label="Illustrative demo data" />
                  <ViewAsTableToggle
                    open={movementView === "table"}
                    onToggle={() =>
                      setMovementView((view) => (view === "chart" ? "table" : "chart"))
                    }
                  />
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {valueMode === "measurement"
                ? baselineRange
                  ? `Pastel band: min–max range from the first ${baseline.referenceSessionCount} compatible demo reference sessions. Coordinate excursion is not a clinical range-of-motion assessment.`
                  : "A reference range is unavailable until sufficient compatible sessions exist."
                : baselineMean === null
                  ? "A reference difference is unavailable until sufficient compatible sessions exist."
                  : `Difference is the selected session's estimate minus the average of the first ${baseline.referenceSessionCount} compatible demo reference sessions. Units: degrees.`}
            </p>

            {movementPoints.length === 0 ? (
              <div className="mt-5">
                <EmptyChart>No illustrative sessions match these filters.</EmptyChart>
              </div>
            ) : movementView === "table" ? (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    {selectedMetricLabel} across illustrative sessions
                  </caption>
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Session</th>
                      <th className="px-3 py-2 text-right">
                        {valueMode === "measurement"
                          ? "Coordinate excursion"
                          : "Difference from demo reference"}
                      </th>
                      {baselineMean !== null ? (
                        <th className="px-3 py-2 text-right">Reference average</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {movementPoints.map((point) => (
                      <tr key={point.sessionId} className="border-b border-border/70">
                        <td className="px-3 py-2">{formatDate(point.date)}</td>
                        <td className="px-3 py-2">{point.sessionId}</td>
                        <td className="px-3 py-2 text-right font-medium tabular-nums">
                          {valueMode === "measurement"
                            ? `${formatNumber(point.value)}°`
                            : point.deviation === null
                              ? "—"
                              : `${formatSigned(point.deviation)}°`}
                        </td>
                        {baselineMean !== null ? (
                          <td className="px-3 py-2 text-right tabular-nums">
                            {formatNumber(baselineMean)}°
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className="mt-5 h-80"
                role="img"
                aria-label={`${selectedMetricLabel} by session in degrees. ${valueMode === "measurement" ? "The shaded band shows the illustrative reference-session range." : "The zero line is the illustrative reference average."}`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={movementPoints}
                    margin={{ top: 12, right: 16, bottom: 4, left: -10 }}
                  >
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="shortDate"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <YAxis
                      domain={valueMode === "deviation" ? ["auto", "auto"] : ["auto", "auto"]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) => value.toFixed(0)}
                    />
                    {valueMode === "measurement" && baselineRange ? (
                      <ReferenceArea
                        y1={baselineRange.min}
                        y2={baselineRange.max}
                        fill="var(--primary-300)"
                        fillOpacity={0.28}
                        ifOverflow="extendDomain"
                      />
                    ) : null}
                    {valueMode === "deviation" && baselineMean !== null ? (
                      <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                    ) : null}
                    <Tooltip content={<TrendTooltip unit="°" />} />
                    <Line
                      dataKey={valueMode === "measurement" ? "value" : "deviation"}
                      name={valueMode === "measurement" ? selectedMetricLabel : "Difference"}
                      type="monotone"
                      stroke={movementColor}
                      strokeWidth={2.5}
                      connectNulls={false}
                      dot={{ r: 4, fill: movementColor }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Illustrative values are not astronaut records. A personal movement reference is
                derived only from compatible demo squat sessions and is not a healthy reference
                standard. The reference band shows the observed range of its designated demo
                sessions; it is not a clinical threshold.
              </p>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "movement" && !hasDemoHistory ? (
        <div className="space-y-6">
          <ResearchDisclosure />
          <section className="rounded-3xl border border-border bg-muted/30 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Only one research recording is available. The left/right coordinate estimates are
              shown above, but this source has insufficient compatible sessions for a trend line or
              a personal baseline. Select Illustrative history to explore clearly labeled demo
              comparisons.
            </p>
          </section>
        </div>
      ) : null}

      {activeTab === "sessions" ? (
        <div className="space-y-6">
          {hasDemoHistory ? (
            <SessionCalendar sessions={filteredSessions} onSelect={setSelectedSession} />
          ) : (
            <section className="rounded-3xl border border-border bg-muted/30 p-5">
              <div className="flex items-start gap-3">
                <Clock3
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The research recording has a processing date but no supplied capture date, so it
                  is not placed on the activity calendar.
                </p>
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-3xl border border-primary-300/40 bg-card shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
              <div>
                <h2 className="font-display text-xl font-bold text-strong">Session history</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasDemoHistory
                    ? "Select a row for its illustrative summary. These records have no matching video or 3D reconstruction."
                    : "Processing date is shown separately because the recording date was not supplied."}
                </p>
              </div>
              {hasDemoHistory ? (
                <DemoTag label="Illustrative demo records" />
              ) : (
                <DemoTag label="Research output" />
              )}
            </div>
            {filteredSessions.length === 0 ? (
              <div className="px-5 pb-6 sm:px-6">
                <EmptyChart>No sessions match the selected source and filters.</EmptyChart>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <caption className="sr-only">
                    Session history for the selected data source
                  </caption>
                  <thead className="border-y border-border bg-muted/50 text-xs font-medium text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Session ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Exercise</th>
                      <th className="px-4 py-3 text-right">Repetitions</th>
                      <th className="px-4 py-3 text-right">Recording duration</th>
                      <th className="px-4 py-3">Reconstruction</th>
                      <th className="px-4 py-3">Quality</th>
                      <th className="px-4 py-3">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredSessions]
                      .sort((a, b) =>
                        (b.date ?? b.processedOn ?? "").localeCompare(
                          a.date ?? a.processedOn ?? "",
                        ),
                      )
                      .map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-border/70 transition-colors hover:bg-muted/40"
                        >
                          <td className="px-4 py-3 font-semibold tabular-nums text-strong">
                            <button
                              type="button"
                              className="rounded-sm text-left underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              onClick={() => setSelectedSession(session)}
                            >
                              {session.id}
                            </button>
                          </td>
                          <td className="max-w-64 px-4 py-3 text-muted-foreground">
                            {displayDate(session)}
                          </td>
                          <td className="px-4 py-3">{session.exercise}</td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {session.repetitions} reps
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {formatNumber(session.recordingDurationSeconds)} s
                          </td>
                          <td className="px-4 py-3">
                            {session.source === "research" ? (
                              <div className="flex flex-col items-start gap-1">
                                <span>{session.reconstructionStatus}</span>
                                <StatusPill status={session.status ?? "neutral"} size="small" />
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                {session.reconstructionStatus}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {session.source === "research" ? (
                              <div className="flex flex-col items-start gap-1">
                                <span>{session.reconstructionQuality}</span>
                                <ConfidenceBadge level={session.confidence ?? "low"} />
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Illustrative</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <DemoTag
                              label={session.source === "research" ? "Research" : "Illustrative"}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {activeTab === "gravity" ? (
        <GravityAnalysisPanel selectedRegime={gravity} onSelectRegime={setGravity} />
      ) : null}

      <footer className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          TALA shows reconstructed movement observations, not a diagnosis. Coordinate excursions are
          not clinical range-of-motion assessments. Demo history is illustrative; the research
          sample is one incomplete public-video analysis. Neither is evidence of astronaut health or
          a validated personal baseline.
        </p>
      </footer>

      <Dialog
        open={selectedSession !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSession(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-strong">
              {selectedSession ? `Session ${selectedSession.id}` : "Session detail"}
            </DialogTitle>
            <DialogDescription>
              {selectedSession
                ? `${selectedSession.exercise} · ${displayDate(selectedSession)}`
                : "Session details"}
            </DialogDescription>
          </DialogHeader>
          {selectedSession ? (
            selectedSession.source === "research" ? (
              <div className="space-y-4">
                <ResearchDisclosure />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    This session is illustrative and has no corresponding source video or 3D
                    reconstruction.
                  </p>
                  <DemoTag label="Demo placeholder" />
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <DetailValue label="Repetitions" value={`${selectedSession.repetitions} reps`} />
                  <DetailValue
                    label="Recording duration"
                    value={`${formatNumber(selectedSession.recordingDurationSeconds)} s`}
                  />
                  <DetailValue
                    label="Average repetition duration"
                    value={`${formatNumber(selectedSession.averageRepetitionDurationSeconds)} s / rep`}
                  />
                  {METRICS.map((metric) => (
                    <DetailValue
                      key={metric.id}
                      label={`${metric.fullLabel} (illustrative)`}
                      value={`${formatNumber(selectedSession.coordinateExcursionsDeg[metric.id])}°`}
                    />
                  ))}
                </dl>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Illustrative values do not represent an astronaut or a clinical movement
                  assessment.
                </p>
              </div>
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function DetailValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold tabular-nums text-strong">{value}</dd>
    </div>
  );
}
