import { useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";

export default function Footer() {
  const { t } = useLanguage();
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
            className="hud link-wipe hud-accent self-start"
          >
            {t(ui.footer.workshop)} ↗ dacoder.it
          </a>
        </div>
        <p className="hud">{t(ui.footer.built)}</p>
      </div>
    </footer>
  );
}
