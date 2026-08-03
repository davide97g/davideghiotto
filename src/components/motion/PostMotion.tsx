import { gsap, useGSAP } from "@/lib/gsap";
import { ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  /** Rebuild after a lazy markdown body or language swap changes the DOM. */
  contentKey: string;
};

/**
 * Adds breathing room around editorial landmarks, never individual paragraphs.
 * Long-form copy remains stable while headings, quotes, tables, and dividers
 * quietly settle into view.
 */
export default function PostMotion({ children, contentKey }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const targets = gsap.utils.toArray<HTMLElement>(
        ".duck-prose h2, .duck-prose h3, .duck-prose blockquote, .duck-prose table, .duck-prose hr",
        root
      );
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => gsap.set(targets, { opacity: 1, y: 0 }));
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope, dependencies: [contentKey] }
  );

  return <div ref={scope}>{children}</div>;
}
