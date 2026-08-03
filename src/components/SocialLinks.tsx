import { useLanguage } from "@/context/LanguageContext";
import { socials, ui, type SocialId } from "@/data/content";
import { trackOutbound } from "@/lib/analytics";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { HoloButton } from "@/components/ui/holo-button";
import { Github, Linkedin, Terminal, Youtube, type LucideIcon } from "lucide-react";
import { useRef } from "react";

const ICON: Record<SocialId, LucideIcon> = {
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  site: Terminal,
};

/**
 * Left-edge social rail: the mirror of `ScrollRail`, and the reason the same
 * links do not need to sit in the nav bar. Hairline weight on purpose — it lives
 * in the page gutter, so it stays clear of the content and the handle only
 * appears on hover.
 *
 * The 1440px floor is measured, not chosen: the content column is 82rem
 * (1312px) wide, so below ~1440 there is no gutter left to hang a rail in and it
 * would sit on top of the display type. Under that width `SocialRow` carries the
 * links instead, in the hero and the nav drawer.
 */
export function SocialRail() {
  const { t } = useLanguage();
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".social-rail-label, .social-rail-node", { opacity: 1, x: 0 });
        gsap.set(".social-rail-stem", { scaleY: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Late, and after the hero intro: the rail is chrome, not the entrance.
        const intro = gsap.timeline({ delay: 1.15, defaults: { ease: "expo.out" } });

        intro
          .from(".social-rail-label", { opacity: 0, duration: 0.7 })
          .from(".social-rail-stem", { scaleY: 0, duration: 0.8, stagger: 0.08 }, 0)
          .from(".social-rail-node", { opacity: 0, x: -10, duration: 0.7, stagger: 0.07 }, 0.2);

        return () => intro.kill();
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <nav
      ref={scope}
      aria-label={t(ui.social.label)}
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 min-[1440px]:flex"
    >
      <span className="social-rail-label hud [writing-mode:vertical-rl]">
        {t(ui.social.label)}
      </span>

      <span className="social-rail-stem h-8 w-px origin-top bg-border" aria-hidden />

      <ul className="flex flex-col items-center gap-0.5">
        {socials.map((social) => {
          const Icon = ICON[social.id];
          return (
            <li key={social.id} className="social-rail-node">
              <HoloButton
                asChild
                variant="ghost"
                size="icon"
                /* size-7 rather than the icon size: the rail sits in a 40px page
                   gutter, and a 40px button would reach into the content. Still
                   past the 24px minimum target, and this rail is pointer-only. */
                className="social-node relative size-7 text-muted-foreground hover:text-primary"
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} — ${social.handle}`}
                  onClick={() => trackOutbound(`rail_${social.id}`, social.url)}
                >
                  <Icon size={15} />
                  <span className="social-flyout hud" aria-hidden>
                    {social.name}{" "}
                    <span className="text-muted-foreground">{social.handle}</span>
                  </span>
                </a>
              </HoloButton>
            </li>
          );
        })}
      </ul>

      <span className="social-rail-stem h-8 w-px origin-top bg-border" aria-hidden />
    </nav>
  );
}

/**
 * The same links as a horizontal set, for the two places with no gutter to hang
 * the rail in: the bottom of the hero and the nav drawer. `labels` spells the
 * platform out next to the icon — on in the drawer, where a list of names reads
 * better than four glyphs, off in the hero, where the row shares a line with the
 * scroll cue.
 */
export function SocialRow({
  labels = false,
  source,
  className,
}: {
  labels?: boolean;
  /** Analytics prefix, so a hero tap and a drawer tap stay distinguishable. */
  source: string;
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t(ui.social.label)}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {socials.map((social) => {
        const Icon = ICON[social.id];
        return (
          <HoloButton
            key={social.id}
            asChild
            variant="outline"
            size={labels ? "default" : "icon"}
            /* h-11 both ways: the duck sizes land at 40px, and these are the
               touch-sized copies of the rail. */
            className={cn("h-11 text-muted-foreground hover:text-primary", !labels && "w-11")}
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels ? undefined : `${social.name} — ${social.handle}`}
              onClick={() => trackOutbound(`${source}_${social.id}`, social.url)}
            >
              <Icon size={16} />
              {labels && social.name}
            </a>
          </HoloButton>
        );
      })}
    </nav>
  );
}
