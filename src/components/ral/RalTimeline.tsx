import Reveal from "@/components/motion/Reveal";
import CompanyLogo from "@/components/ral/CompanyLogo";
import RevealRalButton from "@/components/ral/RevealRalButton";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { formatRalMonth, ralCompanies, type RalBump } from "@/data/ral";

interface RalTimelineProps {
  unlocked: boolean;
  bumps: RalBump[];
  onReveal: () => void;
}

export default function RalTimeline({ unlocked, bumps, onReveal }: RalTimelineProps) {
  const { lang, t } = useLanguage();

  return (
    <section className="mt-24">
      <Reveal className="section-marker" stagger={0.06}>
        <span className="hud hud-accent">02</span>
        <span className="hud">{t(ui.ral.timeline.label)}</span>
      </Reveal>

      <h2 className="display-lg mt-10">{t(ui.ral.timeline.title)}</h2>
      <p className="mt-5 max-w-2xl text-muted-foreground">{t(ui.ral.timeline.lead)}</p>

      {!unlocked && (
        <div className="mt-6">
          <RevealRalButton onClick={onReveal} size="compact" />
        </div>
      )}

      <ol className="relative mt-14 space-y-0 pl-12 md:pl-16">
        <div className="absolute bottom-0 left-0 top-0 w-px bg-border" aria-hidden />

        {ralCompanies.map((company) => {
          const companyBumps = bumps.filter((b) => b.companyId === company.id);
          const isCurrent = company.to === null;

          return (
            <li key={company.id} className="relative pb-14 last:pb-0">
              <span
                className="absolute -left-12 top-1 -translate-x-1/2 md:-left-16"
                aria-hidden
              >
                <CompanyLogo company={company} size="sm" />
              </span>
              <div
                className="absolute bottom-0 left-0 top-2 w-px origin-top"
                style={{
                  background: `linear-gradient(${company.color}, transparent)`,
                  opacity: 0.45,
                }}
                aria-hidden
              />

              <div className="flex flex-wrap items-center gap-3">
                <span className="hud" style={{ color: company.color }}>
                  {company.name}
                </span>
                <span className="hud text-muted-foreground">
                  {formatRalMonth(`${company.displayFrom ?? company.from}-01`, lang)}
                  {" — "}
                  {(company.displayTo ?? company.to)
                    ? formatRalMonth(
                        `${(company.displayTo ?? company.to) as string}-01`,
                        lang
                      )
                    : t(ui.ral.timeline.present)}
                </span>
                {isCurrent && (
                  <span className="hud hud-accent border border-primary/40 px-2 py-0.5">
                    {t(ui.path.current)}
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
                {t(company.role)}
              </h3>

              <ul className="mt-5 space-y-2">
                {companyBumps.map((bump) => {
                  const index = bumps.indexOf(bump);
                  const prev = bumps[index - 1];
                  const delta =
                    unlocked &&
                    typeof bump.amount === "number" &&
                    prev &&
                    typeof prev.amount === "number"
                      ? bump.amount - prev.amount
                      : null;
                  return (
                    <li
                      key={bump.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border/70 bg-surface/40 px-3 py-2"
                    >
                      <span className="hud text-muted-foreground">
                        {formatRalMonth(bump.date, lang)}
                      </span>
                      <span className="font-mono text-sm text-foreground">
                        {unlocked && typeof bump.amount === "number" ? (
                          new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-US", {
                            style: "currency",
                            currency: "EUR",
                            maximumFractionDigits: 0,
                          }).format(bump.amount)
                        ) : (
                          <span className="tracking-[0.2em] text-muted-foreground">
                            € ·····
                          </span>
                        )}
                      </span>
                      {delta != null && delta > 0 && (
                        <span className="hud hud-accent">
                          +
                          {new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-US", {
                            style: "currency",
                            currency: "EUR",
                            maximumFractionDigits: 0,
                          }).format(delta)}
                        </span>
                      )}
                      {bump.note && (
                        <span className="text-xs text-muted-foreground">{t(bump.note)}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
