import type { PrintScene, PrintStats } from "@/components/prints/printScene";
import { StateSticker } from "@/components/StateSticker";
import { HoloButton } from "@/components/ui/holo-button";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { prefersReducedMotion } from "@/lib/gsap";
import { formatBytes, type PrintModel } from "@/lib/printsGithub";
import { useEffect, useRef, useState } from "react";

/** Above this the model waits for a click instead of loading on sight. */
const AUTOLOAD_BYTES = 12 * 1024 * 1024;

type Status = "idle" | "heavy" | "loading" | "ready" | "error" | "unsupported";

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
};

/**
 * The live render of one print. three.js is imported the first time the viewer
 * comes within 600px of the viewport, and the scene only renders while the
 * canvas is on screen — see `printScene.ts`.
 */
export default function ModelViewer({
  model,
  color,
  onStats,
}: {
  model: PrintModel | null;
  color: string;
  onStats: (stats: PrintStats | null) => void;
}) {
  const { t } = useLanguage();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<PrintScene | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const stats = useRef(onStats);
  stats.current = onStats;

  // Lazy: three and the scene are created once, when the viewer gets close.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!hasWebGL()) {
      setStatus("unsupported");
      return;
    }

    let created: PrintScene | null = null;
    let cancelled = false;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        import("@/components/prints/printScene")
          .then(({ createPrintScene }) => {
            if (cancelled || !canvas.current) return;
            created = createPrintScene(canvas.current, { reducedMotion: prefersReducedMotion() });
            setScene(created);
          })
          .catch(() => !cancelled && setStatus("error"));
      },
      { rootMargin: "600px 0px" }
    );
    near.observe(el);

    return () => {
      cancelled = true;
      near.disconnect();
      created?.dispose();
    };
  }, []);

  // Render only while visible.
  useEffect(() => {
    const el = wrap.current;
    if (!scene || !el) return;
    const seen = new IntersectionObserver(([entry]) => scene.setActive(entry.isIntersecting));
    seen.observe(el);
    return () => {
      seen.disconnect();
      scene.setActive(false);
    };
  }, [scene]);

  useEffect(() => {
    if (!scene || !model) return;
    if (model.size > AUTOLOAD_BYTES && confirmed !== model.url) {
      setStatus("heavy");
      stats.current(null);
      return;
    }

    const abort = new AbortController();
    setStatus("loading");
    setProgress(0);
    stats.current(null);
    scene
      .load(model.url, model.format, { signal: abort.signal, onProgress: setProgress })
      .then((result) => {
        if (abort.signal.aborted) return;
        setStatus("ready");
        stats.current(result);
      })
      .catch(() => !abort.signal.aborted && setStatus("error"));
    return () => abort.abort();
  }, [scene, model, confirmed, attempt]);

  useEffect(() => {
    scene?.setColor(color);
  }, [scene, color]);

  const overlay = "absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center";

  return (
    <div ref={wrap} className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
      <canvas
        ref={canvas}
        className={`size-full cursor-grab outline-none transition-opacity duration-500 active:cursor-grabbing ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
        aria-label={model?.name}
        role="img"
      />

      {(status === "idle" || status === "loading") && (
        <div className={overlay} aria-live="polite">
          <StateSticker state="loading" float className="w-24 sm:w-32" />
          <span className="hud tabular-nums">
            {t(ui.prints.loading)}
            {status === "loading" && progress > 0 ? ` · ${Math.round(progress * 100)}%` : ""}
          </span>
        </div>
      )}

      {status === "heavy" && model && (
        <div className={overlay}>
          <span className="hud">
            {t(ui.prints.heavy)} · {formatBytes(model.size)}
          </span>
          <HoloButton variant="outline" size="sm" onClick={() => setConfirmed(model.url)}>
            {t(ui.prints.load)}
          </HoloButton>
        </div>
      )}

      {status === "error" && (
        <div className={overlay}>
          <StateSticker state="error" className="w-24 rotate-2 sm:w-32" />
          <p className="text-sm text-muted-foreground">{t(ui.prints.error)}</p>
          <HoloButton variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>
            {t(ui.prints.retry)}
          </HoloButton>
        </div>
      )}

      {status === "unsupported" && (
        <div className={overlay}>
          <StateSticker state="offline" className="w-24 sm:w-32" />
          <p className="max-w-xs text-sm text-muted-foreground">{t(ui.prints.unsupported)}</p>
        </div>
      )}
    </div>
  );
}
