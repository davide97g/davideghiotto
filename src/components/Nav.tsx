import { LangId, useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";

const LINKS = [
  { id: "channel", label: ui.nav.channel },
  { id: "work", label: ui.nav.work },
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

  const goTo = (id: string) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -40 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      ref={shell}
      className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="section-container flex h-14 items-center justify-between gap-6">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0 });
          }}
          className="hud whitespace-nowrap text-foreground"
        >
          <span className="text-primary">◢</span>{" "}
          <span className="hidden sm:inline">{bio.name}</span>
          <span className="sm:hidden">DG</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              className="hud link-wipe transition-colors hover:text-foreground"
            >
              {t(link.label)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center border border-border"
            role="group"
            aria-label={t(ui.lang.label)}
          >
            {LANGS.map((id) => (
              <button
                key={id}
                onClick={() => setLang(id)}
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
            className="hud border border-border px-2.5 py-1.5 md:hidden"
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
          className="border-t border-border/60 bg-background/95 px-6 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              className="hud block w-full py-3 text-left"
            >
              {t(link.label)}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
