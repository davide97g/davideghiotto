import { gsap, useGSAP } from "@/lib/gsap";
import { ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Share of the pointer offset the child follows, 0 → 1. */
  strength?: number;
};

/**
 * Pulls its child toward the pointer while hovered and lets it settle back on
 * leave. The transform lives on this wrapper, never on the child, so a duck
 * button keeps its own hover and press transforms untouched.
 *
 * Only on a fine pointer with motion allowed; touch and reduced motion get a
 * plain inline wrapper.
 */
export default function Magnetic({ children, className = "", strength = 0.3 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
        let cx = 0;
        let cy = 0;

        // Measured once per hover, not per move: no layout read in the hot path.
        // The rect includes whatever offset is still settling, so take it back
        // out to find the resting centre.
        const enter = () => {
          const rect = el.getBoundingClientRect();
          cx = rect.left + rect.width / 2 - Number(gsap.getProperty(el, "x"));
          cy = rect.top + rect.height / 2 - Number(gsap.getProperty(el, "y"));
        };
        const move = (e: PointerEvent) => {
          xTo((e.clientX - cx) * strength);
          yTo((e.clientY - cy) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [strength] }
  );

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
