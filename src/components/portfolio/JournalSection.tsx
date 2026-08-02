import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import JournalPortrait from "@/components/portfolio/JournalPortrait";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { journalPlatforms, journalPosts, type JournalPlatformId } from "@/data/journal";
import { trackEvent, trackOutbound } from "@/lib/analytics";
import { ArrowUpRight, Github, Linkedin, Terminal, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyPond } from "@/components/ui/empty-pond";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";

const PLATFORM_ICON: Record<JournalPlatformId, LucideIcon> = {
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  site: Terminal,
};

const linkedin = journalPlatforms.find((p) => p.id === "linkedin") ?? journalPlatforms[0];

/**
 * Detached band, sitting between Work (02) and Stack (03): a full-bleed strip on a
 * raised surface with no section number, so the numbered sections still read
 * 01 → 05. Lists the journal posts (each a route under `/journal/:slug`) and the
 * platforms they are cross-posted on.
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
          <span className="hud text-primary">◢</span>
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

            {journalPosts.length === 0 ? (
              <Reveal>
                {/* EmptyPond ships a duck at rest as its artwork. There is no
                    mascot on this site, so `art` carries the same ◢ the band
                    uses instead of a section number — the frame, the ripples
                    and the copy hierarchy are the parts worth keeping. */}
                <EmptyPond
                  className="cut-line items-start p-8 text-left"
                  art={
                    <span className="hud text-3xl text-primary" aria-hidden>
                      ◢
                    </span>
                  }
                  title={t(ui.journal.latest)}
                  hint={t(ui.journal.empty)}
                  action={
                    <HoloButton
                      asChild
                      variant="primary"
                      size="lg"
                      className="btn-hud text-xs font-medium mt-2"
                    >
                      <a
                        href={linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackOutbound("journal_empty_linkedin", linkedin.url)
                        }
                      >
                        {t(ui.journal.readOn)} {linkedin.name}{" "}
                        <ArrowUpRight size={14} />
                      </a>
                    </HoloButton>
                  }
                />
              </Reveal>
            ) : (
              <Reveal
                as="ol"
                selector=".journal-entry"
                stagger={0.1}
                className="border-t border-border"
              >
                {journalPosts.map((post) => (
                  <li key={post.slug} className="journal-entry micro-row border-b border-border">
                    <Link
                      to={`/journal/${post.slug}`}
                      className="group block py-7"
                      onClick={() => trackEvent("journal_open", { slug: post.slug })}
                    >
                      <span className="hud">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </span>

                      <h4 className="mt-3 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-2xl">
                        {t(post.title)}
                      </h4>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {t(post.excerpt)}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        {post.tags.map((tag) => (
                          <HoloBadge key={tag} variant="outline" className="tag rounded-none text-[11px] font-normal text-muted-foreground">
                            {tag}
                          </HoloBadge>
                        ))}
                        <span className="hud ml-auto flex items-center gap-2 transition-colors group-hover:text-primary">
                          {t(ui.journal.read)}
                          <ArrowUpRight
                            size={14}
                            className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
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
                  <li key={platform.id} className="journal-platform micro-row">
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5"
                      onClick={() =>
                        trackOutbound(`journal_platform_${platform.id}`, platform.url)
                      }
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
