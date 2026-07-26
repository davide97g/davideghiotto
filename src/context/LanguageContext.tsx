import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export type LangId = "en" | "it";

interface LanguageContextType {
  lang: LangId;
  setLang: (lang: LangId) => void;
  /** Picks the entry matching the current language from a { en, it } record. */
  t: <T>(dict: Record<LangId, T>) => T;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (dict) => dict.en,
});

const VALID_LANGS: LangId[] = ["en", "it"];
const STORAGE_KEY = "lang";

function detectLang(param: string | null): LangId {
  if (VALID_LANGS.includes(param as LangId)) return param as LangId;

  const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (VALID_LANGS.includes(stored as LangId)) return stored as LangId;

  const navigatorLang = typeof navigator !== "undefined" ? navigator.language : "";
  return navigatorLang.toLowerCase().startsWith("it") ? "it" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [lang, setLangState] = useState<LangId>(() => detectLang(searchParams.get("lang")));

  const setLang = (l: LangId) => {
    setLangState(l);
    const next = new URLSearchParams(searchParams);
    next.set("lang", l);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  // Sync if the URL changes externally (back button, shared link). Depends on
  // searchParams alone on purpose — reacting to `lang` would fight setLang.
  useEffect(() => {
    const param = searchParams.get("lang") as LangId;
    if (VALID_LANGS.includes(param) && param !== lang) {
      setLangState(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const t = <T,>(dict: Record<LangId, T>): T => dict[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
