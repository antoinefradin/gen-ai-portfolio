import { useEffect, useRef } from "react";
import {
  baseVertexShader,
  copyShader,
  displayShader,
  splatShader,
  advectionShader,
  divergenceShader,
  curlShader,
  vorticityShader,
  pressureShader,
  gradientSubtractShader,
} from "./webglFluidShaders";

// Compact from-scratch implementation of the classic "stable fluids" technique
// (Jos Stam): velocity + dye are advected on ping-ponged framebuffers, curl /
// vorticity confinement adds swirl, and a Jacobi-iterated pressure solve keeps
// the velocity field divergence-free.

const CONFIG = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 720,
  DENSITY_DISSIPATION: 1.2,
  VELOCITY_DISSIPATION: 0.6,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 28,
  SPLAT_RADIUS: 0.2,
  SPLAT_FORCE: 6000,
};

const PALETTE = [
  [0x32, 0x96, 0x96],
  [0x3e, 0x98, 0x58],
  [0x85, 0x6e, 0xd9],
  [0xb9, 0x5f, 0x9d],
  [0xc1, 0x94, 0x33],
];

function paletteColor(i) {
  const [r, g, b] = PALETTE[i % PALETTE.length];
  return [r / 255, g / 255, b / 255];
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vs, fsSource) {
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
}

export default function WebGLFluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      }) || canvas.getContext("experimental-webgl");

    if (!gl) return;

    const halfFloat = gl.getExtension("OES_texture_half_float");
    const supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    gl.getExtension("OES_texture_float");
    if (!halfFloat) return; // graceful no-op on unsupported browsers

    const texType = halfFloat.HALF_FLOAT_OES;
    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.clearColor(0, 0, 0, 0);

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, baseVertexShader);
    const copyProg = createProgram(gl, vertexShader, copyShader);
    const displayProg = createProgram(gl, vertexShader, displayShader);
    const splatProg = createProgram(gl, vertexShader, splatShader);
    const advectionProg = createProgram(gl, vertexShader, advectionShader);
    const divergenceProg = createProgram(gl, vertexShader, divergenceShader);
    const curlProg = createProgram(gl, vertexShader, curlShader);
    const vorticityProg = createProgram(gl, vertexShader, vorticityShader);
    const pressureProg = createProgram(gl, vertexShader, pressureShader);
    const gradientSubtractProg = createProgram(gl, vertexShader, gradientSubtractShader);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function createFBO(w, h) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, texType, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w, h) {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        width: w,
        height: h,
        get read() {
          return fbo1;
        },
        set read(v) {
          fbo1 = v;
        },
        get write() {
          return fbo2;
        },
        set write(v) {
          fbo2 = v;
        },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          fbo2 = t;
        },
      };
    }

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    let dye, velocity, divergence, curlFBO, pressure;

    function initFramebuffers() {
      const simRes = getResolution(CONFIG.SIM_RESOLUTION);
      const dyeRes = getResolution(CONFIG.DYE_RESOLUTION);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height);
      velocity = createDoubleFBO(simRes.width, simRes.height);
      divergence = createFBO(simRes.width, simRes.height);
      curlFBO = createFBO(simRes.width, simRes.height);
      pressure = createDoubleFBO(simRes.width, simRes.height);
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    resizeCanvas();
    initFramebuffers();

    const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, colorIdx: 0 };

    function normalizedFromEvent(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    }

    let lastX = null;
    let lastY = null;

    function onPointerMove(clientX, clientY) {
      const { x, y } = normalizedFromEvent(clientX, clientY);
      if (lastX === null) {
        lastX = x;
        lastY = y;
        return;
      }
      const dx = (x - lastX) * CONFIG.SPLAT_FORCE;
      const dy = (y - lastY) * CONFIG.SPLAT_FORCE;
      lastX = x;
      lastY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.dx = dx;
      pointer.dy = dy;
      pointer.moved = Math.abs(dx) > 0 || Math.abs(dy) > 0;
    }

    function handleMouseMove(e) {
      onPointerMove(e.clientX, e.clientY);
    }
    function handleTouchMove(e) {
      const touches = e.targetTouches;
      if (touches.length > 0) onPointerMove(touches[0].clientX, touches[0].clientY);
    }
    function handleResize() {
      if (resizeCanvas()) initFramebuffers();
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    function splat(x, y, dx, dy, color) {
      gl.useProgram(splatProg.program);
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProg.uniforms.point, x, y);
      gl.uniform3f(splatProg.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProg.uniforms.radius, CONFIG.SPLAT_RADIUS / 100.0);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    }

    function applyInputs() {
      if (!pointer.moved) return;
      pointer.moved = false;
      pointer.colorIdx += 1;
      const color = paletteColor(Math.floor(pointer.colorIdx / 6));
      splat(pointer.x, pointer.y, pointer.dx, pointer.dy, color);
    }

    let lastTime = performance.now();
    function calcDeltaTime() {
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 1 / 60);
      lastTime = now;
      return dt;
    }

    function step(dt) {
      gl.disable(gl.BLEND);

      gl.useProgram(curlProg.program);
      gl.uniform2f(curlProg.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      gl.useProgram(vorticityProg.program);
      gl.uniform2f(vorticityProg.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);
      gl.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProg.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(vorticityProg.uniforms.curl, CONFIG.CURL);
      gl.uniform1f(vorticityProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      gl.useProgram(divergenceProg.program);
      gl.uniform2f(divergenceProg.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);
      gl.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      gl.useProgram(pressureProg.program);
      gl.uniform2f(pressureProg.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);
      gl.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gl.useProgram(gradientSubtractProg.program);
      gl.uniform2f(
        gradientSubtractProg.uniforms.texelSize,
        1.0 / velocity.width,
        1.0 / velocity.height
      );
      gl.uniform1i(gradientSubtractProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      gl.useProgram(advectionProg.program);
      gl.uniform2f(advectionProg.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProg.uniforms.dt, dt);
      gl.uniform1f(advectionProg.uniforms.dissipation, CONFIG.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProg.uniforms.dissipation, CONFIG.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(displayProg.program);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    let rafId;
    function update() {
      const dt = calcDeltaTime();
      applyInputs();
      step(dt);
      render();
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) loseContext.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fluid"
      className="fixed inset-0 z-0 h-screen w-screen"
    />
  );
}
