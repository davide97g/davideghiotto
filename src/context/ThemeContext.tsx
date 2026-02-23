import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export type ThemeId = "modern" | "luxury" | "editorial" | "mr-franz";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "modern",
  setTheme: () => {},
});

const VALID_THEMES: ThemeId[] = ["modern", "luxury", "editorial", "mr-franz"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [theme, setThemeState] = useState<ThemeId>(() => {
    const param = searchParams.get("theme") as ThemeId;
    return VALID_THEMES.includes(param) ? param : "modern";
  });

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    setSearchParams({ theme: t }, { replace: true });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync if URL changes externally
  useEffect(() => {
    const param = searchParams.get("theme") as ThemeId;
    if (VALID_THEMES.includes(param) && param !== theme) {
      setThemeState(param);
    }
  }, [searchParams]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
