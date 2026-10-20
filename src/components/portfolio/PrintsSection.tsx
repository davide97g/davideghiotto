import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import ModelViewer from "@/components/prints/ModelViewer";
import { StateSticker } from "@/components/StateSticker";
import type { PrintStats } from "@/components/prints/printScene";
import { DuckSectionMarker } from "@/components/ui/duck-section-marker";
import { HudLabel } from "@/components/ui/hud-label";
import { HoloButton } from "@/components/ui/holo-button";
import { StickerCard } from "@/components/ui/sticker-card";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { filaments } from "@/data/prints";
import { trackOutbound } from "@/lib/analytics";
import { formatBytes, PRINTS_OWNER, PRINTS_TOPIC } from "@/lib/printsGithub";
import { usePrints } from "@/lib/printsLive";
import { ArrowUpRight, Download, Github } from "lucide-react";
import { useMemo, useState } from "react";

const mm = (n: number) => (n >= 100 ? Math.round(n) : Math.round(n * 10) / 10);

/**
 * 03 — the 3D prints. Projects are the GitHub repos tagged `3d-printing`,
 * discovered at runtime (`usePrints`); each one's .stl / .3mf files are its
 * parts, rendered live in `ModelViewer`. Nothing here is a screenshot.
 */
export default function PrintsSection() {
  const { lang, t } = useLanguage();
  const { projects } = usePrints();
  // Selections are keyed by repo and path, so a live refresh that reorders the
  // list does not jump the viewer to another model.
  const [repo, setRepo] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [spool, setSpool] = useState<string | null>(null);
  const [stats, setStats] = useState<PrintStats | null>(null);

  const project = projects.find((p) => p.repo === repo) ?? projects[0] ?? null;
  const model = project?.models.find((m) => m.path === path) ?? project?.models[0] ?? null;
  const color = spool ?? model?.color ?? filaments[0].hex;

  const updated = useMemo(
    () => new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" }),
    [lang]
  );

  const pickProject = (next: string) => {
    setRepo(next);
    setPath(null);
    setSpool(null);
  };
  const pickModel = (next: string) => {
    setPath(next);
    setSpool(null);
  };

  return (
    <section id="prints" className="group/section section-container section-spacing">
      {/* Reveal has to stay the outer element: it needs a ref, and it
          staggers the parts of the marker rather than the marker itself. */}
      <Reveal selector="[data-slot='duck-section-marker'] > *" stagger={0.06}>
        <DuckSectionMarker index="03" className="border-b border-border pb-6">
          {t(ui.prints.label)}
        </DuckSectionMarker>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <SplitReveal as="h2" text={t(ui.prints.title)} className="display-lg" />
        <Reveal>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {t(ui.prints.lead)}
          </p>
        </Reveal>
      </div>

      {!project || !model ? (
        <Reveal className="mt-16">
          {/* An empty print bed: the grid is the plate, the sticker is the
              only thing on it. Visitor-facing, so it says where the models
              come from rather than how to tag a repo. */}
          <StickerCard glass className="print-bed gap-0 overflow-hidden p-0">
            <div className="grid items-center gap-8 px-6 py-12 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-14 md:px-14 md:py-16">
              <StateSticker state="empty" float className="mx-auto w-44 -rotate-3 md:w-full" />
              <div className="max-w-lg text-center md:text-left">
                <HudLabel dot tone="primary">
                  {t(ui.prints.emptyLabel)}
                </HudLabel>
                <h3 className="display-md mt-5 balance">{t(ui.prints.empty)}</h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {t(ui.prints.emptyHint)}
                </p>
                <HoloButton variant="outline" asChild className="mt-8">
                  <a
                    href={`https://github.com/search?q=user%3A${PRINTS_OWNER}+topic%3A${PRINTS_TOPIC}&type=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackOutbound("prints_empty_repos", `https://github.com/${PRINTS_OWNER}`)}
                  >
                    <Github />
                    {t(ui.prints.emptyAction)}
                    <ArrowUpRight />
                  </a>
                </HoloButton>
              </div>
            </div>
          </StickerCard>
        </Reveal>
      ) : (
        <Reveal className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <StickerCard glass className="gap-0 overflow-hidden p-0">
            <div className="hud flex items-center justify-between gap-4 border-b border-border px-4 py-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                <span className="truncate">
                  {project.title} / {model.name}
                </span>
              </span>
              <span className="hidden shrink-0 sm:inline">{t(ui.prints.hint)}</span>
            </div>

            <ModelViewer model={model} color={color} onStats={setStats} />

            <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
              <div className="bg-card px-4 py-3">
                <span className="hud block">{t(ui.prints.size)}</span>
                <span className="mt-1 block font-mono text-sm tabular-nums">
                  {stats ? `${stats.size.map(mm).join(" × ")} mm` : "—"}
                </span>
              </div>
              <div className="bg-card px-4 py-3">
                <span className="hud block">{t(ui.prints.triangles)}</span>
                <span className="mt-1 block font-mono text-sm tabular-nums">
                  {stats ? stats.triangles.toLocaleString(lang) : "—"}
                </span>
              </div>
              <div className="bg-card px-4 py-3">
                <span className="hud block">{t(ui.prints.file)}</span>
                <span className="mt-1 block font-mono text-sm tabular-nums">
                  {model.format.toUpperCase()} · {formatBytes(model.size)}
                </span>
              </div>
              <div className="bg-card px-4 py-3">
                <span className="hud block">{t(ui.prints.filament)}</span>
                <div className="mt-1.5 flex items-center gap-2" role="group" aria-label={t(ui.prints.filament)}>
                  {filaments.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      title={t(f.name)}
                      aria-label={t(f.name)}
                      aria-pressed={color.toLowerCase() === f.hex.toLowerCase()}
                      onClick={() => setSpool(f.hex)}
                      className="filament-swatch"
                      style={{ background: f.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </StickerCard>

          <div className="flex flex-col gap-6">
            <div>
              <span className="hud block border-b border-border pb-3">{t(ui.prints.projects)}</span>
              <ol>
                {projects.map((p, i) => {
                  const current = p.repo === project.repo;
                  return (
                    <li key={p.repo} className="border-b border-border">
                      <button
                        type="button"
                        onClick={() => pickProject(p.repo)}
                        aria-pressed={current}
                        className="group grid w-full grid-cols-[2rem_1fr] gap-3 py-4 text-left"
                      >
                        <span className={`hud pt-1 transition-colors ${current ? "text-primary" : "group-hover:text-primary"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-xl font-semibold tracking-tight">
                            {p.title}
                          </span>
                          {p.summary && (
                            <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {t(p.summary)}
                            </span>
                          )}
                          <span className="hud mt-2 block">
                            {p.models.length} {t(ui.prints.partCount)[p.models.length === 1 ? 0 : 1]} ·{" "}
                            <time dateTime={p.pushedAt} title={t(ui.prints.updated)}>
                              {updated.format(new Date(p.pushedAt))}
                            </time>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {project.models.length > 1 && (
              <div>
                <span className="hud block pb-3">{t(ui.prints.parts)}</span>
                <div className="flex flex-wrap gap-2">
                  {project.models.map((m) => (
                    <HoloButton
                      key={m.path}
                      size="sm"
                      variant={m.path === model.path ? "primary" : "outline"}
                      aria-pressed={m.path === model.path}
                      onClick={() => pickModel(m.path)}
                    >
                      {m.name}
                    </HoloButton>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <HoloButton variant="outline" size="sm" asChild>
                <a
                  href={`${project.url}/blob/${project.branch}/${model.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutbound(`prints_repo_${project.repo}`, project.url)}
                >
                  <Github />
                  {t(ui.prints.source)}
                </a>
              </HoloButton>
              <HoloButton variant="ghost" size="sm" asChild>
                <a href={model.url} download onClick={() => trackOutbound(`prints_download_${project.repo}`, model.url)}>
                  <Download />
                  {t(ui.prints.download)}
                </a>
              </HoloButton>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
