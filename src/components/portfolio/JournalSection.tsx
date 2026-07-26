import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import JournalPortrait from "@/components/portfolio/JournalPortrait";
import { useLanguage } from "@/context/LanguageContext";
import {
  journalEntries,
  journalPlatforms,
  ui,
  type JournalPlatformId,
} from "@/data/content";
import { ArrowUpRight, Github, Linkedin, Terminal, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PLATFORM_ICON: Record<JournalPlatformId, LucideIcon> = {
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  site: Terminal,
};

const linkedin = journalPlatforms.find((p) => p.id === "linkedin") ?? journalPlatforms[0];

/**
 * Detached band, sitting between Work (02) and Stack (03): a full-bleed strip on
 * a raised surface with no section number, so the numbered sections still read
 * 01 → 05. Holds the diary entries and the platforms they are published on.
 */
export default function JournalSection() {
  const { lang, t } = useLanguage();

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(iso)
    );

  return (
    <section
      id="journal"
      className="relative overflow-hidden border-y border-border bg-surface/45 py-[clamp(4.5rem,9vw,8rem)]"
    >
      {/* Faint lime wash, top-left, so the band separates from the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl"
      />

      <div className="section-container relative">
        <Reveal className="section-marker" stagger={0.06}>
          <span className="hud hud-accent">◢</span>
          <span className="hud">{t(ui.journal.label)}</span>
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <JournalPortrait />

          <div>
            <SplitReveal as="h2" text={t(ui.journal.title)} className="display-lg" />
            <Reveal className="mt-7">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t(ui.journal.lead)}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <h3 className="hud mb-6">{t(ui.journal.latest)}</h3>
            </Reveal>

            {journalEntries.length === 0 ? (
              <Reveal>
                <div className="border border-dashed border-border p-8">
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                    {t(ui.journal.empty)}
                  </p>
                  <a
                    href={linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-8"
                  >
                    {t(ui.journal.readOn)} {linkedin.name} <ArrowUpRight size={14} />
                  </a>
                </div>
              </Reveal>
            ) : (
              <Reveal
                as="ol"
                selector=".journal-entry"
                stagger={0.1}
                className="border-t border-border"
              >
                {journalEntries.map((entry) => {
                  const Icon = PLATFORM_ICON[entry.platform];
                  return (
                    <li key={entry.link} className="journal-entry border-b border-border">
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex gap-6 py-7"
                      >
                        <Icon
                          size={16}
                          className="mt-1.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="hud">
                            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                          </span>
                          <h4 className="mt-3 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-2xl">
                            {t(entry.title)}
                          </h4>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {t(entry.excerpt)}
                          </p>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="mt-1 shrink-0 text-muted-foreground transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </a>
                    </li>
                  );
                })}
              </Reveal>
            )}
          </div>

          <div>
            <Reveal>
              <h3 className="hud mb-6">{t(ui.journal.platforms)}</h3>
            </Reveal>

            <Reveal
              as="ul"
              selector=".journal-platform"
              stagger={0.08}
              className="panel divide-y divide-border"
            >
              {journalPlatforms.map((platform) => {
                const Icon = PLATFORM_ICON[platform.id];
                return (
                  <li key={platform.id} className="journal-platform">
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5"
                    >
                      <Icon size={16} className="shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <span className="font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary">
                            {platform.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {platform.handle}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
                          {t(platform.focus)}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-muted-foreground transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </a>
                  </li>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
