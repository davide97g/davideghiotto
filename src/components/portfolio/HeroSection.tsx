import Magnetic from "@/components/motion/Magnetic";
import SplitReveal from "@/components/motion/SplitReveal";
import HeroPortrait from "@/components/portfolio/HeroPortrait";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { channel } from "@/data/youtube";
import { trackEvent, trackOutbound } from "@/lib/analytics";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { ArrowDown, Play, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { HoloButton } from "@/components/ui/holo-button";
import { SocialRow } from "@/components/SocialLinks";

export default function HeroSection() {
  const { t } = useLanguage();
  const lenis = useLenis();
  const scope = useRef<HTMLElement>(null);
  const lines = t(ui.hero.headline);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-line-inner, .hero-fade, .hero-portrait", {
          yPercent: 0,
          y: 0,
          opacity: 1,
          scale: 1,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The hero is the second section now, behind the manifesto, so its
        // intro waits for the reader to arrive instead of playing on load.
        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        });

        intro
          .from(".hero-eyebrow", { opacity: 0, duration: 0.6 })
          .from(
            ".hero-line-inner",
            { yPercent: 118, rotation: 4, duration: 1, stagger: 0.07 },
            0.05
          )
          .from(".hero-fade", { opacity: 0, y: 18, duration: 0.7, stagger: 0.06 }, 0.55);

        intro.fromTo(
          ".hero-portrait",
          { opacity: 0, scale: 1.06, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: "expo.out" },
          0
        );

        // The headline drifts up and dims as the next section arrives.
        gsap.to(".hero-drift", {
          yPercent: -14,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // The portrait leaves slower than the type, which reads as depth.
        gsap.to(".hero-portrait", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => intro.kill();
      });

      // Pointer depth: the portrait and the type drift apart under the cursor,
      // the portrait further, so the hero reads as two planes. x only on the
      // type, since its y belongs to the scroll drift above.
      mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const back = root.querySelector(".hero-portrait-inner");
        const front = root.querySelector(".hero-drift");
        if (!back || !front) return;

        const bx = gsap.quickTo(back, "x", { duration: 1.1, ease: "power3" });
        const by = gsap.quickTo(back, "y", { duration: 1.1, ease: "power3" });
        const fx = gsap.quickTo(front, "x", { duration: 1.1, ease: "power3" });

        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          bx(nx * -28);
          by(ny * -16);
          fx(nx * 10);
        };
        root.addEventListener("pointermove", move);
        return () => root.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope, dependencies: [lines] }
  );

  return (
    <section
      ref={scope}
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-28 lg:pb-10 lg:pt-24"
    >
      <HeroPortrait />

      <div className="section-container hero-drift relative z-10 w-full">
        <p className="hero-eyebrow hud mb-8 lg:mb-7">{t(ui.hero.eyebrow)}</p>

        <h1 className="display-xl uppercase">
          {lines.map((line, i) => (
            <span key={line} className="line-mask">
              <span className={`hero-line-inner block ${i === lines.length - 1 ? "text-accent-glow" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* From lg up the portrait occupies the right of the hero, so this block
            stays inside the left column instead of sitting on top of him. */}
        <div className="mt-12 grid gap-10 border-t border-border pt-9 md:grid-cols-[1.3fr_1fr] md:items-start lg:mt-9 lg:max-w-[56%] lg:grid-cols-1 lg:gap-7 lg:pt-7">
          <SplitReveal
            delay={0.35}
            text={t(ui.hero.lead)}
            className="hero-lead max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          />

          <div className="hero-fade flex flex-wrap gap-3">
            <Magnetic>
              <HoloButton asChild variant="primary" size="lg">
                <a
                  href="#work"
                  onClick={() => trackEvent("cta_click", { cta_id: "work" })}
                >
                  {t(ui.hero.ctaPrimary)} <ArrowDown size={14} />
                </a>
              </HoloButton>
            </Magnetic>
            <Magnetic>
            <HoloButton
              asChild
              variant="outline"
              size="lg"
            >
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("cta_click", { cta_id: "youtube" });
                  trackOutbound("hero_youtube", channel.url);
                }}
              >
                <Play size={13} /> {t(ui.hero.ctaSecondary)}
              </a>
            </HoloButton>
            </Magnetic>
            <Link
              to="/ral"
              className="btn-ral group"
              onClick={() => trackEvent("cta_click", { cta_id: "ral" })}
            >
              <span className="btn-ral-glow" aria-hidden />
              <Sparkles size={13} className="relative text-primary" />
              <span className="relative flex flex-col items-start gap-0.5 text-left">
                <span>{t(ui.ral.cta)}</span>
                <span className="text-[0.6rem] font-normal tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-primary/80">
                  {t(ui.ral.ctaHint)}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* w-full matters: section-container's auto inline margins would otherwise
          centre this flex item inside the column-flex section. */}
      <div className="section-container relative z-10 mt-14 flex w-full flex-wrap items-center justify-between gap-6 lg:mt-8">
        <button
          onClick={() => {
            const target = document.getElementById("channel");
            if (target && lenis) lenis.scrollTo(target, { offset: -40 });
            else target?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hero-fade flex items-center gap-3 text-left"
        >
          <span className="hud text-primary animate-blink">▌</span>
          <span className="hud">{t(ui.hero.scrollCue)}</span>
        </button>

        {/* Hidden once the viewport is wide enough for the left rail to carry the
            same links — two copies on one screen would be one too many. */}
        <SocialRow source="hero" className="hero-fade min-[1440px]:hidden" />
      </div>
    </section>
  );
}
