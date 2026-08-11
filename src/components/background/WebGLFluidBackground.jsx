import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

// Uses the battle-tested `webgl-fluid-enhanced` library (same public "stable
// fluids" technique) instead of a hand-rolled shader/FBO pipeline — it picks
// WebGL2/WebGL1 and the right texture format per-GPU, which is exactly what a
// from-scratch implementation kept getting wrong across browsers.
//
// v0.8.0's API is class-based: `new WebGLFluidEnhanced(container)` creates
// (or reuses) a <canvas> inside `container` and sets that container's inline
// style (position/display/alignment) — so `container` is an inner div, not
// the fixed full-viewport wrapper itself, or the library's inline styles
// would clobber our `fixed inset-0` positioning.

export default function WebGLFluidBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const fluid = new WebGLFluidEnhanced(containerRef.current);
    const canvas = containerRef.current.querySelector("canvas");
    if (canvas) canvas.id = "fluid";

    fluid.setConfig({
      transparent: true,
      hover: true,
      colorPalette: ["#329696", "#3E9858", "#856ED9", "#B95F9D", "#C19433"],
      splatRadius: 0.2,
      densityDissipation: 3,
      velocityDissipation: 1.5,
      bloom: false,
      sunrays: false,
    });
    fluid.start();

    return () => {
      fluid.stop();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 h-screen w-screen" />;
}
