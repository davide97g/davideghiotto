import { gsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";

/**
 * Full-screen poster behind the home page, in place of the WebGL backdrop.
 * The poster is portrait, so on a landscape screen `object-cover` keeps the
 * face and the headline (upper-middle of the frame) and lets the legs go.
 * The bottom scrim fades it into the canvas so the sections below stay legible.
 *
 * Parallax: the image plane is 160% of the viewport tall and drifts up by its
 * extra 60% over the first 2400px of scroll (the manifesto and the hero), about
 * a fifth of the content speed, then holds. Spread over the whole page, which
 * runs past 18000px, the same drift would be too slow to read as motion.
 */
export default function PosterBackdrop() {
  const plane = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = plane.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Reduced motion: the poster sits still at its top.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el, { yPercent: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          yPercent: -37.5,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=2400",
            scrub: 0.6,
          },
        }
      );
    });

    return () => mm.revert();
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background" aria-hidden>
      <div ref={plane} className="absolute inset-x-0 top-0 h-[160%] will-change-transform">
        <picture>
          <source srcSet="/bg-poster-it-1952.avif" type="image/avif" />
          <img
            src="/bg-poster-it-1200.jpg"
            alt=""
            decoding="async"
            fetchPriority="high"
            className="block h-full w-full object-cover object-[50%_6%]"
          />
        </picture>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-background/35 to-background/85" />
    </div>
  );
}
