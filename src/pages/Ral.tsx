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
  formatRal,
  mergeRalAmounts,
  ralBumps,
  type RalBump,
  type RalUnlockedData,
} from "@/data/ral";
import {
  clearRalAccess,
  formatUnlockCountdown,
  getRalAccess,
  loadRalSessionData,
  unlockSecondsLeft,
  type RalAccess,
} from "@/lib/ralAccess";
import { ScrollTrigger } from "@/lib/gsap";
import { ArrowLeft, Eye, Timer, TrendingUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * `/ral` — RAL disclosure page.
 *
 * Numbers stay redacted until OTP unlock against ral-gate. If the API is down
 * or misconfigured, everything remains locked (fail-closed). Unlocks expire
 * server-side; a local timer clears React state so figures disappear in-place.
 */
export default function RalPage() {
  const { lang, t } = useLanguage();
  const lenis = useLenis();
  const [access, setAccess] = useState<RalAccess | null>(null);
  const [data, setData] = useState<RalUnlockedData | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [justExpired, setJustExpired] = useState(false);

  const lockSession = (reason: "expired" | "auth" = "auth") => {
    clearRalAccess();
    setAccess(null);
    setData(null);
    setSecondsLeft(0);
    if (reason === "expired") setJustExpired(true);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = getRalAccess();
      if (!stored) {
        if (!cancelled) setHydrated(true);
        return;
      }
      const result = await loadRalSessionData();
      if (cancelled) return;
      if (result.ok) {
        setAccess(result.access);
        setData(result.data);
        setSecondsLeft(unlockSecondsLeft(result.access));
        setJustExpired(false);
      } else {
        setAccess(null);
        setData(null);
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live countdown + hard lock when expiresAt elapses (no full-page reload).
  useEffect(() => {
    if (!access?.expiresAt) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      const left = unlockSecondsLeft(access);
      setSecondsLeft(left);
      if (left <= 0) {
        clearRalAccess();
        setAccess(null);
        setData(null);
        setSecondsLeft(0);
        setJustExpired(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [access]);

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

  const unlocked = Boolean(access && data);

  const bumps: RalBump[] = useMemo(() => {
    if (!data) return ralBumps;
    return mergeRalAmounts(ralBumps, data);
  }, [data]);

  const openGate = () => setGateOpen(true);

  const onUnlocked = async (next: RalAccess) => {
    setAccess(next);
    setJustExpired(false);
    setSecondsLeft(unlockSecondsLeft(next));
    const result = await loadRalSessionData();
    if (result.ok) {
      setAccess(result.access);
      setData(result.data);
      setSecondsLeft(unlockSecondsLeft(result.access));
    } else {
      lockSession("auth");
    }
  };

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
          <div className="mt-8 space-y-3">
            {justExpired && (
              <p className="hud text-muted-foreground">{t(ui.ral.expiredBanner)}</p>
            )}
            <RevealRalButton onClick={openGate} />
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat
            label={t(ui.ral.stats.current)}
            value={
              unlocked && data ? (
                formatRal(data.current.amount, lang)
              ) : (
                <span className="tracking-[0.18em] text-muted-foreground">€ ·····</span>
              )
            }
            accent
          />
          <Stat
            label={t(ui.ral.stats.growth)}
            value={
              unlocked && data ? (
                `+${formatRal(data.delta, lang)}`
              ) : (
                <span className="tracking-[0.18em] text-muted-foreground">+€ ·····</span>
              )
            }
          />
          <Stat
            label={t(ui.ral.stats.multiple)}
            value={
              unlocked && data ? (
                `${data.multiplier.toFixed(1)}×`
              ) : (
                <span className="tracking-[0.18em] text-muted-foreground">·.·×</span>
              )
            }
            hint={
              unlocked && data
                ? `${formatRal(data.first.amount, lang)} → ${formatRal(data.current.amount, lang)}`
                : t(ui.ral.lockedHint)
            }
          />
        </div>

        {unlocked && access && (
          <div className="mt-10 flex flex-wrap items-center gap-3 border border-primary/35 bg-primary/5 px-4 py-3">
            <Eye size={14} className="text-primary" />
            <p className="hud text-primary">{t(ui.ral.unlocked)}</p>
            <span className="hud text-muted-foreground">{access.email}</span>
            <span className="ml-auto inline-flex items-center gap-2 hud text-muted-foreground">
              <Timer size={12} className="text-primary" />
              {t(ui.ral.expiresIn)}{" "}
              <span className="tabular-nums text-primary">
                {formatUnlockCountdown(secondsLeft)}
              </span>
            </span>
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
            <RalChart
              unlocked={unlocked}
              bumps={bumps}
              currentAmount={data?.current.amount ?? null}
              onReveal={openGate}
            />
          </div>
        </section>

        <RalTimeline unlocked={unlocked} bumps={bumps} onReveal={openGate} />
      </main>

      <RalGate open={gateOpen} onOpenChange={setGateOpen} onUnlocked={onUnlocked} />

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
