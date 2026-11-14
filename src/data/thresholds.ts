import type { ThresholdRow } from "./types";

/**
 * Placeholder values, clearly labeled as examples that need clinical review.
 * Replace only after verifying against the real literature.
 */
export const thresholds: ThresholdRow[] = [
  {
    id: "th-hip",
    metric: "Hip joint reaction force",
    value: 3200,
    unit: "N",
    citation: "NASA-STD-3001, 6.4",
    note: "Example value, needs clinical review.",
    lastEditedBy: "Dr. Mei Tanaka (CMO)",
    lastEditedDate: "2026-09-20",
  },
  {
    id: "th-knee",
    metric: "Knee joint reaction force",
    value: 2600,
    unit: "N",
    citation: "NASA-STD-3001, 6.4",
    note: "Example value, needs clinical review.",
    lastEditedBy: "Dr. Mei Tanaka (CMO)",
    lastEditedDate: "2026-09-20",
  },
  {
    id: "th-ankle",
    metric: "Ankle joint reaction force",
    value: 1800,
    unit: "N",
    citation: "HRP-47052, 3.2",
    note: "Example value, needs clinical review.",
    lastEditedBy: "Dr. Mei Tanaka (CMO)",
    lastEditedDate: "2026-09-20",
  },
  {
    id: "th-lumbar",
    metric: "Lumbar moment (L4/L5)",
    value: 180,
    unit: "N·m",
    citation: "NASA-STD-3001, 6.4",
    note: "Example value, needs clinical review.",
    lastEditedBy: "Dr. Mei Tanaka (CMO)",
    lastEditedDate: "2026-09-20",
  },
  {
    id: "th-femoral",
    metric: "Femoral strain, effective range",
    value: 70,
    unit: "% of 1g reference",
    citation: "NASA-STD-3001, 6.5",
    note: "Effective range 70–110%. Example range, needs clinical review.",
    lastEditedBy: "Dr. Mei Tanaka (CMO)",
    lastEditedDate: "2026-09-20",
  },
  {
    id: "th-form",
    metric: "Form stability floor",
    value: 70,
    unit: "score",
    citation: "HRP-47052, 4.1",
    note: "Below this value sessions are flagged for review. Example value, needs clinical review.",
    lastEditedBy: "Dr. Mei Tanaka (CMO)",
    lastEditedDate: "2026-09-20",
  },
];

export function thresholdById(id: string): ThresholdRow | undefined {
  return thresholds.find((t) => t.id === id);
}
