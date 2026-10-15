import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { featuredProject, ui } from "@/data/content";
import { trackOutbound } from "@/lib/analytics";
import { ArrowUpRight, Github } from "lucide-react";
import type { CSSProperties } from "react";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import { StickerCard } from "@/components/ui/sticker-card";

/**
 * Inside this block `--primary` is swapped for the project's own accent, so
 * every accent utility picks up its brand instead of the site lime.
 *
 * It has to be a complete colour: the token is consumed as `var(--primary)`
 * directly, so a bare `247 100% 71%` channel triple is an invalid value. It
 * fails silently — `bg-primary` computes to nothing and the button renders
 * near-black text on the near-black card.
 *
 * `--glow-primary` has to come along. It is a whole box-shadow string with the
 * accent baked in, so leaving it alone lit this card's hover states in site
 * lime while everything else in them was the project's colour.
 */
const brandStyle = (c: string) =>
  ({
    "--primary": c,
    "--ring": c,
    "--glow-primary": `0 0 0 1px color-mix(in oklab, ${c} 50%, transparent), 0 12px 40px -12px color-mix(in oklab, ${c} 60%, transparent)`,
  }) as CSSProperties;

export default function FeaturedProject() {
  const { t } = useLanguage();
  const p = featuredProject;

  return (
    <StickerCard asChild glass ticks className="relative gap-0 overflow-hidden p-7 md:p-12">
      <article style={brandStyle(p.brand)}>
      {/* Brand wash, in the project accent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] opacity-[0.12] blur-3xl"
      />

      <Reveal className="relative flex flex-wrap items-center gap-4" stagger={0.07}>
        <img src={p.logo} alt={`${p.name} logo`} className="h-11 w-11 shrink-0 rounded-[22%]" />
        <div>
          <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {p.name}
          </h3>
        </div>
        <span className="hud text-primary ml-auto border border-primary/40 px-2.5 py-1">
          {t(ui.work.featuredLabel)}
        </span>
      </Reveal>

      <div className="relative mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SplitReveal
            as="h4"
            text={t(p.tagline)}
            className="font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl"
          />
          <Reveal className="mt-6">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {t(p.description)}
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap items-center gap-3">
            <HoloButton asChild variant="primary" size="lg">
              <a
                href={p.site}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutbound("featured_site", p.site)}
              >
                {t(ui.work.visit)} <ArrowUpRight size={14} />
              </a>
            </HoloButton>
            <HoloButton
              asChild
              variant="outline"
              size="lg"
            >
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutbound("featured_repo", p.repo)}
              >
                <Github size={14} /> {t(ui.work.source)}
              </a>
            </HoloButton>
          </Reveal>

          <Reveal
            as="dl"
            selector=".featured-meta"
            stagger={0.06}
            className="mt-10 grid grid-cols-3 gap-px border border-border bg-border"
          >
            <div className="featured-meta bg-background p-4">
              <dt className="hud mb-2">Version</dt>
              <dd className="font-mono text-sm text-foreground">{p.version}</dd>
            </div>
            <div className="featured-meta bg-background p-4">
              <dt className="hud mb-2">License</dt>
              <dd className="font-mono text-sm text-foreground">{p.license}</dd>
            </div>
            <div className="featured-meta bg-background p-4">
              <dt className="hud mb-2">Price</dt>
              <dd className="font-mono text-sm text-primary">{p.price}</dd>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-10">
          <Reveal>
            <h5 className="hud mb-5">{t(ui.work.featuresLabel)}</h5>
            <ul className="space-y-3 border-t border-border pt-5">
              {p.features.map((feature) => (
                <li
                  key={feature.en}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 shrink-0 font-mono text-primary">#</span>
                  {t(feature)}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h5 className="hud mb-5">{t(ui.work.stackLabel)}</h5>
            <div className="flex flex-wrap gap-2 border-t border-border pt-5">
              {p.stack.map((item) => (
                <HoloBadge key={item} variant="outline" shape="tag" className="text-muted-foreground">
                  {item}
                </HoloBadge>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      </article>
    </StickerCard>
  );
}
