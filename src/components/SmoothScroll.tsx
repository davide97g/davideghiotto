import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { scrollSignal } from "@/lib/scrollSignal";
import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";

/**
 * Drives ScrollTrigger from Lenis instead of the native scroll event, and keeps
 * `scrollSignal` fed for the rAF consumers. Without this bridge ScrollTrigger and
 * Lenis fight each other and pinned sections jitter.
 */
function LenisBridge() {
  const lenis = useLenis((instance) => {
    scrollSignal.progress = instance.progress || 0;
    scrollSignal.velocity = instance.velocity || 0;
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  // Triggers are measured at mount, before webfonts swap and before the browser
  // applies a hash jump or a restored scroll position. Without these refreshes a
  // page opened at #work leaves everything above the cursor stuck at opacity 0.
  useEffect(() => {
    if (!lenis) return;

    // refresh() re-measures, update() makes ScrollTrigger re-read the current
    // scroll position — both are needed, in that order.
    const sync = () => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    };

    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      lenis.scrollTo(target, { immediate: true, offset: -40 });
    }

    // Two frames: one for Lenis to apply the jump, one to measure after it.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(sync);
    });

    document.fonts?.ready.then(sync);
    window.addEventListener("load", sync);

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.removeEventListener("load", sync);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = prefersReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.09,
        duration: 1.15,
        smoothWheel: !reduced,
        touchMultiplier: 1.4,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
