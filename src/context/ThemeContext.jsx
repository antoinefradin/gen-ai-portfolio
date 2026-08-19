import { createContext, useContext, useEffect, useState } from "react";

// Theme preference for the HOME page only (light / dark / dim). The provider
// just owns the value + persistence — it deliberately does NOT touch the DOM.
// Home.jsx applies `data-theme` to <html> on mount and removes it on unmount,
// so blog routes are never themed (see docs / plan).
const STORAGE_KEY = "themePreference";
const THEMES = ["light", "dark", "dim"];
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "light";
  });

  const setTheme = (next) => {
    if (THEMES.includes(next)) setThemeState(next);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
