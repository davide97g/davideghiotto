import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { featuredProject, ui } from "@/data/content";
import { trackOutbound } from "@/lib/analytics";
import { ArrowUpRight, Github } from "lucide-react";
import type { CSSProperties } from "react";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";

/**
 * Inside this block `--primary` is swapped for sharp's own violet, so every
 * accent utility picks up the project's brand instead of the site lime.
 *
 * A complete colour, not the `247 100% 71%` channel triple this used to be:
 * since the move to Tailwind v4 the token is consumed as `var(--primary)`
 * directly rather than wrapped in `hsl()`, so a bare triple is an invalid
 * value. It fails silently — `bg-primary` computes to nothing and the button
 * renders near-black text on the near-black card.
 *
 * `--glow-primary` has to come along. It is a whole box-shadow string with the
 * accent baked in, so leaving it alone lit this card's hover states in site
 * lime while everything else in them was violet.
 */
const sharpBrand = {
  "--primary": "oklch(0.623 0.211 284)",
  "--ring": "oklch(0.623 0.211 284)",
  "--glow-primary":
    "0 0 0 1px oklch(0.623 0.211 284 / 0.5), 0 12px 40px -12px oklch(0.623 0.211 284 / 0.6)",
} as CSSProperties;

export default function FeaturedProject() {
  const { t } = useLanguage();
  const p = featuredProject;

  return (
    <article
      style={sharpBrand}
      className="panel panel-ticks relative overflow-hidden p-7 md:p-12"
    >
      {/* Brand wash, matching the landing page's violet/cyan glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "radial-gradient(circle, #7c6cff 0%, #4fd1e8 55%, transparent 72%)" }}
      />

      <Reveal className="relative flex flex-wrap items-center gap-4" stagger={0.07}>
        <img src={p.logo} alt="sharp logo" className="h-11 w-11 shrink-0" />
        <div>
          <h3 className="font-display text-3xl font-bold lowercase tracking-tight md:text-4xl">
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
            <HoloButton asChild variant="primary" size="lg" className="btn-hud text-xs font-medium">
              <a
                href={p.site}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutbound("sharp_site", p.site)}
              >
                {t(ui.work.visit)} <ArrowUpRight size={14} />
              </a>
            </HoloButton>
            <HoloButton
              asChild
              variant="outline"
              size="lg"
              className="btn-hud text-xs font-medium btn-hud-ghost"
            >
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutbound("sharp_repo", p.repo)}
              >
                <Github size={14} /> {t(ui.work.source)}
              </a>
            </HoloButton>
          </Reveal>

          <Reveal
            as="dl"
            selector=".sharp-meta"
            stagger={0.06}
            className="mt-10 grid grid-cols-3 gap-px border border-border bg-border"
          >
            <div className="sharp-meta bg-background p-4">
              <dt className="hud mb-2">Version</dt>
              <dd className="font-mono text-sm text-foreground">{p.version}</dd>
            </div>
            <div className="sharp-meta bg-background p-4">
              <dt className="hud mb-2">License</dt>
              <dd className="font-mono text-sm text-foreground">{p.license}</dd>
            </div>
            <div className="sharp-meta bg-background p-4">
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
                <HoloBadge key={item} variant="outline" className="tag rounded-none text-[11px] font-normal text-muted-foreground">
                  {item}
                </HoloBadge>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
