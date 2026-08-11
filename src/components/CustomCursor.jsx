import { useEffect, useRef } from "react";
import { useCursor } from "../context/CursorContext.jsx";

// Replaces the native pointer with a blue circle / black border dot (see
// docs/blog-post-design.md for the palette). There must never be a moment
// with *no* visible cursor, so the native pointer and the dot are swapped
// atomically: html.custom-cursor (which hides the native cursor, see
// index.css) is only added once we actually know where to draw the dot —
// never speculatively — and both the class and the dot's opacity flip in
// the same function call.

export default function CustomCursor() {
  const dotRef = useRef(null);
  const hasPositionRef = useRef(false);
  const { enabled } = useCursor();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch: nothing to swap

    function sync() {
      const showDot = enabled && hasPositionRef.current;
      document.documentElement.classList.toggle("custom-cursor", showDot);
      if (dotRef.current) dotRef.current.style.opacity = showDot ? "1" : "0";
    }

    function handleMove(e) {
      hasPositionRef.current = true;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      sync();
    }

    window.addEventListener("mousemove", handleMove);
    sync(); // re-apply immediately on toggle, using whatever position we already have

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled]);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100000] h-5 w-5 rounded-full opacity-0"
      style={{
        backgroundColor: "#3b82f6",
        border: "3px solid #1a1a1a",
        transition: "opacity 0.15s ease",
        willChange: "transform",
      }}
    />
  );
}
