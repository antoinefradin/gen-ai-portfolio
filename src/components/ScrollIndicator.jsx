// Bottom-of-hero "scroll" hint: a mouse outline whose inner dot slides down
// and fades while the whole shape gently bobs (keyframes in index.css). It's a
// real <button> so it's focusable/clickable — a click smooth-scrolls one
// viewport down. pointer-events-auto is required because the Hero root sets
// pointer-events-none (so mousemove falls through to the fluid canvas).

// Theme-aware ink (see src/index.css --ink). CSS vars resolve fine in inline
// styles, so the indicator recolors with the active home theme.
const INK = "var(--ink)";

export default function ScrollIndicator({ targetId = "explore" }) {
  const scrollDown = () => {
    // Scroll to the destination section by id so we land on it even when the
    // hero is taller than one viewport (e.g. small screens where hero content
    // overflows). Fall back to a one-viewport jump if the target is missing.
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollDown}
      aria-label="Scroll down"
      className="pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center border-0 bg-transparent p-0"
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: INK,
          marginBottom: "0.4rem",
        }}
      >
        SCROLL
      </span>
      <div
        style={{
          width: 28,
          height: 44,
          border: `3px solid ${INK}`,
          borderRadius: 14,
          display: "flex",
          justifyContent: "center",
          paddingTop: 6,
          animation: "scrollMouseBob 2s ease-in-out infinite",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            background: INK,
            borderRadius: "50%",
            animation: "scrollWheelDrop 1.8s ease-in-out infinite",
          }}
        />
      </div>
    </button>
  );
}
