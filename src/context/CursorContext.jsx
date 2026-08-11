import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "customCursorEnabled";
const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor", enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return (
    <CursorContext.Provider value={{ enabled, toggle: () => setEnabled((e) => !e) }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within a CursorProvider");
  return ctx;
}
