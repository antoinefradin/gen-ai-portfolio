import { useState } from "react";
import { useCursor } from "../context/CursorContext.jsx";

// Small top-right toggle for the blue-dot custom cursor, styled like the
// rest of the blog (docs/blog-post-design.md: hard border, flat shadow).

export default function CursorToggle() {
  const { enabled, toggle } = useCursor();
  const [flash, setFlash] = useState(false);

  function handleClick() {
    toggle();
    setFlash(true);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onAnimationEnd={() => setFlash(false)}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn off custom cursor" : "Turn on custom cursor"}
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        zIndex: 10000,
        width: "3.4rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3rem",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.6rem",
        fontWeight: 700,
        color: "#1a1a1a",
        background: "#fff",
        border: "2px solid #1a1a1a",
        borderRadius: "3px",
        padding: "0.3rem 0",
        boxShadow: "2px 2px 0 #1a1a1a",
        animation: flash ? "cursorToggleFlash 0.4s ease-out" : "none",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          flexShrink: 0,
          borderRadius: "50%",
          background: enabled ? "#3b82f6" : "transparent",
          border: "1.5px solid #1a1a1a",
        }}
      />
      {enabled ? "On" : "Off"}
    </button>
  );
}
