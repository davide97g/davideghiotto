/**
 * Cut-out portrait for the hero.
 *
 * On mobile it sits above the headline as a normal block; from `lg` up it is
 * absolutely positioned and bleeds off the bottom-right corner so the display
 * type can cross it. Behind the type it is desaturated and dimmed, with a
 * left-to-right scrim, so white and lime text stay legible over the sweatshirt.
 */
export default function HeroPortrait() {
  return (
    <div
      className="hero-portrait pointer-events-none relative mx-auto w-[72%] max-w-xs lg:absolute lg:bottom-0 lg:right-[-2vw] lg:mx-0 lg:w-[46vw] lg:max-w-[700px]"
      aria-hidden={false}
    >
      {/* Lime rim glow, so the cut-out edge reads against the near-black page. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[18%] h-[62%] w-[78%] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl lg:bg-primary/20"
      />

      <picture>
        <source
          type="image/avif"
          srcSet="/davide-900.avif 900w, /davide-1600.avif 1600w"
          sizes="(min-width: 1024px) 56vw, 72vw"
        />
        <img
          src="/davide-900.png"
          width={1600}
          height={1376}
          alt="Davide Ghiotto, wearing headphones, hands steepled"
          className="relative w-full select-none [mask-image:linear-gradient(to_top,transparent_0%,black_16%)] grayscale-[0.3] lg:brightness-[0.72] lg:contrast-[1.05] lg:grayscale-[0.8]"
        />
      </picture>

      {/* Desktop only: fades the portrait into the page from the left, under the
          headline that overlaps it. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-gradient-to-r from-background via-background/45 to-transparent lg:block"
      />
    </div>
  );
}
