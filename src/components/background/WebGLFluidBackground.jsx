import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

// Uses the battle-tested `webgl-fluid-enhanced` library (same public "stable
// fluids" technique) instead of a hand-rolled shader/FBO pipeline — it picks
// WebGL2/WebGL1 and the right texture format per-GPU, which is exactly what a
// from-scratch implementation kept getting wrong across browsers.
//
// This layer renders ABOVE all page content (z-[9999]) so the fluid paints
// over the title/logo/hero. It's `pointer-events-none`, so clicks fall through
// to the buttons underneath — which means the library's own canvas mouse
// listeners never fire. We keep the fluid interactive by forwarding window
// pointer moves into the public `splatAtLocation(x, y, dx, dy, color)` API.

const PALETTE = ["#329696", "#3E9858", "#856ED9", "#B95F9D", "#C19433"];

// Native hover scales texcoord deltas by `splatForce` (library default 6000);
// we reproduce that so forwarded splats feel the same.
const SPLAT_FORCE = 6000;

export default function WebGLFluidBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const fluid = new WebGLFluidEnhanced(containerRef.current);
    const canvas = containerRef.current.querySelector("canvas");
    if (canvas) canvas.id = "fluid";

    fluid.setConfig({
      transparent: true,
      hover: true,
      colorPalette: PALETTE,
      splatRadius: 0.2,
      densityDissipation: 3,
      velocityDissipation: 1.5,
      bloom: false,
      sunrays: false,
    });
    fluid.start();

    // The library overwrites the container's `position` with `relative` on
    // start — re-assert `fixed` so the layer stays pinned to the viewport.
    containerRef.current.style.position = "fixed";

    // Forward pointer movement to the fluid (canvas is pointer-events-none, so
    // its native mousemove listeners can't fire).
    let lastX = null;
    let lastY = null;
    let color = null;
    let lastColorAt = 0;

    const onMove = (clientX, clientY) => {
      const dpr = window.devicePixelRatio || 1;
      if (lastX !== null) {
        const dx = ((clientX - lastX) / window.innerWidth) * SPLAT_FORCE;
        const dy = -((clientY - lastY) / window.innerHeight) * SPLAT_FORCE; // Y flipped
        // Refresh the palette color occasionally so it doesn't strobe per frame.
        const now = performance.now();
        if (!color || now - lastColorAt > 500) {
          color = PALETTE[(Math.random() * PALETTE.length) | 0];
          lastColorAt = now;
        }
        fluid.splatAtLocation(clientX * dpr, clientY, dx, dy, color);
      }
      lastX = clientX;
      lastY = clientY;
    };

    const onMouse = (e) => onMove(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      fluid.stop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen"
    />
  );
}
