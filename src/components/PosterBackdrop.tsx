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
 *
 * Contrast: the manifesto shows the poster as it is. Past it, the lime
 * lettering (the same lime as the site accent) would fight every line of body
 * copy, so a veil in the canvas colour shades it in two steps: lightly as the
 * hero arrives, deeply as the channel arrives, and holds there. It is an
 * opacity fade, not motion, so it runs under reduced motion too. `refreshPriority: -1` measures it after the
 * manifesto pin, which is created later but sits above the hero.
 */
export default function PosterBackdrop() {
  const plane = useRef<HTMLDivElement>(null);
  const veilHero = useRef<HTMLDivElement>(null);
  const veilChannel = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = plane.current;
    if (!el) return;

    // Two stacked veils, one per step, so the two scrubs never write the
    // same element. 0.7 then 0.833 on top of it compounds to 0.95.
    const shade = (veil: HTMLDivElement | null, id: string, to: number) => {
      const trigger = document.getElementById(id);
      if (!veil || !trigger) return;
      gsap.fromTo(
        veil,
        { opacity: 0 },
        {
          opacity: to,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "top 35%",
            scrub: true,
            refreshPriority: -1,
          },
        }
      );
    };
    shade(veilHero.current, "hero", 0.7);
    shade(veilChannel.current, "channel", 0.833);

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
      <div ref={veilHero} className="pointer-events-none absolute inset-0 bg-background opacity-0" />
      <div ref={veilChannel} className="pointer-events-none absolute inset-0 bg-background opacity-0" />
    </div>
  );
}
