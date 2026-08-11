import { useEffect, useRef } from "react";

// Replaces the native pointer with a blue circle / black border dot (see
// docs/blog-post-design.md for the palette) — index.css sets `cursor: none`
// site-wide on fine-pointer devices to make room for it.

export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch: no cursor to replace

    const el = dotRef.current;
    let shown = false;

    function handleMove(e) {
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-5 w-5 rounded-full opacity-0"
      style={{
        backgroundColor: "#3b82f6",
        border: "3px solid #1a1a1a",
        transition: "opacity 0.15s ease",
        willChange: "transform",
      }}
    />
  );
}
