import { gsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";

/**
 * Second cut-out portrait — the pointing one — used inside the detached journal
 * band. The raised hand sits in the top-right of the frame, so the figure is
 * placed left of the copy and reads as pointing at the notes.
 *
 * Assets are `public/davide-point-{900,1600}.avif` with a PNG fallback, cut out
 * the same way as the hero portrait (`swift scripts/cutout.swift`).
 */
export default function JournalPortrait() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      // Reduced motion: sit still, fully placed.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { yPercent: 0, opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { yPercent: 8, opacity: 0.55 },
          {
            yPercent: -6,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="pointer-events-none relative w-[62%] max-w-[15rem] sm:max-w-[17rem] lg:ml-auto lg:w-[24vw] lg:max-w-[21rem]"
    >
      {/* Lime bloom so the cut-out edge separates from the band. */}
      <div
        aria-hidden
        className="absolute left-[46%] top-[26%] h-[58%] w-[74%] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <picture>
        <source
          type="image/avif"
          srcSet="/davide-point-900.avif 900w, /davide-point-1600.avif 1600w"
          sizes="(min-width: 1024px) 34vw, 62vw"
        />
        <img
          src="/davide-point-900.png"
          width={1260}
          height={1600}
          loading="lazy"
          decoding="async"
          alt="Davide Ghiotto pointing at the camera"
          className="relative w-full select-none [mask-image:linear-gradient(to_top,transparent_0%,black_18%)] grayscale-[0.45] contrast-[1.05] brightness-[0.88] lg:grayscale-[0.55]"
        />
      </picture>
    </div>
  );
}
