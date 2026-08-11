import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "customCursorEnabled";
const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    // The html.custom-cursor class itself is owned by CustomCursor.jsx —
    // it needs to combine `enabled` with "do we know the pointer position
    // yet" so the native cursor and the dot never both disappear at once.
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
