import { useConsent } from "@/context/ConsentContext";
import { useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import { HoloBadge } from "@/components/ui/holo-badge";
import { trackOutbound } from "@/lib/analytics";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useLanguage();
  const { openPreferences } = useConsent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="section-container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="hud">
            © {year} {bio.name} — {t(ui.footer.rights)}
          </p>
          <a
            href={bio.workshop}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound("workshop", bio.workshop)}
            className="hud link-wipe text-primary self-start"
          >
            {t(ui.footer.workshop)} ↗ dacoder.it
          </a>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <Link to="/privacy" className="hud link-wipe">
              {t(ui.footer.privacy)}
            </Link>
            <Link to="/cookies" className="hud link-wipe">
              {t(ui.footer.cookies)}
            </Link>
            <button
              type="button"
              onClick={openPreferences}
              className="hud link-wipe text-left"
            >
              {t(ui.footer.manageCookies)}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <p className="hud">{t(ui.footer.built)}</p>
          <a
            href={bio.duckUi}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound("duck-ui", bio.duckUi)}
            className="self-start md:self-end"
          >
            <HoloBadge>{t(ui.footer.duckUi)} duck/ui ↗</HoloBadge>
          </a>
        </div>
      </div>
    </footer>
  );
}
