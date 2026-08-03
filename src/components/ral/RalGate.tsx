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
import { GlowField, GlowFieldset, GlowInput } from "@/components/ui/glow-input";
import { HoloBadge } from "@/components/ui/holo-badge";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerOtp } from "@/components/ui/sticker-otp";
import {
  StickerDialog,
  StickerDialogContent,
  StickerDialogDescription,
  StickerDialogFooter,
  StickerDialogHeader,
  StickerDialogTitle,
} from "@/components/ui/sticker-dialog";
import { ArrowLeft, Lock, ShieldCheck, Unlock } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface RalGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked: (access: RalAccess) => void;
}

type Step = "email" | "code";

/** A gate error plus, for `rate_limit`, how long the caller has to wait. */
type GateFailure = { error: RalGateError; retryAfterMinutes?: number };

/**
 * Digits the gate service issues — `services/ral-gate` config.otpLength, whose
 * default this mirrors. Raising OTP_LENGTH there means raising this too, since
 * the strip draws one cell per digit and gates submit on a full code.
 */
const CODE_LENGTH = 6;

/**
 * Two-step OTP gate: request code → verify. Fail-closed against the ral-gate API.
 *
 * Stock duck composition throughout — GlowField owns the label, the helper and
 * the error, QuackButton owns the pending state, StickerOtp owns the code — and
 * not one colour class at any call site. The palette is the theme's job.
 */
export default function RalGate({ open, onOpenChange, onUnlocked }: RalGateProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<GateFailure | null>(null);
  const apiReady = isRalApiConfigured();

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

  /**
   * Takes the code as an argument rather than reading state: StickerOtp fires
   * `onComplete` in the same tick as its last `onValueChange`, so the state
   * holding the sixth digit has not landed yet when the auto-submit runs.
   */
  const submitCode = async (value: string) => {
    if (pending) return;
    setPending(true);
    setFailure(null);
    const result = await verifyRalOtp(email, value);
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

  // One message, in the field it belongs to — the duck form rule. An offline
  // gate is a permanent version of the same failure, so it reads the same way.
  const fieldError = !apiReady
    ? t(ui.ral.gate.errors.unavailable)
    : failure
      ? errorCopy(failure)
      : undefined;

  // Loading only. A gate failure is a field-level message — duck's error state
  // would repaint the CTA destructive and say the same thing twice, and the
  // recovery action is still "submit again", so the button stays itself.
  const buttonState = pending ? "loading" : "idle";

  return (
    <StickerDialog open={open} onOpenChange={onOpenChange}>
      <StickerDialogContent className="gap-6 p-6 md:p-8">
        <StickerDialogHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <HoloBadge variant="muted">
              <Lock /> {t(ui.ral.gate.eyebrow)}
            </HoloBadge>
            <HoloBadge variant={apiReady ? "success" : "danger"}>
              {apiReady ? t(ui.ral.gate.badge) : t(ui.ral.gate.badgeOffline)}
            </HoloBadge>
          </div>
          <StickerDialogTitle className="text-xl md:text-2xl">
            {step === "email" ? t(ui.ral.gate.title) : t(ui.ral.gate.codeTitle)}
          </StickerDialogTitle>
          <StickerDialogDescription>
            {step === "email" ? t(ui.ral.gate.lead) : t(ui.ral.gate.codeLead)}
          </StickerDialogDescription>
        </StickerDialogHeader>

        {step === "email" ? (
          <form onSubmit={requestCode} className="flex flex-col gap-6">
            <GlowField
              label={t(ui.ral.gate.emailLabel)}
              helper={t(ui.ral.gate.footnote)}
              error={fieldError}
              required
            >
              <GlowInput
                type="email"
                autoComplete="email"
                autoFocus
                disabled={!apiReady}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(ui.ral.gate.placeholder)}
              />
            </GlowField>
            <StickerDialogFooter>
              <QuackButton
                type="submit"
                size="lg"
                state={buttonState}
                loadingLabel={t(ui.ral.gate.pending)}
                disabled={pending || !apiReady}
              >
                <Unlock /> {t(ui.ral.gate.submit)}
              </QuackButton>
            </StickerDialogFooter>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitCode(code);
            }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{t(ui.ral.gate.sentTo)}</span>
              <span className="font-medium text-foreground">{email}</span>
            </div>

            {devCode && (
              <HoloBadge variant="muted" shape="tag" className="font-mono">
                {t(ui.ral.gate.devCode)}: {devCode}
              </HoloBadge>
            )}

            <GlowFieldset
              legend={t(ui.ral.gate.codeLabel)}
              helper={t(ui.ral.gate.footnote)}
              error={fieldError}
              required
            >
              <StickerOtp
                length={CODE_LENGTH}
                value={code}
                onValueChange={setCode}
                onComplete={(value) => void submitCode(value)}
                disabled={pending}
                autoFocus
              />
            </GlowFieldset>

            <StickerDialogFooter className="sm:justify-between">
              <QuackButton
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setDevCode(null);
                  setFailure(null);
                }}
              >
                <ArrowLeft /> {t(ui.ral.gate.back)}
              </QuackButton>
              <QuackButton
                type="submit"
                size="lg"
                state={buttonState}
                loadingLabel={t(ui.ral.gate.pending)}
                disabled={pending || code.length < CODE_LENGTH}
              >
                <ShieldCheck /> {t(ui.ral.gate.verify)}
              </QuackButton>
            </StickerDialogFooter>
          </form>
        )}
      </StickerDialogContent>
    </StickerDialog>
  );
}
