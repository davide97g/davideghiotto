import Nav from "@/components/Nav";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import Footer from "@/components/portfolio/Footer";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import RalChart from "@/components/ral/RalChart";
import RalGate from "@/components/ral/RalGate";
import RalTimeline from "@/components/ral/RalTimeline";
import RevealRalButton from "@/components/ral/RevealRalButton";
import { useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import {
  currentRal,
  firstRal,
  formatRal,
  ralDelta,
  ralMultiplier,
} from "@/data/ral";
import { getRalAccess, type RalAccess } from "@/lib/ralAccess";
import { ScrollTrigger } from "@/lib/gsap";
import { ArrowLeft, Eye, TrendingUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * `/ral` — RAL disclosure page.
 *
 * Numbers stay redacted until a valid email unlocks them. The email gate is not
 * shown by default — "Reveal RAL" opens it on demand.
 */
export default function RalPage() {
  const { lang, t } = useLanguage();
  const lenis = useLenis();
  const [access, setAccess] = useState<RalAccess | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    setAccess(getRalAccess());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lenis]);

  useEffect(() => {
    document.title = `${t(ui.ral.title)} — ${bio.name}`;
    return () => {
      document.title = `${bio.name} — Full-Stack Engineer, Frontend Lead, AI-Native`;
    };
  }, [t, lang]);

  const unlocked = Boolean(access);
  const openGate = () => setGateOpen(true);

  return (
    <div className="grain relative min-h-screen">
      <ShaderBackdrop />
      <Nav />

      <main className="section-container relative z-10 pb-24 pt-28 md:pt-32">
        <Link to="/" className="btn-ghost">
          <ArrowLeft size={14} /> {t(ui.ral.back)}
        </Link>

        <Reveal className="section-marker mt-12" stagger={0.06}>
          <span className="hud hud-accent">RAL</span>
          <span className="hud">{t(ui.ral.label)}</span>
        </Reveal>

        <SplitReveal as="h1" text={t(ui.ral.title)} className="display-lg mt-10" />

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t(ui.ral.lead)}
        </p>

        {hydrated && !unlocked && (
          <div className="mt-8">
            <RevealRalButton onClick={openGate} />
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat
            label={t(ui.ral.stats.current)}
            value={
              unlocked ? (
                formatRal(currentRal.amount, lang)
              ) : (
                <span className="tracking-[0.18em] text-muted-foreground">€ ·····</span>
              )
            }
            accent
          />
          <Stat
            label={t(ui.ral.stats.growth)}
            value={
              unlocked ? (
                `+${formatRal(ralDelta, lang)}`
              ) : (
                <span className="tracking-[0.18em] text-muted-foreground">+€ ·····</span>
              )
            }
          />
          <Stat
            label={t(ui.ral.stats.multiple)}
            value={
              unlocked ? (
                `${ralMultiplier.toFixed(1)}×`
              ) : (
                <span className="tracking-[0.18em] text-muted-foreground">·.·×</span>
              )
            }
            hint={
              unlocked
                ? `${formatRal(firstRal.amount, lang)} → ${formatRal(currentRal.amount, lang)}`
                : t(ui.ral.lockedHint)
            }
          />
        </div>

        {unlocked && access && (
          <div className="mt-10 flex flex-wrap items-center gap-3 border border-primary/35 bg-primary/5 px-4 py-3">
            <Eye size={14} className="text-primary" />
            <p className="hud text-primary">{t(ui.ral.unlocked)}</p>
            <span className="hud text-muted-foreground">{access.email}</span>
          </div>
        )}

        <section className="mt-20">
          <Reveal className="section-marker" stagger={0.06}>
            <span className="hud hud-accent">01</span>
            <span className="hud">{t(ui.ral.chartLabel)}</span>
          </Reveal>
          <h2 className="mt-8 flex items-center gap-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            <TrendingUp size={28} className="text-primary" />
            {t(ui.ral.chartTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t(ui.ral.chartLead)}</p>

          <div className="mt-10">
            <RalChart unlocked={unlocked} onReveal={openGate} />
          </div>
        </section>

        <RalTimeline unlocked={unlocked} onReveal={openGate} />
      </main>

      <RalGate open={gateOpen} onOpenChange={setGateOpen} onUnlocked={setAccess} />

      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="panel p-5">
      <p className="hud text-muted-foreground">{label}</p>
      <p
        className={`mt-3 font-display text-3xl font-bold tracking-tight ${
          accent ? "text-accent-glow" : ""
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
