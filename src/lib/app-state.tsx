import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { crew as allCrew } from "@/data/crew";
import type { CheckIn, CrewMember, GravityRegime, Role } from "@/data/types";

const KEYS = {
  gravity: "tala.gravity",
  role: "tala.role",
  user: "tala.user",
  demo: "tala.demo",
  checkins: "tala.checkins",
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

interface AppStateValue {
  gravity: GravityRegime;
  setGravity: (g: GravityRegime) => void;
  role: Role;
  setRole: (r: Role) => void;
  currentUser: CrewMember;
  setCurrentUserById: (id: string) => void;
  demoMode: boolean;
  enterDemoMode: () => void;
  signOut: () => void;
  /** Mock connectivity state for the top-bar pill. */
  connectivity: { online: boolean; queued: number };
  checkins: Record<string, CheckIn>;
  saveCheckIn: (c: CheckIn) => void;
  hasCheckInToday: boolean;
}

const AppContext = createContext<AppStateValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Defaults match SSR; stored preferences are read after mount.
  const [gravity, setGravityState] = useState<GravityRegime>("0.16g");
  const [role, setRoleState] = useState<Role>("astronaut");
  const [userId, setUserId] = useState<string>("alex");
  const [demoMode, setDemoMode] = useState(false);
  const [checkins, setCheckins] = useState<Record<string, CheckIn>>({});

  useEffect(() => {
    try {
      const g = window.localStorage.getItem(KEYS.gravity);
      if (g === "0g" || g === "0.16g" || g === "0.38g" || g === "1g") setGravityState(g);
      const r = window.localStorage.getItem(KEYS.role);
      if (r === "astronaut" || r === "cmo") setRoleState(r);
      const u = window.localStorage.getItem(KEYS.user);
      if (u && allCrew.some((c) => c.id === u)) setUserId(u);
      if (window.localStorage.getItem(KEYS.demo) === "1") setDemoMode(true);
      const raw = window.localStorage.getItem(KEYS.checkins);
      if (raw) setCheckins(JSON.parse(raw) as Record<string, CheckIn>);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const persist = (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  };

  const setGravity = useCallback((g: GravityRegime) => {
    setGravityState(g);
    persist(KEYS.gravity, g);
    toast(`Gravity scenario selected: ${g}`, {
      description:
        "This selects precomputed context only; it does not recalculate movement or baseline data.",
    });
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    persist(KEYS.role, r);
  }, []);

  const setCurrentUserById = useCallback((id: string) => {
    setUserId(id);
    persist(KEYS.user, id);
    const member = allCrew.find((c) => c.id === id);
    if (member) setRoleState(member.role);
  }, []);

  const enterDemoMode = useCallback(() => {
    setUserId("alex");
    setRoleState("astronaut");
    setDemoMode(true);
    persist(KEYS.demo, "1");
    persist(KEYS.user, "alex");
  }, []);

  const signOut = useCallback(() => {
    setDemoMode(false);
    try {
      window.localStorage.removeItem(KEYS.demo);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const saveCheckIn = useCallback((c: CheckIn) => {
    setCheckins((prev) => {
      const next = { ...prev, [c.date]: c };
      try {
        window.localStorage.setItem(KEYS.checkins, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const currentUser: CrewMember = allCrew.find((c) => c.id === userId) ?? allCrew[0]!;

  const value: AppStateValue = {
    gravity,
    setGravity,
    role,
    setRole,
    currentUser,
    setCurrentUserById,
    demoMode,
    enterDemoMode,
    signOut,
    connectivity: { online: false, queued: 3 },
    checkins,
    saveCheckIn,
    hasCheckInToday: Boolean(checkins[todayIso()]),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppStateValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside <AppProvider>");
  }
  return ctx;
}
