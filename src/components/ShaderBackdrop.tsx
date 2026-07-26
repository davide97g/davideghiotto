import { prefersReducedMotion } from "@/lib/gsap";
import { scrollSignal } from "@/lib/scrollSignal";
import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import { useEffect, useRef } from "react";

const vertex = /* glsl */ `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

/**
 * Terminal-noir field: a slow flow-noise haze, a receding grid, and a scanline
 * shimmer. Scroll velocity smears the grid and lifts the accent glow, so the
 * backdrop reacts to how hard the page is being scrolled.
 */
const fragment = /* glsl */ `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uVelocity;
uniform float uProgress;
uniform vec3 uBase;
uniform vec3 uAccent;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  float t = uTime * 0.045;
  float vel = clamp(uVelocity, -1.0, 1.0);

  // Flow-noise haze.
  float warp = fbm(p * 1.4 - t * 0.5);
  float field = fbm(p * 2.1 + vec2(t, -t * 0.6) + warp * 0.6);
  float haze = pow(field, 3.2);

  // Receding grid, offset by page progress so it scrolls with the content.
  vec2 g = p * (13.0 + abs(vel) * 5.0);
  g.y += uProgress * 8.0 + t * 1.2;
  vec2 gd = abs(fract(g) - 0.5);
  float grid = max(
    smoothstep(0.03, 0.0, gd.x),
    smoothstep(0.03, 0.0, gd.y)
  );
  grid *= 0.5 + abs(vel) * 0.9;

  // Horizon fade: grid only reads near the lower half, like a terminal floor.
  grid *= smoothstep(0.85, 0.15, uv.y);

  float scan = sin(gl_FragCoord.y * 1.6 + uTime * 2.0) * 0.5 + 0.5;

  vec3 col = uBase;
  col += uAccent * haze * 0.22;
  col += uAccent * grid * 0.055;
  col += uAccent * 0.012 * scan;

  // Vignette, then dither to kill banding on near-black gradients.
  col *= 1.0 - length(p) * 0.28;
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

type Props = {
  /** Page background, as 0-1 RGB. */
  base?: [number, number, number];
  /** Accent the haze and grid are tinted with, as 0-1 RGB. */
  accent?: [number, number, number];
};

export default function ShaderBackdrop({
  base = [0.031, 0.035, 0.039],
  accent = [0.55, 1.0, 0.18],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let renderer: Renderer;
    let program: Program;
    let mesh: Mesh;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        canvas,
        antialias: false,
        alpha: false,
      });
      program = new Program(renderer.gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Vec2() },
          uVelocity: { value: 0 },
          uProgress: { value: 0 },
          uBase: { value: base },
          uAccent: { value: accent },
        },
      });
      mesh = new Mesh(renderer.gl, { geometry: new Triangle(renderer.gl), program });
    } catch {
      // No WebGL, or a lost context: the CSS background behind the canvas is
      // the fallback and the page renders unchanged without it.
      return;
    }

    // Mobile GPUs get fewer pixels to fill; the field is soft enough to hide it.
    const scale = window.matchMedia("(max-width: 768px)").matches ? 0.6 : 0.85;

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w * scale, h * scale);
      // setSize also writes inline CSS dimensions; stretch the smaller buffer
      // back over the full viewport.
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      // gl_FragCoord is in device pixels, so the uniform has to be the drawing
      // buffer size, not the CSS size — otherwise the field only covers 1/dpr
      // of the canvas and the edge shows as a hard rectangle.
      program.uniforms.uResolution.value.set(canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const reduced = prefersReducedMotion();
    let smoothedVelocity = 0;
    let frame = 0;
    const start = performance.now();

    const render = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      // Ease the velocity so a flick glides out instead of snapping back.
      smoothedVelocity += (scrollSignal.velocity / 40 - smoothedVelocity) * 0.06;
      program.uniforms.uVelocity.value = smoothedVelocity;
      program.uniforms.uProgress.value = scrollSignal.progress;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(render);
    };

    if (reduced) {
      // One static frame — no animation loop at all.
      renderer.render({ scene: mesh });
    } else {
      render();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [base, accent]);

  return (
    <div className="fixed inset-0 -z-10 bg-background" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />
    </div>
  );
}
