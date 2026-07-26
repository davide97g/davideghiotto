import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import { channel } from "@/data/youtube";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { ArrowDown, Play } from "lucide-react";
import { useRef } from "react";

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
        gsap.set(".hero-line-inner, .hero-fade", { yPercent: 0, opacity: 1 });
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
      className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32"
    >
      <div className="section-container hero-drift w-full">
        <p className="hero-eyebrow hud mb-10">{t(ui.hero.eyebrow)}</p>

        <h1 className="display-xl uppercase">
          {lines.map((line, i) => (
            <span key={line} className="line-mask">
              <span className={`hero-line-inner block ${i === lines.length - 1 ? "text-accent-glow" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-14 grid gap-12 border-t border-border pt-10 md:grid-cols-[1.3fr_1fr] md:items-start">
          <SplitReveal
            immediate
            delay={0.85}
            text={t(ui.hero.lead)}
            className="hero-lead max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          />

          <div className="flex flex-col gap-8">
            <div className="hero-fade flex flex-wrap gap-3">
              <a href="#work" className="btn-primary">
                {t(ui.hero.ctaPrimary)} <ArrowDown size={14} />
              </a>
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Play size={13} /> {t(ui.hero.ctaSecondary)}
              </a>
            </div>

            <dl className="hero-fade grid grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="hud mb-2">{t(ui.nav.profile)}</dt>
                <dd className="font-mono text-foreground">{t(bio.role)}</dd>
              </div>
              <div>
                <dt className="hud mb-2">{t(ui.channel.label)}</dt>
                <dd className="font-mono text-foreground">{channel.handle}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          const target = document.getElementById("channel");
          if (target && lenis) lenis.scrollTo(target, { offset: -40 });
          else target?.scrollIntoView({ behavior: "smooth" });
        }}
        className="hero-fade section-container mt-16 flex items-center gap-3 text-left"
      >
        <span className="hud hud-accent animate-blink">▌</span>
        <span className="hud">{t(ui.hero.scrollCue)}</span>
      </button>
    </section>
  );
}
