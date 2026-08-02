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
          opacity: 1,
          scale: 1,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

        intro
          .from(".hero-eyebrow", { opacity: 0, duration: 0.8 })
          .from(
            ".hero-line-inner",
            { yPercent: 118, duration: 1.25, stagger: 0.09 },
            0.1
          )
          .from(".hero-fade", { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.75);

        intro.fromTo(
          ".hero-portrait",
          { opacity: 0, scale: 1.06, yPercent: 4 },
          { opacity: 1, scale: 1, yPercent: 0, duration: 1.6, ease: "expo.out" },
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
            immediate
            delay={0.85}
            text={t(ui.hero.lead)}
            className="hero-lead max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          />

          <div className="hero-fade flex flex-wrap gap-3">
            <HoloButton asChild variant="primary" size="lg" className="btn-hud text-xs font-medium">
              <a
                href="#work"
                onClick={() => trackEvent("cta_click", { cta_id: "work" })}
              >
                {t(ui.hero.ctaPrimary)} <ArrowDown size={14} />
              </a>
            </HoloButton>
            <HoloButton
              asChild
              variant="outline"
              size="lg"
              className="btn-hud text-xs font-medium btn-hud-ghost"
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
      <div className="section-container relative z-10 mt-14 w-full lg:mt-8">
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
      </div>
    </section>
  );
}
