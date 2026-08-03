import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { experiences, ui } from "@/data/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";
import { DuckSectionMarker } from "@/components/ui/duck-section-marker";

export default function PathSection() {
  const { t } = useLanguage();
  const scope = useRef<HTMLElement>(null);

  // The spine draws itself as the timeline scrolls past.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          ".path-spine",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".path-list",
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          }
        );
        return () => tween.kill();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".path-spine", { scaleY: 1 });
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} id="path" className="group/section section-container section-spacing">
      {/* Reveal has to stay the outer element: it needs a ref, and it
          staggers the parts of the marker rather than the marker itself. */}
      <Reveal selector="[data-slot='duck-section-marker'] > *" stagger={0.06}>
        <DuckSectionMarker index="04" className="border-b border-border pb-6">
          {t(ui.path.label)}
        </DuckSectionMarker>
      </Reveal>

      <SplitReveal as="h2" text={t(ui.path.title)} className="display-lg mt-12" />

      <div className="path-list relative mt-20 pl-10 md:pl-16">
        <div className="absolute bottom-0 left-0 top-0 w-px bg-border" aria-hidden />
        <div
          className="path-spine absolute bottom-0 left-0 top-0 w-px origin-top bg-primary"
          aria-hidden
        />

        <Reveal as="ol" selector=".path-item" stagger={0.14}>
          {experiences.map((job, i) => (
            <li key={job.company} className="path-item group relative pb-16 last:pb-0">
              <span
                className="absolute -left-10 top-2 h-2 w-2 -translate-x-1/2 bg-border transition-colors duration-500 group-hover:bg-primary md:-left-16"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="hud">{job.period}</span>
                {i === 0 && (
                  <span className="hud text-primary border border-primary/40 px-2 py-0.5">
                    {t(ui.path.current)}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
                {t(job.role)}
              </h3>
              <p className="mt-1 font-mono text-sm text-primary">{job.company}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {t(job.description)}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
