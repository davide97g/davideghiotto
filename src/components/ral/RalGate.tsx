import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import {
  isRalApiConfigured,
  requestRalOtp,
  verifyRalOtp,
  type RalAccess,
  type RalGateError,
} from "@/lib/ralAccess";
import { GlowInput } from "@/components/ui/glow-input";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import {
  StickerDialog,
  StickerDialogContent,
  StickerDialogDescription,
  StickerDialogHeader,
  StickerDialogTitle,
} from "@/components/ui/sticker-dialog";
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck, Unlock } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface RalGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked: (access: RalAccess) => void;
}

type Step = "email" | "code";

/** A gate error plus, for `rate_limit`, how long the caller has to wait. */
type GateFailure = { error: RalGateError; retryAfterMinutes?: number };

/**
 * Two-step OTP gate: request code → verify. Fail-closed against the ral-gate API.
 */
export default function RalGate({ open, onOpenChange, onUnlocked }: RalGateProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<GateFailure | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const apiReady = isRalApiConfigured();

  useEffect(() => {
    if (!open) return;
    setFailure(null);
    const id = window.setTimeout(() => {
      if (step === "email") emailRef.current?.focus();
      else codeRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(id);
  }, [open, step]);

  useEffect(() => {
    if (!open) {
      setStep("email");
      setCode("");
      setDevCode(null);
      setFailure(null);
      setPending(false);
    }
  }, [open]);

  const requestCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiReady) {
      setFailure({ error: "unavailable" });
      trackEvent("ral_unlock_fail", { step: "request" });
      return;
    }
    setPending(true);
    setFailure(null);
    trackEvent("ral_unlock_request", { step: "email" });
    const result = await requestRalOtp(email);
    setPending(false);
    // `=== false` narrows the union; `!result.ok` does not, with strictNullChecks off.
    if (result.ok === false) {
      setFailure({ error: result.error, retryAfterMinutes: result.retryAfterMinutes });
      trackEvent("ral_unlock_fail", { step: "request" });
      return;
    }
    setDevCode(result.devCode ?? null);
    setStep("code");
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setFailure(null);
    const result = await verifyRalOtp(email, code);
    setPending(false);
    if (result.ok === false) {
      setFailure({ error: result.error, retryAfterMinutes: result.retryAfterMinutes });
      trackEvent("ral_unlock_fail", { step: "verify" });
      return;
    }
    trackEvent("ral_unlock_success", { step: "verify" });
    onUnlocked(result.access);
    onOpenChange(false);
  };

  const errorCopy = ({ error: err, retryAfterMinutes }: GateFailure) => {
    const map = ui.ral.gate.errors;
    switch (err) {
      case "invalid":
        return t(map.invalid);
      case "disposable":
        return t(map.disposable);
      case "network":
        return t(map.network);
      case "rate_limit":
        // Quote the real wait when the service reports one, so nobody has to guess.
        return retryAfterMinutes
          ? t(map.rateLimitIn).replace("{minutes}", String(retryAfterMinutes))
          : t(map.rateLimit);
      case "mail":
        return t(map.mail);
      case "code":
        return t(map.code);
      case "expired":
        return t(map.expired);
      case "locked":
        return t(map.locked);
      case "auth":
        return t(map.auth);
      case "unavailable":
        return t(map.unavailable);
      default: {
        const _exhaustive: never = err;
        return _exhaustive;
      }
    }
  };

  return (
    <StickerDialog open={open} onOpenChange={onOpenChange}>
      <StickerDialogContent className="max-w-lg gap-0 bg-surface p-0">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%)",
            }}
            aria-hidden
          />

          <StickerDialogHeader className="relative gap-3 text-left">
            <p className="hud text-primary inline-flex items-center gap-2">
              <Lock size={12} /> {t(ui.ral.gate.eyebrow)}
            </p>
            <StickerDialogTitle className="text-2xl md:text-3xl">
              {step === "email" ? t(ui.ral.gate.title) : t(ui.ral.gate.codeTitle)}
            </StickerDialogTitle>
            <StickerDialogDescription className="max-w-xl md:text-base">
              {step === "email" ? t(ui.ral.gate.lead) : t(ui.ral.gate.codeLead)}
            </StickerDialogDescription>
            <HoloBadge
              variant="outline"
              className="hud rounded-none border-primary/40 bg-primary/5 px-2.5 py-1 text-primary"
            >
              {apiReady ? t(ui.ral.gate.badge) : t(ui.ral.gate.badgeOffline)}
            </HoloBadge>
          </StickerDialogHeader>

          {!apiReady && (
            <p className="relative mt-6 text-sm text-destructive" role="alert">
              {t(ui.ral.gate.errors.unavailable)}
            </p>
          )}

          {step === "email" ? (
            <form
              onSubmit={requestCode}
              className="relative mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <label className="sr-only" htmlFor="ral-email">
                {t(ui.ral.gate.emailLabel)}
              </label>
              <div className="relative flex-1">
                <Mail
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <GlowInput
                  ref={emailRef}
                  id="ral-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={!apiReady}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(ui.ral.gate.placeholder)}
                  className="h-12 border-border bg-background/80 pr-3 pl-9 font-mono placeholder:text-muted-foreground/70"
                />
              </div>
              <HoloButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={pending || !apiReady}
                className="disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> {t(ui.ral.gate.pending)}
                  </>
                ) : (
                  <>
                    <Unlock size={14} /> {t(ui.ral.gate.submit)}
                  </>
                )}
              </HoloButton>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="relative mt-8 space-y-4">
              <p className="hud text-muted-foreground">
                {t(ui.ral.gate.sentTo)} <span className="text-foreground">{email}</span>
              </p>
              {devCode && (
                <p className="border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-sm text-primary">
                  {t(ui.ral.gate.devCode)}: {devCode}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="ral-code">
                  {t(ui.ral.gate.codeLabel)}
                </label>
                <GlowInput
                  ref={codeRef}
                  id="ral-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="••••••"
                  className="h-12 flex-1 border-border bg-background/80 px-3 text-center font-mono text-lg tracking-[0.4em]"
                />
                <HoloButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={pending}
                  className="disabled:opacity-60"
                >
                  {pending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> {t(ui.ral.gate.pending)}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} /> {t(ui.ral.gate.verify)}
                    </>
                  )}
                </HoloButton>
              </div>
              <button
                type="button"
                className="hud inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setDevCode(null);
                  setFailure(null);
                }}
              >
                <ArrowLeft size={12} /> {t(ui.ral.gate.back)}
              </button>
            </form>
          )}

          {failure && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {errorCopy(failure)}
            </p>
          )}

          <p className="mt-5 hud text-muted-foreground">{t(ui.ral.gate.footnote)}</p>
        </div>
      </StickerDialogContent>
    </StickerDialog>
  );
}
