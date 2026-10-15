import Reveal from "@/components/motion/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { cover, ui } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollSignal } from "@/lib/scrollSignal";
import { useLenis } from "lenis/react";
import { Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DuckSectionMarker } from "@/components/ui/duck-section-marker";
import { HoloBadge } from "@/components/ui/holo-badge";
import {
  StickerDialog,
  StickerDialogContent,
  StickerDialogDescription,
  StickerDialogHeader,
  StickerDialogTitle,
} from "@/components/ui/sticker-dialog";

/** Where the card comes to rest. Shared by every branch. */
const REST = { xPercent: 0, yPercent: 0, rotation: 4, rotationX: 0, rotationY: 0, scale: 1, opacity: 1 };

/** The card carries its own perspective, so the deal reads 3D without a preserve-3d chain. */
const DEPTH = { transformPerspective: 1200 };

/** Shards thrown off by the stamp. Fixed angles, so no layout shift between renders. */
const SHARDS = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2 + 0.3);

/**
 * Manifesto opener: the magazine cover dealt onto the page like a sticker
 * while the headline writes itself, and the last word gets struck through and
 * stamped over. The Italian poster is the page backdrop, so it is not dealt.
 *
 * Desktop with motion: the section pins and one scrubbed timeline deals the
 * card; the stage tilts under the pointer and shears with scroll velocity.
 * Mobile with motion: the same deal, scrubbed over the section without a pin.
 * Reduced motion: everything sits in its final state.
 *
 * Unnumbered like the journal band (its marker is a ✳), so the numbered
 * sections still read 01 → 05.
 */
export default function CoversSection() {
  const { lang, t } = useLanguage();
  const lenis = useLenis();
  const scope = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const lines = t(ui.covers.lines);

  // Lenis keeps wheeling the page behind a modal unless it is told to stop.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const card = q(".cover-card")[0];
      const rules = q(".covers-rule");
      const bar = q(".covers-bar")[0];

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as Record<string, boolean>;

          if (reduce) {
            gsap.set(card, { ...REST });
            gsap.set(".covers-line-inner", { yPercent: 0 });
            gsap.set(".covers-strike", { scaleX: 1 });
            gsap.set(".covers-stamp", { opacity: 1, scale: 1, rotation: -8 });
            gsap.set(".covers-struck", { opacity: 0.45 });
            gsap.set(rules, { opacity: 1 });
            gsap.set(bar, { scaleX: 1 });
            return;
          }

          // The stamp is not scrubbed: a slam that follows the scrollbar
          // frame by frame reads as a slow zoom. It plays and reverses whole.
          const stamp = gsap
            .timeline({ paused: true })
            .fromTo(
              ".covers-stamp",
              { opacity: 0, scale: 2.6, rotation: -22 },
              { opacity: 1, scale: 1, rotation: -8, duration: 0.42, ease: "back.out(2.4)" }
            )
            .to(".covers-struck", { opacity: 0.45, duration: 0.3 }, 0.1)
            .fromTo(
              ".covers-shard",
              { x: 0, y: 0, opacity: 1, scale: 1 },
              {
                x: (i) => Math.cos(SHARDS[i]) * gsap.utils.random(60, 120),
                y: (i) => Math.sin(SHARDS[i]) * gsap.utils.random(40, 90),
                opacity: 0,
                scale: 0.2,
                duration: 0.7,
                ease: "expo.out",
              },
              0.16
            )
            .fromTo(
              ".covers-impact",
              { scale: 1, y: 0 },
              { scale: 0.985, y: 6, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out" },
              0.16
            );

          const pinEl = q(".covers-pin")[0];
          const lineInners = q(".covers-line-inner");
          gsap.set(".covers-stamp", { opacity: 0 });

          // Act one is the page intro, played on load rather than scrubbed:
          // this is the first section, so there is no scroll to drive it. The
          // first line arrives over the backdrop poster, and the pin opens on it.
          const intro = gsap
            .timeline({ defaults: { ease: "expo.out" }, delay: 0.15 })
            .fromTo(lineInners[0], { yPercent: 115 }, { yPercent: 0, duration: 1 }, 0.2)
            .fromTo(rules[0], { opacity: 0.25 }, { opacity: 1, duration: 0.6 }, 0.6)
            .fromTo(".covers-cue", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9);

          const onUpdate = (self: ScrollTrigger) => {
            if (self.progress > 0.7) stamp.play();
            else stamp.reverse();
          };

          // Act two: pinned on desktop; on a phone it is scrubbed across the
          // rest of the section, with no pin to fight the swipe.
          const deal = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: desktop
              ? {
                  trigger: pinEl,
                  start: "top top",
                  end: "+=130%",
                  pin: true,
                  scrub: 0.7,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate,
                }
              : // Short on a phone: the headline sits above the stage, and the
                // stamp has to land while it is still on screen.
                { trigger: pinEl, start: "top top", end: "top -30%", scrub: 0.6, onUpdate },
          });

          deal
            .fromTo(
              card,
              { ...DEPTH, xPercent: 50, yPercent: 90, rotation: 30, rotationY: -38, opacity: 0, scale: 0.9 },
              { ...REST, duration: 1.4 },
              0
            )
            .fromTo(
              lineInners.slice(1),
              { yPercent: 115 },
              { yPercent: 0, duration: 0.9, stagger: 0.9, ease: "expo.out" },
              0.1
            )
            // immediateRender off: the intro owns the cue until the first scroll.
            .fromTo(".covers-cue", { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0)
            .fromTo(rules[1], { opacity: 0.25 }, { opacity: 1, duration: 0.4 }, 0.6)
            .fromTo(".covers-strike", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 1.3)
            .fromTo(rules[2], { opacity: 0.25 }, { opacity: 1, duration: 0.4 }, 1.6)
            // Drift a touch once it is down, so the card keeps moving while
            // the reader is still scrolling through the pin.
            .to(card, { xPercent: 4, rotation: 6, scale: 1.03, duration: 1, ease: "none" }, 1.9);
          deal.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: deal.duration(), ease: "none" }, 0);

          // Velocity shear: a fast flick bends the stack, then it springs back.
          const skew = q(".covers-skew")[0];
          // Only retargeted when the velocity moves, so a page at rest (or
          // scrolled far past the stage) does not restyle it every frame.
          const skewTo = gsap.quickTo(skew, "skewY", { duration: 0.5, ease: "power3" });
          let skewed = 0;
          const shear = () => {
            const next = Math.round(gsap.utils.clamp(-6, 6, scrollSignal.velocity * -0.22) * 10) / 10;
            if (next === skewed) return;
            skewed = next;
            skewTo(next);
          };
          gsap.ticker.add(shear);

          // Pointer tilt and glare, only where there is a pointer to follow.
          const stage = q(".covers-stage")[0] as HTMLElement;
          const tilt = q(".covers-tilt")[0];
          const fine = window.matchMedia("(pointer: fine)").matches;
          let leave: (() => void) | undefined;
          let move: ((e: PointerEvent) => void) | undefined;

          if (desktop && fine && stage && tilt) {
            gsap.set(tilt, { transformPerspective: 1400 });
            const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3" });
            const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3" });
            const glares = q(".cover-glare").map((el) => ({
              x: gsap.quickTo(el, "xPercent", { duration: 0.6, ease: "power3" }),
              y: gsap.quickTo(el, "yPercent", { duration: 0.6, ease: "power3" }),
            }));
            let rect = stage.getBoundingClientRect();

            move = (e: PointerEvent) => {
              // One read per gesture: re-measured on enter, not on every move.
              const nx = (e.clientX - rect.left) / rect.width - 0.5;
              const ny = (e.clientY - rect.top) / rect.height - 0.5;
              ry(nx * 16);
              rx(ny * -12);
              glares.forEach((g) => {
                g.x(nx * 50);
                g.y(ny * 50);
              });
            };
            const enter = () => {
              rect = stage.getBoundingClientRect();
            };
            leave = () => {
              rx(0);
              ry(0);
            };
            stage.addEventListener("pointerenter", enter);
            stage.addEventListener("pointermove", move);
            stage.addEventListener("pointerleave", leave);

            return () => {
              intro.kill();
              gsap.ticker.remove(shear);
              stage.removeEventListener("pointerenter", enter);
              stage.removeEventListener("pointermove", move!);
              stage.removeEventListener("pointerleave", leave!);
              stamp.kill();
            };
          }

          return () => {
            intro.kill();
            gsap.ticker.remove(shear);
            stamp.kill();
          };
        }
      );

      return () => mm.revert();
    },
    { scope, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={scope} id="covers" className="group/section relative overflow-hidden">
      <div className="covers-pin relative flex min-h-[100svh] items-center pb-[clamp(4.5rem,9vw,7rem)] pt-28 lg:pb-14 lg:pt-24">
        {/* Lime wash behind the stage, so the stickers have something to glow against. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 h-[70%] w-[55%] -translate-y-1/2 rounded-full bg-primary/[0.08] blur-3xl"
        />

        <div className="section-container relative grid w-full gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10">
          <div className="relative z-10">
            <Reveal selector="[data-slot='duck-section-marker'] > *" stagger={0.06}>
              <DuckSectionMarker index="✳" className="border-b border-border pb-6">
                {t(ui.covers.label)}
              </DuckSectionMarker>
            </Reveal>

            <h2 className="display-xl covers-title mt-10 lg:mt-10">
              {lines.map((line) => (
                <span key={line} className="line-mask">
                  <span className="covers-line-inner block">{line}</span>
                </span>
              ))}
              {/* Only the word is masked: the strike and the stamp sit outside
                  the mask so the stamp can overshoot the line box. */}
              <span className="relative block w-fit">
                <span className="line-mask">
                  <span className="covers-line-inner covers-struck text-accent-glow block">
                    {t(ui.covers.struck)}
                  </span>
                </span>
                <span aria-hidden className="covers-strike" />
                <span aria-hidden className="covers-stamp">
                  {t(ui.covers.stamp)}
                  {SHARDS.map((_, i) => (
                    <span key={i} className="covers-shard" />
                  ))}
                </span>
              </span>
              <span className="sr-only"> {t(ui.covers.stamp)}</span>
            </h2>

            <ol className="mt-10 space-y-3 border-t border-border pt-6 lg:mt-12">
              {t(ui.covers.rules).map((rule, i) => (
                <li key={rule} className="covers-rule flex items-baseline gap-4">
                  <span className="hud text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg font-semibold tracking-tight md:text-xl">
                    {rule}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="covers-stage relative mx-auto aspect-[5/6] w-full max-w-[26rem] sm:max-w-[30rem] lg:h-[min(74svh,44rem)] lg:w-auto lg:max-w-none">
            {/* Print crop marks: the stage is a sheet before it is a layout. */}
            <span aria-hidden className="crop-mark left-0 top-0" />
            <span aria-hidden className="crop-mark right-0 top-0 rotate-90" />
            <span aria-hidden className="crop-mark bottom-0 right-0 rotate-180" />
            <span aria-hidden className="crop-mark bottom-0 left-0 -rotate-90" />

            <div className="covers-impact absolute inset-0">
              <div className="covers-tilt absolute inset-0">
                <div className="covers-skew absolute inset-0">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(true);
                      trackEvent("cover_open", { cover: cover.id });
                    }}
                    aria-label={`${t(ui.covers.cover)} — ${t(cover.title)}`}
                    className="cover-card group/cover absolute left-[9%] top-[7%] w-[82%]"
                  >
                    <span className="cover-lift sticker relative block overflow-hidden rounded-2xl border-foreground bg-card">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={`${cover.src}-640.avif 640w, ${cover.src}-1200.avif 1200w`}
                          sizes="(min-width: 1024px) 36vw, 82vw"
                        />
                        <img
                          src={`${cover.src}-900.jpg`}
                          width={1200}
                          height={1514}
                          // Dealt on the first scroll of the page: no lazy loading.
                          decoding="async"
                          alt={t(cover.alt)}
                          draggable={false}
                          className="block h-auto w-full select-none"
                        />
                      </picture>
                      <span aria-hidden className="cover-glare" />
                    </span>

                    <HoloBadge variant="primary" className="absolute -top-3 left-5">
                      {cover.lang.toUpperCase()}
                    </HoloBadge>
                    <span className="cover-open" aria-hidden>
                      <Maximize2 size={14} />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* HUD under the sheet: how far the deal has got. */}
            <div className="absolute -bottom-9 left-0 right-0 flex items-center gap-4" aria-hidden>
              <span className="hud whitespace-nowrap">
                {t(ui.covers.cover)}
              </span>
              <span className="relative h-px flex-1 bg-border">
                <span className="covers-bar absolute inset-0 origin-left scale-x-0 bg-primary" />
              </span>
              <span className="hud hidden whitespace-nowrap sm:inline">{t(ui.covers.issue)}</span>
            </div>
          </div>
        </div>
        {/* Desktop only: the pin holds the first screen, so it needs telling to
            scroll. On a phone the headline already runs off the bottom. */}
        <div className="covers-cue section-container pointer-events-none absolute inset-x-0 bottom-6 hidden items-center gap-3 lg:flex">
          <span className="hud animate-blink text-primary">▌</span>
          <span className="hud">{t(ui.hero.scrollCue)}</span>
        </div>
      </div>

      <StickerDialog open={open} onOpenChange={setOpen}>
        <StickerDialogContent
          closeLabel={t(ui.covers.close)}
          className="max-h-[92svh] max-w-[min(30rem,calc(100%-2rem))] gap-4 overflow-y-auto"
          data-lenis-prevent
        >
          <StickerDialogHeader>
            <StickerDialogTitle>{t(cover.title)}</StickerDialogTitle>
            <StickerDialogDescription className="hud">
              {t(ui.covers.issue)} · {cover.lang.toUpperCase()}
            </StickerDialogDescription>
          </StickerDialogHeader>
          <picture>
            <source type="image/avif" srcSet={`${cover.src}-1200.avif`} />
            <img
              src={`${cover.src}-900.jpg`}
              width={1200}
              height={1514}
              alt={t(cover.alt)}
              className="block h-auto w-full rounded-xl"
            />
          </picture>
        </StickerDialogContent>
      </StickerDialog>
    </section>
  );
}
