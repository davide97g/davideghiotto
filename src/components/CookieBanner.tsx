import { useConsent } from "@/context/ConsentContext";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { DuckSwitch } from "@/components/ui/duck-switch";
import { HoloButton } from "@/components/ui/holo-button";
import { StickerCard } from "@/components/ui/sticker-card";
import {
  StickerDialog,
  StickerDialogContent,
  StickerDialogDescription,
  StickerDialogFooter,
  StickerDialogHeader,
  StickerDialogTitle,
} from "@/components/ui/sticker-dialog";
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
              <p id="cookie-banner-title" className="hud text-primary">
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

            {/* Reject and Accept carry equal weight on purpose — an outline
                and a filled button of the same size, not a grey link beside a
                lime CTA. Consent that is easier to give than to refuse is not
                consent. */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <HoloButton
                variant="outline"
                size="lg"
                className="justify-center"
                onClick={rejectAll}
              >
                {t(ui.cookies.rejectAll)}
              </HoloButton>
              <HoloButton
                variant="outline"
                size="lg"
                className="justify-center"
                onClick={openPreferences}
              >
                {t(ui.cookies.customize)}
              </HoloButton>
              <HoloButton
                variant="primary"
                size="lg"
                className="justify-center"
                onClick={acceptAll}
              >
                {t(ui.cookies.acceptAll)}
              </HoloButton>
            </div>
          </div>
        </div>
      )}

      <StickerDialog
        open={preferencesOpen}
        onOpenChange={(open) => (open ? openPreferences() : closePreferences())}
      >
        <StickerDialogContent className="max-w-md bg-background">
          <StickerDialogHeader>
            <StickerDialogTitle className="text-xl">
              {t(ui.cookies.prefsTitle)}
            </StickerDialogTitle>
            <StickerDialogDescription>
              {t(ui.cookies.prefsLead)}
            </StickerDialogDescription>
          </StickerDialogHeader>

          <div className="space-y-4">
            <StickerCard className="flex-row items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="hud">{t(ui.cookies.necessaryLabel)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(ui.cookies.necessaryDesc)}
                </p>
              </div>
              {/* Locked on: strictly necessary cookies are not a choice, and a
                  switch the user can move but that does nothing is worse than
                  one that is visibly fixed. */}
              <DuckSwitch
                checked
                readOnly
                disabled
                aria-label={t(ui.cookies.necessaryLabel)}
              />
            </StickerCard>

            <StickerCard className="flex-row items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="hud">{t(ui.cookies.analyticsLabel)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(ui.cookies.analyticsDesc)}
                </p>
              </div>
              <DuckSwitch
                checked={draftAnalytics}
                onChange={(event) => setDraftAnalytics(event.target.checked)}
                aria-label={t(ui.cookies.analyticsLabel)}
              />
            </StickerCard>
          </div>

          <StickerDialogFooter>
            <HoloButton
              variant="outline"
              size="lg"
              className="justify-center"
              onClick={closePreferences}
            >
              {t(ui.cookies.cancel)}
            </HoloButton>
            <HoloButton
              variant="primary"
              size="lg"
              className="justify-center"
              onClick={() => savePreferences(draftAnalytics)}
            >
              {t(ui.cookies.save)}
            </HoloButton>
          </StickerDialogFooter>
        </StickerDialogContent>
      </StickerDialog>
    </>
  );
}
