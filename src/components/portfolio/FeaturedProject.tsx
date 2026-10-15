import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { ui, type FeaturedProjectEntry } from "@/data/content";
import { thumbnailUrl, watchUrl } from "@/data/youtube";
import { trackEvent, trackOutbound } from "@/lib/analytics";
import { ArrowUpRight, Github, Play } from "lucide-react";
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

/**
 * One project in active development: the pitch and the spec strip on the left,
 * what is inside and what it is built with on the right, then the trailer and
 * the screenshots underneath. Work renders one per `featuredProjects` entry.
 */
export default function FeaturedProject({ project: p }: { project: FeaturedProjectEntry }) {
  const { t } = useLanguage();
  const [trailer, ...moreCuts] = p.trailers;

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
                onClick={() => trackOutbound(`featured_${p.id}_site`, p.site)}
              >
                {t(ui.work.visit)} {p.name} <ArrowUpRight size={14} />
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
                onClick={() => trackOutbound(`featured_${p.id}_repo`, p.repo)}
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
            {p.meta.map((item) => (
              <div key={item.label.en} className="featured-meta bg-background p-4">
                <dt className="hud mb-2">{t(item.label)}</dt>
                <dd
                  className={`font-mono text-sm ${item.accent ? "text-primary" : "text-foreground"}`}
                >
                  {t(item.value)}
                </dd>
              </div>
            ))}
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

      {/* The trailer, then the screenshots: the thing in motion before the stills. */}
      <Reveal
        selector=".featured-media"
        stagger={0.08}
        className="relative mt-12 grid gap-3 border-t border-border pt-8 md:grid-cols-3"
      >
        {trailer && (
          <a
            href={watchUrl(trailer.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("youtube_click", { video_id: trailer.id });
              trackOutbound(`featured_${p.id}_trailer`, watchUrl(trailer.id));
            }}
            className="featured-media group/trailer relative block aspect-video overflow-hidden rounded-xl border border-border bg-card"
            aria-label={`${t(ui.work.trailer)} — ${t(trailer.title)}`}
          >
            <img
              src={thumbnailUrl(trailer.id, "maxres")}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/trailer:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"
            />
            <span className="absolute inset-x-4 bottom-4 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-primary)] transition-transform duration-500 ease-out group-hover/trailer:scale-110">
                <Play size={15} className="translate-x-px fill-current" />
              </span>
              <span className="min-w-0">
                <span className="hud block text-primary">{t(ui.work.trailer)}</span>
                <span className="block truncate text-sm font-medium text-foreground">
                  {t(trailer.title)}
                </span>
              </span>
            </span>
          </a>
        )}

        {p.shots.map((shot) => (
          <figure
            key={shot.avif}
            className="featured-media relative aspect-video overflow-hidden rounded-xl border border-border bg-card"
          >
            <picture>
              <source type="image/avif" srcSet={shot.avif} />
              <img
                src={shot.fallback}
                alt={t(shot.alt)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </picture>
          </figure>
        ))}
      </Reveal>

      {moreCuts.length > 0 && (
        <Reveal className="relative mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="hud">{t(ui.work.alsoWatch)}</span>
          {moreCuts.map((cut) => (
            <a
              key={cut.id}
              href={watchUrl(cut.id)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutbound(`featured_${p.id}_cut_${cut.id}`, watchUrl(cut.id))}
              className="link-wipe inline-flex items-center gap-1.5 text-sm text-foreground"
            >
              <Play size={12} className="text-primary" /> {t(cut.title)}
              <ArrowUpRight size={13} className="text-muted-foreground" />
            </a>
          ))}
        </Reveal>
      )}
      </article>
    </StickerCard>
  );
}
