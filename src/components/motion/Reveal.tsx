import { gsap, useGSAP } from "@/lib/gsap";
import { ElementType, ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Travel distance in px. */
  y?: number;
  delay?: number;
  stagger?: number;
  /** Animate matching descendants instead of the direct children. */
  selector?: string;
  /** Viewport position that fires the reveal. */
  start?: string;
};

/**
 * Fades and lifts its children as they scroll into view. Under
 * prefers-reduced-motion the children are simply left visible.
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 28,
  delay = 0,
  stagger = 0.08,
  selector,
  start = "top 85%",
}: Props) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const targets: Element[] = selector
        ? gsap.utils.toArray(selector, root)
        : Array.from(root.children);
      if (!targets.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, { opacity: 1, y: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // fromTo, not from: a `from` tween re-rendered by ScrollTrigger.refresh()
        // can be left stranded at its start values (invisible, or offset).
        gsap.fromTo(
          targets,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay,
            stagger,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start, once: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope, dependencies: [selector, start] }
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
