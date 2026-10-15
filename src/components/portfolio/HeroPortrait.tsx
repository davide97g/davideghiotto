/**
 * Hero poster: the "Hi, I'm Davide" cover of the Instagram presentation
 * carousel (Contexto content 01a13e88-4815-7131-874e-a2d698916847, slide
 * 01-intro), shown whole, its own type included, as a sticker.
 *
 * On mobile it sits above the headline as a normal block; from `lg` up it is
 * absolutely placed in the right column, clear of the display type. It used to
 * be a cut-out the headline crossed, dimmed behind it; a slide carries its own
 * headline, so it is neither dimmed nor overlapped.
 */
export default function HeroPortrait() {
  return (
    // The placement lives on this wrapper, not on .hero-portrait: GSAP owns that
    // element's transform (the intro and the scroll drift) and resets the CSS
    // translate property, which silently dropped a translate-y centring.
    <div className="pointer-events-none relative lg:absolute lg:inset-y-0 lg:right-[max(4.5rem,calc((100vw-82rem)/2+2.5rem))] lg:flex lg:items-center lg:pt-16">
      <div className="hero-portrait relative mx-auto w-[72%] max-w-xs lg:mx-0 lg:w-[min(28vw,24rem)] lg:max-w-none">
      {/* Inner plane for the pointer parallax: the outer element already
          carries the intro and the scroll drift. */}
      <div className="hero-portrait-inner relative">
        {/* Lime glow behind the card, so its edge reads against the backdrop. */}
        <div aria-hidden className="absolute inset-[8%] rounded-full bg-primary/20 blur-3xl" />

        <div className="sticker relative rotate-[2.5deg] overflow-hidden rounded-2xl border-foreground bg-card shadow-[0_30px_60px_-20px_oklch(0_0_0/0.7)]">
          <picture>
            <source
              type="image/avif"
              srcSet="/hero-intro-640.avif 640w, /hero-intro-1120.avif 1120w"
              sizes="(min-width: 1024px) min(28vw, 24rem), 72vw"
            />
            <img
              src="/hero-intro-800.jpg"
              width={1120}
              height={1400}
              loading="lazy"
              decoding="async"
              alt="Hi, I'm Davide. Developer and maker: I build software with AI and hardware with my hands."
              className="block h-auto w-full select-none"
            />
          </picture>
        </div>
      </div>
      </div>
    </div>
  );
}
