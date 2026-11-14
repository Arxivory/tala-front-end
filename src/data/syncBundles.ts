import type { SyncBundle } from "./types";

/** Five sync bundles in different states. All sync UI is a demo placeholder. */
export const syncBundles: SyncBundle[] = [
  {
    id: "BND-0421",
    contents: "Session s-anomaly — anomaly event + replay excerpt",
    sizeBytes: 2_940_000,
    compressedBytes: 610_000,
    priority: "anomaly",
    state: "Retrying",
    createdAt: "2026-11-02T09:14:00Z",
    anomalyRef: "s-anomaly",
  },
  {
    id: "BND-0420",
    contents: "Session s-lowconf — low-confidence trace",
    sizeBytes: 1_820_000,
    compressedBytes: 402_000,
    priority: "priority",
    state: "Queued",
    createdAt: "2026-11-02T07:40:00Z",
    anomalyRef: "s-lowconf",
  },
  {
    id: "BND-0419",
    contents: "Daily check-ins, mission days 39–42",
    sizeBytes: 48_000,
    compressedBytes: 9_200,
    priority: "routine",
    state: "Queued",
    createdAt: "2026-11-02T05:02:00Z",
  },
  {
    id: "BND-0418",
    contents: "Session summaries, mission days 36–38",
    sizeBytes: 940_000,
    compressedBytes: 205_000,
    priority: "routine",
    state: "Sending",
    createdAt: "2026-11-01T21:30:00Z",
  },
  {
    id: "BND-0417",
    contents: "Calibration record + model version manifest",
    sizeBytes: 122_000,
    compressedBytes: 31_000,
    priority: "routine",
    state: "Delivered",
    createdAt: "2026-10-31T16:12:00Z",
  },
];
