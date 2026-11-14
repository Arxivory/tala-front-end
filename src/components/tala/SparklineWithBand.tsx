import { cn } from "@/lib/utils";

/**
 * Lightweight SVG sparkline with an optional shaded band (per-point arrays or
 * constant values). Inherits its stroke color via currentColor.
 */
export function SparklineWithBand({
  data,
  band,
  className,
  width = 96,
  height = 32,
  markers,
}: {
  data: number[];
  band?: { lower: number[]; upper: number[] } | { lower: number; upper: number } | undefined;
  className?: string;
  width?: number;
  height?: number;
  /** Indices of points to dot (e.g. flagged sessions). */
  markers?: number[];
}) {
  if (data.length < 2) return null;
  const pad = 2;
  const values: number[] = [];
  data.forEach((v) => values.push(v));
  let lowers: number[] | null = null;
  let uppers: number[] | null = null;
  if (band) {
    const perPoint = Array.isArray(band.lower);
    const lo = perPoint ? (band.lower as number[]) : data.map(() => band.lower as number);
    const hi = perPoint ? (band.upper as number[]) : data.map(() => band.upper as number);
    lowers = lo;
    uppers = hi;
    values.push(...lo, ...hi);
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${height - pad} L${x(0).toFixed(1)},${height - pad} Z`;
  const bandPath =
    lowers && uppers
      ? [
          ...uppers.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`),
          ...lowers
            .map((_, i) => `L${x(lowers!.length - 1 - i).toFixed(1)},${y(lowers![lowers!.length - 1 - i]!).toFixed(1)}`),
          "Z",
        ].join(" ")
      : null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {bandPath ? <path d={bandPath} fill="currentColor" opacity={0.12} /> : null}
      <path d={area} fill="currentColor" opacity={0.1} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {markers?.map((i) =>
        data[i] === undefined ? null : (
          <circle key={i} cx={x(i)} cy={y(data[i])} r="2.2" fill="var(--color-status-anomaly)" stroke="none" />
        ),
      )}
    </svg>
  );
}
