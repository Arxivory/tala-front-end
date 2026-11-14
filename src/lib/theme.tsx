import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "night" | "auto";

const STORAGE_KEY = "tala.theme";

function systemPrefersNight() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const dark = mode === "night" || (mode === "auto" && systemPrefersNight());
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Whether the rendered theme is currently night, whatever the mode. */
  isNight: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  setMode: () => {},
  isNight: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Light is the default; stored preference is read after mount so SSR and
  // the first client render agree (no hydration mismatch).
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial: ThemeMode =
      stored === "night" || stored === "auto" || stored === "light" ? stored : "light";
    setModeState(initial);
  }, []);

  useEffect(() => {
    applyTheme(mode);
    const update = () => {
      applyTheme(mode);
      setIsNight(
        mode === "night" || (mode === "auto" && systemPrefersNight()),
      );
    };
    update();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable, theme still applies for this session */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isNight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
