import { useConsent } from "@/context/ConsentContext";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * EU/Italy cookie bar + preference dialog.
 * Accept / Reject are equally weighted; Customize opens granular analytics opt-in.
 */
export default function CookieBanner() {
  const { t } = useLanguage();
  const {
    ready,
    decided,
    analytics,
    preferencesOpen,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
    closePreferences,
  } = useConsent();
  const [draftAnalytics, setDraftAnalytics] = useState(analytics);

  useEffect(() => {
    if (preferencesOpen) setDraftAnalytics(analytics);
  }, [preferencesOpen, analytics]);

  const showBar = ready && !decided;

  return (
    <>
      {showBar && (
        <div
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          className="fixed inset-x-0 bottom-0 z-[45] border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="section-container flex flex-col gap-5 py-5 md:flex-row md:items-end md:justify-between md:gap-8 md:py-6">
            <div className="min-w-0 max-w-2xl">
              <p id="cookie-banner-title" className="hud hud-accent">
                {t(ui.cookies.bannerTitle)}
              </p>
              <p
                id="cookie-banner-desc"
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {t(ui.cookies.bannerBody)}{" "}
                <Link to="/cookies" className="link-wipe text-foreground">
                  {t(ui.cookies.cookiePolicy)}
                </Link>
                {" · "}
                <Link to="/privacy" className="link-wipe text-foreground">
                  {t(ui.cookies.privacyPolicy)}
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <button type="button" onClick={rejectAll} className="btn-ghost justify-center">
                {t(ui.cookies.rejectAll)}
              </button>
              <button
                type="button"
                onClick={openPreferences}
                className="btn-ghost justify-center"
              >
                {t(ui.cookies.customize)}
              </button>
              <button type="button" onClick={acceptAll} className="btn-primary justify-center">
                {t(ui.cookies.acceptAll)}
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={preferencesOpen}
        onOpenChange={(open) => (open ? openPreferences() : closePreferences())}
      >
        <DialogContent className="max-w-md border-border bg-background sm:rounded-none">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-tight">
              {t(ui.cookies.prefsTitle)}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {t(ui.cookies.prefsLead)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <div className="panel flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="hud">{t(ui.cookies.necessaryLabel)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(ui.cookies.necessaryDesc)}
                </p>
              </div>
              <Switch checked disabled aria-label={t(ui.cookies.necessaryLabel)} />
            </div>

            <div className="panel flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="hud">{t(ui.cookies.analyticsLabel)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(ui.cookies.analyticsDesc)}
                </p>
              </div>
              <Switch
                checked={draftAnalytics}
                onCheckedChange={setDraftAnalytics}
                aria-label={t(ui.cookies.analyticsLabel)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closePreferences} className="btn-ghost justify-center">
              {t(ui.cookies.cancel)}
            </button>
            <button
              type="button"
              onClick={() => savePreferences(draftAnalytics)}
              className="btn-primary justify-center"
            >
              {t(ui.cookies.save)}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
