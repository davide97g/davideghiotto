import { gsap, useGSAP } from "@/lib/gsap";
import { scrollSignal } from "@/lib/scrollSignal";
import { useRef } from "react";

/**
 * Right-edge instrument rail: a fill bar plus a live percentage, both driven
 * from the shared scroll signal inside a single rAF callback (no re-renders).
 */
export default function ScrollRail() {
  const fill = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    let shown = -1;

    const update = () => {
      const progress = gsap.utils.clamp(0, 1, scrollSignal.progress);
      if (fill.current) gsap.set(fill.current, { scaleY: progress });

      const percent = Math.round(progress * 100);
      if (percent !== shown && readout.current) {
        readout.current.textContent = String(percent).padStart(3, "0");
        shown = percent;
      }
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  });

  return (
    <div
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      aria-hidden
    >
      <span className="hud [writing-mode:vertical-rl]">Progress</span>
      <div className="relative h-40 w-px bg-border">
        <div
          ref={fill}
          className="absolute inset-0 origin-top bg-primary"
          style={{ transform: "scaleY(0)" }}
        />
      </div>
      <span ref={readout} className="hud text-primary">
        000
      </span>
    </div>
  );
}
