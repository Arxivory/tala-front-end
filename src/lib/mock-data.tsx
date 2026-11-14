/** All data in TALA is mocked/static — this is a concept prototype. */

export type StrainStatus = "safe" | "caution" | "risk";

export const crew = [
  {
    id: "cmdr-okonkwo",
    name: "Cmdr. Adaeze Okonkwo",
    role: "Commander / CMO",
    mission: "Artemis V — Lunar Surface",
    missionDay: 46,
    gravity: "0.16 g",
    readiness: "safe" as StrainStatus,
    compliance: 94,
    lastSync: "12 min ago",
    flags: 0,
    avatarTone: "bg-primary-soft",
  },
  {
    id: "fe-lindqvist",
    name: "FE Marten Lindqvist",
    role: "Flight Engineer",
    mission: "Artemis V — Lunar Surface",
    missionDay: 46,
    gravity: "0.16 g",
    readiness: "caution" as StrainStatus,
    compliance: 78,
    lastSync: "41 min ago",
    flags: 2,
    avatarTone: "bg-caution",
  },
  {
    id: "ms-rahman",
    name: "MS Priya Rahman",
    role: "Mission Specialist",
    mission: "Lunar Gateway",
    missionDay: 118,
    gravity: "0 g",
    readiness: "safe" as StrainStatus,
    compliance: 91,
    lastSync: "6 min ago",
    flags: 0,
    avatarTone: "bg-safe",
  },
  {
    id: "cdr-vasquez",
    name: "CDR Luis Vásquez",
    role: "Commander",
    mission: "Mars Transit Sim — CHAPEA 4",
    missionDay: 212,
    gravity: "0.38 g",
    readiness: "risk" as StrainStatus,
    compliance: 63,
    lastSync: "3 h 12 min ago",
    flags: 4,
    avatarTone: "bg-risk",
  },
];

export const activeAstronaut = crew[0]!;

export const dtnBundles = [
  {
    id: "DTN-11842",
    crew: "Cmdr. A. Okonkwo",
    session: "Mar 14, 2026 · 08:12 UTC",
    gravity: "0.16 g",
    raw: "1.42 GB",
    compressed: "58 MB",
    status: "Ingested" as const,
  },
  {
    id: "DTN-11841",
    crew: "FE M. Lindqvist",
    session: "Mar 14, 2026 · 07:04 UTC",
    gravity: "0.16 g",
    raw: "1.18 GB",
    compressed: "49 MB",
    status: "Flagged" as const,
  },
  {
    id: "DTN-11840",
    crew: "MS P. Rahman",
    session: "Mar 13, 2026 · 21:48 UTC",
    gravity: "0 g",
    raw: "0.96 GB",
    compressed: "41 MB",
    status: "Ingested" as const,
  },
  {
    id: "DTN-11839",
    crew: "CDR L. Vásquez",
    session: "Mar 13, 2026 · 18:30 UTC",
    gravity: "0.38 g",
    raw: "1.63 GB",
    compressed: "67 MB",
    status: "Pending" as const,
  },
  {
    id: "DTN-11838",
    crew: "Cmdr. A. Okonkwo",
    session: "Mar 13, 2026 · 08:05 UTC",
    gravity: "0.16 g",
    raw: "1.39 GB",
    compressed: "56 MB",
    status: "Ingested" as const,
  },
];

export const strainSeries = [
  { day: "D-0", femur: 100, tibia: 100, lumbar: 100, baseline: 100 },
  { day: "D-14", femur: 97.4, tibia: 98.1, lumbar: 99.2, baseline: 100 },
  { day: "D-28", femur: 95.1, tibia: 96.4, lumbar: 98.4, baseline: 100 },
  { day: "D-42", femur: 93.8, tibia: 95.2, lumbar: 97.9, baseline: 100 },
  { day: "D-56", femur: 92.9, tibia: 94.6, lumbar: 97.1, baseline: 100 },
  { day: "D-70", femur: 93.4, tibia: 95.1, lumbar: 97.4, baseline: 100 },
  { day: "D-84", femur: 94.6, tibia: 96.0, lumbar: 97.8, baseline: 100 },
  { day: "D-98", femur: 95.8, tibia: 96.9, lumbar: 98.2, baseline: 100 },
  { day: "D-112", femur: 96.9, tibia: 97.6, lumbar: 98.6, baseline: 100 },
];

export const flaggedMoments = [
  { t: "00:04:12", label: "Left knee valgus drift", status: "caution" as StrainStatus },
  { t: "00:07:48", label: "Lumbar flexion beyond target", status: "risk" as StrainStatus },
  { t: "00:11:03", label: "Asymmetric hip loading (R+14%)", status: "caution" as StrainStatus },
  { t: "00:16:39", label: "Tempo collapse, set 4", status: "caution" as StrainStatus },
];

export const assistantThread = [
  {
    from: "crew" as const,
    text: "My lower back feels tight after squats. What should I do?",
  },
  {
    from: "tala" as const,
    title: "Likely lumbar erector fatigue — not an injury pattern",
    body: "Your last two sessions show lumbar flexion 8° past target during the final set. Stop loaded squats for 24 h. Do the decompression sequence below, then re-test with 60% resistance.",
    steps: [
      "Supine 90/90 breathing — 5 slow cycles",
      "Cat-camel, 8 reps, pain-free range only",
      "Hip flexor stretch, 45 s per side",
      "Re-test: bodyweight squat, hold neutral spine",
    ],
    excerpt:
      "NASA Exercise Countermeasures Handbook, §7.4 — Lumbar loading in partial gravity: reduce axial load by 40% for 48 h following flexion-range exceedance; resume progressive loading once neutral-spine control returns under bodyweight conditions.",
  },
];

export const assistantSuggestions = [
  "Is this shoulder pain safe to train through?",
  "What resistance should I use in 0.16 g today?",
  "How do I recalibrate the cabin camera?",
];

export const baselineMetrics = [
  { label: "Femoral neck BMD", pre: "1.042 g/cm²", now: "0.989 g/cm²", delta: -5.1, status: "caution" as StrainStatus },
  { label: "Lumbar spine BMD", pre: "1.186 g/cm²", now: "1.161 g/cm²", delta: -2.1, status: "safe" as StrainStatus },
  { label: "VO₂ max", pre: "48.2 ml/kg/min", now: "45.6 ml/kg/min", delta: -5.4, status: "caution" as StrainStatus },
  { label: "Hip mobility score", pre: "92 / 100", now: "90 / 100", delta: -2.2, status: "safe" as StrainStatus },
];

export const lastSession = {
  date: "Yesterday · 08:12",
  exercise: "Flywheel squat · 4 × 8",
  duration: "38 min",
  compliance: 92,
  flags: 1,
};

export const patients = [
  { id: "p-1", name: "Dana Whitfield", program: "ACL reconstruction — week 7", compliance: 96, rom: [42, 48, 55, 61, 68, 74, 79], safety: 94, status: "safe" as StrainStatus },
  { id: "p-2", name: "Ibrahim Çelik", program: "Rotator cuff repair — week 4", compliance: 81, rom: [30, 34, 39, 41, 46, 50, 52], safety: 86, status: "safe" as StrainStatus },
  { id: "p-3", name: "Marisol Duarte", program: "Lumbar strain — week 2", compliance: 64, rom: [22, 25, 27, 26, 30, 31, 33], safety: 72, status: "caution" as StrainStatus },
  { id: "p-4", name: "Henry Obradović", program: "Total knee replacement — week 11", compliance: 92, rom: [50, 58, 66, 72, 78, 84, 88], safety: 91, status: "safe" as StrainStatus },
];

export const recoveryCurve = [
  { week: "W1", rom: 42, target: 45, strength: 28 },
  { week: "W2", rom: 48, target: 52, strength: 34 },
  { week: "W3", rom: 55, target: 58, strength: 41 },
  { week: "W4", rom: 61, target: 64, strength: 48 },
  { week: "W5", rom: 68, target: 70, strength: 56 },
  { week: "W6", rom: 74, target: 76, strength: 63 },
  { week: "W7", rom: 79, target: 82, strength: 69 },
];

export const forceValidation = [
  { t: "0.0s", model: 0, plate: 0 },
  { t: "0.2s", model: 420, plate: 438 },
  { t: "0.4s", model: 980, plate: 1012 },
  { t: "0.6s", model: 1340, plate: 1298 },
  { t: "0.8s", model: 1180, plate: 1204 },
  { t: "1.0s", model: 860, plate: 842 },
  { t: "1.2s", model: 470, plate: 489 },
  { t: "1.4s", model: 120, plate: 134 },
];

export const knowledgeBase = [
  { title: "NASA Exercise Countermeasures Handbook", rev: "Rev. 14.2", size: "48 MB", status: "Synced" as const, updated: "Mar 02, 2026" },
  { title: "Partial-Gravity Musculoskeletal Protocols", rev: "Rev. 3.0", size: "22 MB", status: "Queued" as const, updated: "Mar 12, 2026" },
  { title: "Emergency Orthopedic Field Guide", rev: "Rev. 8.1", size: "31 MB", status: "Synced" as const, updated: "Feb 18, 2026" },
  { title: "Flywheel Device Operations & Safety", rev: "Rev. 2.4", size: "12 MB", status: "Uplinking" as const, updated: "Mar 14, 2026" },
  { title: "Bone Remodeling Reference Atlas", rev: "Rev. 1.6", size: "76 MB", status: "Draft" as const, updated: "Mar 13, 2026" },
];

export const statusCopy: Record<StrainStatus, string> = {
  safe: "Optimal",
  caution: "Caution",
  risk: "Review",
};

/** --- Crew-portal enhancements (OSD-477 concept data) --- */

export const skeletalIntegrity = {
  model: "OSD-477 Model",
  index: 91.4,
  label: "Femoral Trabecular Density Index",
  status: "safe" as StrainStatus,
  streakDays: 12,
  trendPerWeek: 0.3,
  threshold: 85,
  note: "Tracks the OSD-477 bone-degradation curve — keep your exercise compliance streak and the index holds above threshold.",
};

export type BodyRegionId = "cervical" | "thoracic" | "lumbar" | "femur" | "tibia" | "arm";

export const bodyMapRegions: Record<
  BodyRegionId,
  {
    label: string;
    status: StrainStatus;
    bmdNow: string;
    bmdLossPct: number;
    osteoblast: "Active" | "Suppressed";
    strainHistory: string[];
    note: string;
  }
> = {
  cervical: {
    label: "Cervical spine",
    status: "safe",
    bmdNow: "1.102 g/cm²",
    bmdLossPct: -1.8,
    osteoblast: "Active",
    strainHistory: ["No exceedances in the last 30 sessions"],
    note: "Axial unloading in 0.16 g keeps cervical loading low; posture holds within target.",
  },
  thoracic: {
    label: "Thoracic spine",
    status: "safe",
    bmdNow: "1.134 g/cm²",
    bmdLossPct: -2.0,
    osteoblast: "Active",
    strainHistory: ["Mild flexion drift on D-38, corrected by D-44"],
    note: "Loading pattern nominal under the flywheel protocol.",
  },
  lumbar: {
    label: "Lumbar spine",
    status: "caution",
    bmdNow: "1.161 g/cm²",
    bmdLossPct: -2.1,
    osteoblast: "Suppressed",
    strainHistory: [
      "D-45 · Flexion 8° past target, final set",
      "D-44 · Tempo collapse late in set 4",
    ],
    note: "Osteoblast response suppressed after the D-45 flexion exceedance. Decompression protocol active for 24 h.",
  },
  femur: {
    label: "Femur & hip",
    status: "caution",
    bmdNow: "0.989 g/cm²",
    bmdLossPct: -5.1,
    osteoblast: "Active",
    strainHistory: [
      "D-42 · Peak strain below target for 3 sessions",
      "D-56 · Asymmetric hip loading (R +14%) — resolved",
    ],
    note: "Bone remodeling re-engaged since D-56; density recovering ~0.3%/week under current compliance.",
  },
  tibia: {
    label: "Tibia & shin",
    status: "safe",
    bmdNow: "1.046 g/cm²",
    bmdLossPct: -3.4,
    osteoblast: "Active",
    strainHistory: ["Impact loading within target band all month"],
    note: "Responding well to resistive exercise; no intervention needed.",
  },
  arm: {
    label: "Shoulder & arm",
    status: "safe",
    bmdNow: "0.918 g/cm²",
    bmdLossPct: -0.9,
    osteoblast: "Active",
    strainHistory: ["Upper-body chain nominal across all sessions"],
    note: "Negligible loss; the upper-body protocol is holding baseline.",
  },
};
