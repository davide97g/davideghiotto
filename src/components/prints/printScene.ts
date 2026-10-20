/**
 * The three.js stage behind `ModelViewer`. Lives in its own module so the whole
 * of three (~600 KB) is a lazy chunk, imported only when the 3D section comes
 * near the viewport.
 *
 * One renderer per viewer, reused across models: `load` swaps the mesh, fits the
 * camera and plays the "printing" reveal — a clipping plane that rises from the
 * bed, with the cut face shown in lime by a back-face twin of the mesh. Renders
 * only while `setActive(true)`, so an off-screen viewer costs nothing.
 */

import { gsap } from "@/lib/gsap";
import {
  ACESFilmicToneMapping,
  BackSide,
  Box3,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Sphere,
  Vector3,
  WebGLRenderer,
  GridHelper,
  LineBasicMaterial,
  type Object3D,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";

/** --primary as sRGB hex: a three Color takes numbers, not an oklch token. */
const ACCENT = "#CBDA42";
/** Faces meeting at more than this keep a hard edge; flatter ones shade smooth. */
const CREASE = Math.PI / 6;
const VIEW = { azimuth: Math.PI / 5, elevation: Math.PI / 7 };

export interface PrintStats {
  triangles: number;
  /** Width, depth, height in model units — millimetres for a print. */
  size: [number, number, number];
}

export interface PrintScene {
  load(
    url: string,
    format: "stl" | "3mf",
    opts: { signal: AbortSignal; onProgress?: (ratio: number) => void }
  ): Promise<PrintStats>;
  setColor(hex: string): void;
  setActive(active: boolean): void;
  dispose(): void;
}

/** PLA black and white blow out under studio light; nudge them into range. */
function filamentColor(hex: string): Color {
  const c = new Color(hex);
  const l = c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
  if (l < 0.02) return new Color("#1c1c21");
  if (l > 0.95) return new Color("#e6e6ea");
  return c;
}

async function download(
  url: string,
  signal: AbortSignal,
  onProgress?: (ratio: number) => void
): Promise<ArrayBuffer> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body || !total || !onProgress) return res.arrayBuffer();

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    // content-length is the compressed size when the CDN gzips, hence the clamp.
    onProgress(Math.min(1, received / total));
  }
  return new Blob(chunks).arrayBuffer();
}

function parse(buffer: ArrayBuffer, format: "stl" | "3mf"): Object3D {
  if (format === "stl") return new Mesh(new STLLoader().parse(buffer));
  return new ThreeMFLoader().parse(buffer);
}

export function createPrintScene(
  canvas: HTMLCanvasElement,
  { reducedMotion }: { reducedMotion: boolean }
): PrintScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.localClippingEnabled = true;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.42;

  const camera = new PerspectiveCamera(30, 1, 0.1, 10_000);

  const key = new DirectionalLight("#ffffff", 1.8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0005;
  const rim = new DirectionalLight(ACCENT, 1.1);
  scene.add(key, key.target, rim, new HemisphereLight("#f3f3f6", "#0a0a0d", 0.35));

  const shadow = new Mesh(new PlaneGeometry(1, 1), new ShadowMaterial({ opacity: 0.38 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.receiveShadow = true;
  scene.add(shadow);

  let grid: GridHelper | null = null;
  const pivot = new Group();
  scene.add(pivot);

  // Everything below the plane is drawn; raising it "prints" the model. OPEN
  // parks it far above anything, which keeps the shader (and its clipping) as is.
  const OPEN = 1e9;
  const cut = new Plane(new Vector3(0, -1, 0), OPEN);
  const material = new MeshStandardMaterial({
    color: filamentColor("#8E9089"),
    roughness: 0.62,
    metalness: 0,
    clippingPlanes: [cut],
    clipShadows: true,
  });
  const capMaterial = new MeshBasicMaterial({ color: ACCENT, side: BackSide, clippingPlanes: [cut] });

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  // The wheel and pinch belong to the page scroll, not to a dolly.
  controls.enableZoom = false;
  controls.enableDamping = !reducedMotion;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.1;
  controls.minPolarAngle = Math.PI / 8;
  controls.maxPolarAngle = Math.PI / 2.05;
  // OrbitControls claims every touch; vertical swipes must still scroll the page.
  canvas.style.touchAction = "pan-y";

  let active = false;
  let idleTimer = 0;
  let reveal: gsap.core.Tween | null = null;
  let framed: Box3 | null = null;
  const owned: BufferGeometry[] = [];

  const render = () => renderer.render(scene, camera);
  const tick = () => {
    controls.update();
    render();
  };
  const loop = () => renderer.setAnimationLoop(active && !reducedMotion ? tick : null);

  // Reduced motion: no loop at all, a frame per change instead.
  controls.addEventListener("change", () => {
    if (reducedMotion) render();
  });
  controls.addEventListener("start", () => {
    window.clearTimeout(idleTimer);
    controls.autoRotate = false;
  });
  controls.addEventListener("end", () => {
    if (reducedMotion) return;
    idleTimer = window.setTimeout(() => (controls.autoRotate = true), 2500);
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    if (w / h !== camera.aspect) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (framed) frame(framed);
    }
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  function clearModel() {
    reveal?.kill();
    pivot.clear();
    owned.splice(0).forEach((g) => g.dispose());
  }

  function frame(box: Box3) {
    framed = box;
    const size = box.getSize(new Vector3());
    const r = box.getBoundingSphere(new Sphere()).radius;

    const footprint = Math.max(size.x, size.z) * 1.8;
    shadow.scale.set(footprint * 2, footprint * 2, 1);
    if (grid) {
      scene.remove(grid);
      grid.dispose();
    }
    // 10 mm cells, like the print bed under it.
    const cells = Math.max(4, Math.ceil(footprint / 10));
    grid = new GridHelper(cells * 10, cells, "#34343d", "#2b2b33");
    const gridMaterial = grid.material as LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.5;
    gridMaterial.depthWrite = false;
    grid.position.y = 0.01;
    scene.add(grid);

    const target = new Vector3(0, size.y / 2, 0);
    const dir = new Vector3(
      Math.cos(VIEW.elevation) * Math.sin(VIEW.azimuth),
      Math.sin(VIEW.elevation),
      Math.cos(VIEW.elevation) * Math.cos(VIEW.azimuth)
    );
    // Fit the turntable, not the part: auto-rotate sweeps the footprint through
    // every azimuth, so the frame has to hold the circle it traces at the bottom
    // and top of the part, in both fields of view.
    const right = new Vector3().crossVectors(new Vector3(0, 1, 0), dir).normalize();
    const up = new Vector3().crossVectors(dir, right);
    const tanV = Math.tan((camera.fov * Math.PI) / 360);
    const tanH = tanV * camera.aspect;
    const reach = Math.hypot(Math.max(-box.min.x, box.max.x), Math.max(-box.min.z, box.max.z));
    let distance = 0;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      for (const y of [box.min.y, box.max.y]) {
        const p = new Vector3(Math.cos(a) * reach, y, Math.sin(a) * reach).sub(target);
        const depth = p.dot(dir);
        distance = Math.max(
          distance,
          depth + Math.abs(p.dot(right)) / tanH,
          depth + Math.abs(p.dot(up)) / tanV
        );
      }
    }
    distance *= 1.08;
    camera.position.copy(target).addScaledVector(dir, distance);
    camera.near = distance / 100;
    camera.far = distance * 20;
    camera.updateProjectionMatrix();
    controls.target.copy(target);
    controls.update();

    key.position.set(r * 1.4, r * 2.6, r * 1.2);
    rim.position.set(-r * 1.8, r * 1.1, -r * 2.2);
    const cam = key.shadow.camera;
    cam.left = cam.bottom = -r * 1.5;
    cam.right = cam.top = r * 1.5;
    cam.near = r * 0.1;
    cam.far = r * 8;
    cam.updateProjectionMatrix();
  }

  return {
    async load(url, format, { signal, onProgress }) {
      const buffer = await download(url, signal, onProgress);
      signal.throwIfAborted();
      const loaded = parse(buffer, format);

      clearModel();
      // Slicers are Z-up; three is Y-up.
      const model = new Group();
      model.rotation.x = -Math.PI / 2;
      model.add(loaded);

      const creased = new Map<BufferGeometry, BufferGeometry>();
      let triangles = 0;
      const meshes: Mesh[] = [];
      model.traverse((o) => {
        if ((o as Mesh).isMesh) meshes.push(o as Mesh);
      });
      for (const mesh of meshes) {
        let geometry = creased.get(mesh.geometry);
        if (!geometry) {
          geometry = toCreasedNormals(mesh.geometry, CREASE);
          creased.set(mesh.geometry, geometry);
          owned.push(geometry);
          mesh.geometry.dispose();
        }
        triangles += geometry.attributes.position.count / 3;
        mesh.geometry = geometry;
        mesh.material = material;
        mesh.castShadow = true;
        mesh.add(new Mesh(geometry, capMaterial));
      }

      // Centre on the bed: footprint around the origin, bottom on y = 0.
      model.updateMatrixWorld(true);
      const box = new Box3().setFromObject(model);
      const center = box.getCenter(new Vector3());
      model.position.set(-center.x, -box.min.y, -center.z);
      pivot.add(model);
      box.translate(model.position);
      frame(box);

      const size = box.getSize(new Vector3());
      if (reducedMotion) {
        cut.constant = OPEN;
        render();
      } else {
        const state = { h: 0 };
        cut.constant = 0;
        reveal = gsap.to(state, {
          h: size.y * 1.001,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => (cut.constant = state.h),
          onComplete: () => (cut.constant = OPEN),
        });
      }

      return { triangles: Math.round(triangles), size: [size.x, size.z, size.y] };
    },

    setColor(hex) {
      material.color.copy(filamentColor(hex));
      render();
    },

    setActive(next) {
      active = next;
      loop();
      if (next) render();
    },

    dispose() {
      window.clearTimeout(idleTimer);
      renderer.setAnimationLoop(null);
      observer.disconnect();
      clearModel();
      controls.dispose();
      grid?.dispose();
      shadow.geometry.dispose();
      (shadow.material as ShadowMaterial).dispose();
      material.dispose();
      capMaterial.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
