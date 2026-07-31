import {
  initConsentDefaults,
  readStoredConsent,
  setAnalyticsConsent,
  writeStoredConsent,
} from "@/lib/analytics";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ConsentContextValue = {
  /** True after localStorage has been read — banner waits for this. */
  ready: boolean;
  /** False until the visitor has accepted, rejected, or saved preferences. */
  decided: boolean;
  analytics: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    initConsentDefaults();
    const stored = readStoredConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setDecided(true);
      setAnalyticsConsent(stored.analytics);
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: boolean) => {
    writeStoredConsent(next);
    setAnalytics(next);
    setDecided(true);
    setAnalyticsConsent(next);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      ready,
      decided,
      analytics,
      preferencesOpen,
      acceptAll: () => persist(true),
      rejectAll: () => persist(false),
      savePreferences: (next) => persist(next),
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [ready, decided, analytics, preferencesOpen, persist]
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
