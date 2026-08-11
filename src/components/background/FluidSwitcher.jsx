import { useState } from "react";
import WebGLFluidBackground from "./WebGLFluidBackground";
import CanvasSmokeBackground from "./CanvasSmokeBackground";

const ENGINES = [
  { id: "webgl", label: "WebGL Fluid" },
  { id: "canvas2d", label: "Canvas 2D" },
  { id: "off", label: "Off" },
];

export default function FluidSwitcher() {
  const [engine, setEngine] = useState("webgl");

  return (
    <>
      {engine === "webgl" && <WebGLFluidBackground />}
      {engine === "canvas2d" && <CanvasSmokeBackground />}

      <div className="fixed right-4 bottom-4 z-[60] flex items-center gap-1 rounded-full border border-neutral-200 bg-white/70 p-1 text-xs shadow-lg backdrop-blur-lg">
        {ENGINES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setEngine(id)}
            className={`cursor-pointer rounded-full px-3 py-1.5 font-medium transition-colors ${
              engine === id
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-200/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
