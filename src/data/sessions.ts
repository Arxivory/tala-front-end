import type {
  EquipmentName,
  ExerciseName,
  GravityRegime,
  RepRecord,
  Session,
  StatusLevel,
} from "./types";

/**
 * Deterministic seeded generator: identical output on server and client, so
 * SSR and hydration always agree. Never use Math.random here.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const regimeFactor: Record<GravityRegime, number> = {
  "0g": 0.32,
  "0.16g": 0.46,
  "0.38g": 0.66,
  "1g": 1,
};

/** Mission starts 2026-09-23; "today" is mission day 42. */
export const MISSION_START = "2026-09-23";
export const CURRENT_MISSION_DAY = 42;
export const MISSION_NAME = "Artemis Gateway";

function dateForMissionDay(day: number): string {
  const d = new Date(`${MISSION_START}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + day - 1);
  return d.toISOString().slice(0, 10);
}

function statusFor(strainPct: number, form: number): StatusLevel {
  if (strainPct < 62 || form < 62) return "anomaly";
  if (strainPct < 76 || form < 74) return "caution";
  return "optimal";
}

function buildReps(
  rand: () => number,
  sessionId: string,
  sets: number,
  repsPerSet: number,
  baseStrain: number,
): RepRecord[] {
  const reps: RepRecord[] = [];
  let index = 0;
  for (let s = 1; s <= sets; s++) {
    for (let r = 1; r <= repsPerSet; r++) {
      index++;
      const drift = (rand() - 0.5) * 10 + s * 1.2;
      const strainPct = Math.round(baseStrain + drift);
      const confidence = rand() > 0.12 ? "high" : "medium";
      const status: StatusLevel =
        strainPct < 62 ? "anomaly" : strainPct < 76 ? "caution" : "optimal";
      reps.push({
        index,
        set: s,
        repInSet: r,
        timestamp: Math.round(index * 9.5 + rand() * 2),
        status,
        femoralStrainPct: strainPct,
        confidence,
      });
    }
  }
  void sessionId;
  return reps;
}

function buildSessions(): Session[] {
  const rand = mulberry32(2026042);
  const sessions: Session[] = [];
  let seq = 0;

  for (let day = 1; day <= CURRENT_MISSION_DAY; day++) {
    const isRest = day % 7 === 6;
    if (isRest) continue;

    const plan: { exercise: ExerciseName; regime: GravityRegime; equipment: EquipmentName; load: number }[] = [];
    // Most days: squat at the current regime; twice a week heel raises.
    const regime: GravityRegime = day <= 8 ? "1g" : day % 3 === 0 ? "0g" : day % 3 === 1 ? "0.16g" : "0.38g";
    plan.push({ exercise: "Squat", regime, equipment: "ARED", load: 70 });
    if (day % 3 === 2) {
      plan.push({ exercise: "Heel raise", regime, equipment: "ARED", load: 45 });
    }

    for (const p of plan) {
      seq++;
      const f = regimeFactor[p.regime];
      const baseStrain = Math.round(
        74 + rand() * 26 - (day % 9 === 0 ? 10 : 0) + (p.exercise === "Heel raise" ? -18 : 0),
      );
      const form = Math.round(68 + rand() * 30 - (day < 6 ? 8 : 0));
      const sets = 3;
      const repsPerSet = 8;
      const reps = buildReps(rand, `s${seq}`, sets, repsPerSet, baseStrain);
      const status = statusFor(baseStrain, form);
      const flags: string[] = [];
      if (status === "anomaly" && rand() > 0.5) flags.push("Lumbar moment above cited range");
      sessions.push({
        id: `s${seq}`,
        crewId: "alex",
        missionDay: day,
        date: dateForMissionDay(day),
        exercise: p.exercise,
        regime: p.regime,
        equipment: p.equipment,
        sets,
        repsPerSet,
        targetLoadKg: Math.round(p.load * f),
        durationSec: 900 + Math.round(rand() * 600),
        peaks: {
          hip: Math.round((1850 + rand() * 500) * f + 320),
          knee: Math.round((1400 + rand() * 400) * f + 260),
          ankle: Math.round((900 + rand() * 250) * f + 180),
          lumbar: Math.round((95 + rand() * 40) * f + 12),
        },
        femoralStrainPct: baseStrain,
        safetyMargin: Math.round(18 + rand() * 22),
        formStability: form,
        confidence: rand() > 0.15 ? "high" : "medium",
        status,
        flags: flags.length ? flags : undefined,
        reps,
      });
    }
  }

  // Scripted anomaly session for demos: mission day 38, lumbar flag.
  const scripted = sessions[sessions.length - 8]!;
  scripted.id = "s-anomaly";
  scripted.status = "anomaly";
  scripted.flags = ["Lumbar moment high at rep 17", "Form stability dropped in set 2"];
  scripted.formStability = 58;
  scripted.femoralStrainPct = 88;
  scripted.confidence = "medium";
  scripted.reps = scripted.reps.map((r) =>
    r.index === 17
      ? { ...r, status: "anomaly" as StatusLevel, femoralStrainPct: 128, confidence: "medium" as const }
      : r,
  );
  scripted.notes = "Felt a pinch in the lower back on the second set.";

  // Scripted low-confidence session for demos.
  const lowConf = sessions[sessions.length - 4]!;
  lowConf.id = "s-lowconf";
  lowConf.confidence = "low";
  lowConf.flags = ["Tracking unclear for 22 seconds", "Loads paused, flags suppressed"];

  return sessions;
}

export const sessions: Session[] = buildSessions();

export function sessionsFor(crewId: string): Session[] {
  return sessions.filter((s) => s.crewId === crewId);
}

export function getSessionById(id: string): Session | undefined {
  return sessions.find((s) => s.id === id);
}

export function lastSessionFor(crewId: string): Session | undefined {
  const list = sessionsFor(crewId);
  return list[list.length - 1];
}
