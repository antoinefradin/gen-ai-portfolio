import { useEffect, useRef } from "react";

// Lightweight Canvas2D approximation: colorful soft particles trail the
// pointer with additive ("lighter") blending and fade out over their
// lifetime. Visually similar "smoke" vibe to the WebGL fluid sim, but far
// cheaper — no shaders, no framebuffers, just a particle pool.

const PALETTE = ["#329696", "#3E9858", "#856ED9", "#B95F9D", "#C19433"];

export default function CanvasSmokeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let lastX = null;
    let lastY = null;
    let colorIdx = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(x, y, speed) {
      colorIdx += 1;
      const color = PALETTE[Math.floor(colorIdx / 5) % PALETTE.length];
      const count = Math.min(4, 1 + Math.floor(speed / 12));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spread + speed * 0.02 * (Math.random() - 0.3),
          vy: Math.sin(angle) * spread + speed * 0.02 * (Math.random() - 0.3),
          radius: 18 + Math.random() * 26,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          color,
        });
      }
      if (particles.length > 400) particles.splice(0, particles.length - 400);
    }

    function onPointerMove(clientX, clientY) {
      if (lastX === null) {
        lastX = clientX;
        lastY = clientY;
        return;
      }
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastX = clientX;
      lastY = clientY;
      if (speed > 1) spawn(clientX, clientY, speed);
    }

    function handleMouseMove(e) {
      onPointerMove(e.clientX, e.clientY);
    }
    function handleTouchMove(e) {
      const t = e.targetTouches[0];
      if (t) onPointerMove(t.clientX, t.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let rafId;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= p.decay;
        p.radius += 0.4;
      });
      particles = particles.filter((p) => p.life > 0);

      for (const p of particles) {
        const alpha = Math.max(p.life, 0) * 0.5;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, hexToRgba(p.color, alpha));
        gradient.addColorStop(1, hexToRgba(p.color, 0));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 h-screen w-screen" />;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
