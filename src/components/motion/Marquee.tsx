import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { scrollSignal } from "@/lib/scrollSignal";
import { ReactNode, useRef } from "react";

type Props = {
  items: ReactNode[];
  /** Seconds for one full pass. */
  duration?: number;
  direction?: "left" | "right";
  className?: string;
  itemClassName?: string;
  separator?: string;
};

/**
 * Seamless marquee: the item list is rendered twice and both tracks are tweened
 * by one track-width, so the loop has no visible seam. Scroll velocity boosts
 * the timescale, which makes the strip feel physically coupled to the page.
 */
export default function Marquee({
  items,
  duration = 34,
  direction = "left",
  className = "",
  itemClassName = "",
  separator = "✳",
}: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track", scope.current);
      if (!tracks.length) return;

      const tween = gsap.fromTo(
        tracks,
        { xPercent: direction === "left" ? 0 : -100 },
        {
          xPercent: direction === "left" ? -100 : 0,
          duration,
          ease: "none",
          repeat: -1,
        }
      );

      const boost = () => {
        const extra = gsap.utils.clamp(0, 4, Math.abs(scrollSignal.velocity) / 9);
        tween.timeScale(1 + extra);
      };
      gsap.ticker.add(boost);

      return () => {
        gsap.ticker.remove(boost);
        tween.kill();
      };
    },
    { scope, dependencies: [duration, direction] }
  );

  const track = (key: string) => (
    <div className="marquee-track" key={key} aria-hidden={key === "b"}>
      {items.map((item, i) => (
        <span key={i} className={`flex items-center gap-10 ${itemClassName}`}>
          {item}
          <span className="opacity-40">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={scope} className={`marquee-strip ${className}`}>
      {track("a")}
      {track("b")}
    </div>
  );
}
