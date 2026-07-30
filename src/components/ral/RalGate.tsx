import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { requestRalAccess, type RalAccess } from "@/lib/ralAccess";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Lock, Mail, Unlock } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface RalGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked: (access: RalAccess) => void;
}

/**
 * Email unlock dialog. Opened by the "Reveal RAL" CTA — not shown until asked.
 */
export default function RalGate({ open, onOpenChange, onUnlocked }: RalGateProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<"invalid" | "network" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    const result = await requestRalAccess(email);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onUnlocked(result.access);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border bg-surface p-0 sm:rounded-sm">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)",
            }}
            aria-hidden
          />

          <DialogHeader className="relative space-y-3 text-left">
            <p className="hud hud-accent inline-flex items-center gap-2">
              <Lock size={12} /> {t(ui.ral.gate.eyebrow)}
            </p>
            <DialogTitle className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              {t(ui.ral.gate.title)}
            </DialogTitle>
            <DialogDescription className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {t(ui.ral.gate.lead)}
            </DialogDescription>
            <span className="hud w-fit border border-primary/40 bg-primary/5 px-2.5 py-1 text-primary">
              {t(ui.ral.gate.badge)}
            </span>
          </DialogHeader>

          <form
            onSubmit={submit}
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
              <input
                ref={inputRef}
                id="ral-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(ui.ral.gate.placeholder)}
                className="h-12 w-full border border-border bg-background/80 pl-9 pr-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="btn-primary disabled:opacity-60"
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
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {t(ui.ral.gate.errors[error])}
            </p>
          )}

          <p className="mt-5 hud text-muted-foreground">{t(ui.ral.gate.footnote)}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
