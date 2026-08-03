import { SocialRow } from "@/components/SocialLinks";
import { LangId, useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LINKS = [
  { id: "channel", label: ui.nav.channel },
  { id: "work", label: ui.nav.work },
  { id: "journal", label: ui.nav.journal },
  { id: "stack", label: ui.nav.stack },
  { id: "path", label: ui.nav.path },
  { id: "profile", label: ui.nav.profile },
] as const;

const LANGS: LangId[] = ["en", "it"];

export default function Nav() {
  const { lang, setLang, t } = useLanguage();
  const lenis = useLenis();
  const shell = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  // Slide the bar out of the way going down, bring it back going up.
  useGSAP(
    () => {
      const el = shell.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const show = gsap.quickTo(el, "yPercent", { duration: 0.45, ease: "power3.out" });
        let last = 0;

        const onScroll = () => {
          const y = window.scrollY;
          show(y > 120 && y > last ? -140 : 0);
          last = y;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      });

      return () => mm.revert();
    },
    { scope: shell }
  );

  const goHome = () => {
    setOpen(false);
    if (onHome) {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0 });
      return;
    }
    navigate("/");
  };

  const goTo = (id: string) => {
    setOpen(false);
    trackEvent("nav_click", { target: id });
    if (!onHome) {
      navigate(`/#${id}`);
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -40 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const changeLang = (id: LangId) => {
    if (id === lang) return;
    setLang(id);
    trackEvent("language_change", { lang: id });
  };

  return (
    <header
      ref={shell}
      className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="section-container flex h-14 items-center justify-between gap-6">
        <button
          type="button"
          onClick={goHome}
          className="hud whitespace-nowrap text-foreground"
        >
          <span className="text-primary">◢</span>{" "}
          <span className="hidden sm:inline">{bio.name}</span>
          <span className="sm:hidden">DG</span>
        </button>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              className="hud link-wipe transition-colors hover:text-foreground"
            >
              {t(link.label)}
            </button>
          ))}
          <Link
            to="/ral"
            onClick={() => {
              setOpen(false);
              trackEvent("nav_click", { target: "ral" });
            }}
            className="hud link-wipe text-primary transition-colors hover:text-foreground"
          >
            {t(ui.ral.cta)}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="lang-switch flex items-center border border-border"
            role="group"
            aria-label={t(ui.lang.label)}
          >
            {LANGS.map((id) => (
              <button
                key={id}
                onClick={() => changeLang(id)}
                aria-pressed={lang === id}
                className={`hud px-2.5 py-1.5 transition-colors ${
                  lang === id
                    ? "bg-primary text-primary-foreground"
                    : "hover:text-foreground"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="hud nav-menu-toggle border border-border px-2.5 py-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav-enter border-t border-border/60 bg-background/95 px-6 py-4 lg:hidden"
        >
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              className="mobile-nav-item hud block w-full py-3 text-left"
            >
              {t(link.label)}
            </button>
          ))}
          <Link
            to="/ral"
            onClick={() => {
              setOpen(false);
              trackEvent("nav_click", { target: "ral" });
            }}
            className="mobile-nav-item hud block w-full py-3 text-left text-primary"
          >
            {t(ui.ral.cta)}
          </Link>

          {/* The drawer is where a phone looks for "where else can I find you",
              so the links get names here rather than the hero row glyphs. */}
          <div className="mobile-nav-item mt-3 border-t border-border/60 pt-4">
            <SocialRow labels source="menu" />
          </div>
        </nav>
      )}
    </header>
  );
}
