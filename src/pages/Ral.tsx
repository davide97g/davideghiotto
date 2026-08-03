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
import { HoloButton } from "@/components/ui/holo-button";
import { DuckSectionMarker } from "@/components/ui/duck-section-marker";
import { StickerCard } from "@/components/ui/sticker-card";

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
      // Absolute expiresAt in localStorage → correct remaining time even before the API answers.
      if (!cancelled) {
        setAccess(stored);
        setSecondsLeft(unlockSecondsLeft(stored));
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
        setSecondsLeft(0);
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live countdown from absolute expiresAt — re-sync on tab focus so background
  // throttling never leaves a stale clock after the user comes back.
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
    const onResume = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("focus", onResume);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onResume);
      window.removeEventListener("focus", onResume);
    };
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
    <div className="relative min-h-screen">
      <div className="grain" aria-hidden />
      <ShaderBackdrop />
      <Nav />

      <main className="section-container relative z-10 pb-24 pt-28 md:pt-32">
        <HoloButton
          asChild
          variant="outline"
          size="lg"
        >
          <Link to="/">
            <ArrowLeft size={14} /> {t(ui.ral.back)}
          </Link>
        </HoloButton>

        {/* Reveal has to stay the outer element: it needs a ref, and it
            staggers the parts of the marker rather than the marker itself. */}
        <Reveal selector="[data-slot='duck-section-marker'] > *" stagger={0.06} className="mt-12">
          <DuckSectionMarker index="RAL" className="border-b border-border pb-6">
            {t(ui.ral.label)}
          </DuckSectionMarker>
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
          <div
            className={`mt-10 grid overflow-hidden border sm:grid-cols-[minmax(0,1fr)_auto] ${
              secondsLeft <= 300
                ? "border-primary bg-primary/15"
                : "border-primary/50 bg-primary/10"
            }`}
            role="status"
            aria-live="polite"
            aria-label={`${t(ui.ral.expiresIn)} ${formatUnlockCountdown(secondsLeft)}`}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
              <Eye size={16} className="shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="hud text-primary">{t(ui.ral.unlocked)}</p>
                <p className="mt-1 truncate font-mono text-sm text-foreground sm:text-base">
                  {access.email}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-4 border-t border-primary/35 px-4 py-4 sm:border-l sm:border-t-0 sm:px-6 ${
                secondsLeft <= 300 ? "bg-primary/20" : "bg-primary/15"
              }`}
            >
              <Timer
                size={22}
                className={`shrink-0 text-primary ${secondsLeft <= 300 ? "animate-pulse" : ""}`}
                aria-hidden
              />
              <div className="min-w-[7.5rem]">
                <p className="hud text-primary">{t(ui.ral.expiresIn)}</p>
                <p
                  className={`mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight text-accent-glow sm:text-4xl ${
                    secondsLeft <= 300 ? "animate-pulse" : ""
                  }`}
                >
                  {formatUnlockCountdown(secondsLeft)}
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="group/section mt-20">
          {/* Reveal has to stay the outer element: it needs a ref, and it
              staggers the parts of the marker rather than the marker itself. */}
          <Reveal selector="[data-slot='duck-section-marker'] > *" stagger={0.06}>
            <DuckSectionMarker index="01" className="border-b border-border pb-6">
              {t(ui.ral.chartLabel)}
            </DuckSectionMarker>
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
    <StickerCard glass className="gap-0 p-5">
      <p className="hud text-muted-foreground">{label}</p>
      <p
        className={`mt-3 font-display text-3xl font-bold tracking-tight ${
          accent ? "text-accent-glow" : ""
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </StickerCard>
  );
}
