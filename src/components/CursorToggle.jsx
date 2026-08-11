import { useCursor } from "../context/CursorContext.jsx";

// Small top-right toggle for the blue-dot custom cursor, styled like the
// rest of the blog (docs/blog-post-design.md: hard border, flat shadow).

export default function CursorToggle() {
  const { enabled, toggle } = useCursor();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn off custom cursor" : "Turn on custom cursor"}
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 10000,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "#1a1a1a",
        background: "#fff",
        border: "2.5px solid #1a1a1a",
        borderRadius: "3px",
        padding: "0.4rem 0.7rem",
        boxShadow: "3px 3px 0 #1a1a1a",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: enabled ? "#3b82f6" : "transparent",
          border: "2px solid #1a1a1a",
        }}
      />
      {enabled ? "Cursor: On" : "Cursor: Off"}
    </button>
  );
}
