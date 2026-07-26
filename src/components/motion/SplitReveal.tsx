import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { ElementType, useRef } from "react";

type Props = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** Fire immediately on mount instead of waiting for the scroll position. */
  immediate?: boolean;
};

/**
 * Masked line-by-line reveal. Lines are split with SplitText and slid up from
 * behind their own mask, so the text appears to rise out of the page.
 *
 * `autoSplit` re-splits on resize and font swaps; the tween is created inside
 * `onSplit` so it is rebuilt against the new lines each time.
 */
export default function SplitReveal({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit: (self) =>
            // fromTo so a ScrollTrigger.refresh() can't leave lines parked
            // below their mask.
            gsap.fromTo(
              self.lines,
              { yPercent: 115, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                delay,
                stagger,
                ease: "expo.out",
                scrollTrigger: immediate
                  ? undefined
                  : { trigger: el, start: "top 88%", once: true },
              }
            ),
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, immediate] }
  );

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
