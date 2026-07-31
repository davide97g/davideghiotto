import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { channel, thumbnailUrl, videos, watchUrl } from "@/data/youtube";
import { trackEvent, trackOutbound } from "@/lib/analytics";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowUpRight, Youtube } from "lucide-react";
import { useRef } from "react";

const FEATURED = videos.slice(0, 8);

const formatDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ChannelSection() {
  const { lang, t } = useLanguage();
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  // Desktop: the gallery is pinned and dragged sideways by vertical scroll.
  // Mobile and reduced-motion get a plain swipeable overflow list instead.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const trackEl = track.current;
        const pinEl = pin.current;
        if (!trackEl || !pinEl) return;

        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 96);

        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: pin }
  );

  return (
    <section id="channel" className="relative">
      <div className="section-container section-spacing pb-0">
        <Reveal className="section-marker" stagger={0.06}>
          <span className="hud hud-accent">01</span>
          <span className="hud">{t(ui.channel.label)}</span>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <SplitReveal
            as="h2"
            text={t(ui.channel.title)}
            className="display-lg max-w-xl"
          />

          <Reveal className="flex flex-col gap-8">
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {t(ui.channel.lead)}
            </p>
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start"
              onClick={() => {
                trackEvent("youtube_click", { video_id: "subscribe" });
                trackOutbound("youtube_subscribe", channel.url);
              }}
            >
              <Youtube size={15} /> {t(ui.channel.cta)}
            </a>
          </Reveal>
        </div>

        <Reveal
          as="dl"
          selector=".stat"
          className="mt-16 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3"
        >
          <div className="stat bg-background p-6">
            <dt className="hud mb-3">{t(ui.channel.stats.subscribers)}</dt>
            <dd className="font-display text-4xl font-bold tracking-tight">
              {channel.subscribers}
            </dd>
          </div>
          <div className="stat bg-background p-6">
            <dt className="hud mb-3">{t(ui.channel.stats.videos)}</dt>
            <dd className="font-display text-4xl font-bold tracking-tight">
              {channel.videoCount}
            </dd>
          </div>
          <div className="stat col-span-2 bg-background p-6 md:col-span-1">
            <dt className="hud mb-3">{t(ui.channel.stats.cadence)}</dt>
            <dd className="font-display text-2xl font-bold tracking-tight text-primary">
              {t(ui.channel.stats.cadenceValue)}
            </dd>
          </div>
        </Reveal>
      </div>

      <div ref={pin} className="section-spacing overflow-hidden">
        <div className="section-container mb-8 flex items-baseline justify-between gap-4">
          <span className="hud">{t(ui.channel.latest)}</span>
          <span className="hud hud-accent">{channel.handle}</span>
        </div>

        <ul
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-10 lg:overflow-visible lg:pb-0"
        >
          {FEATURED.map((video, i) => (
            <li
              key={video.id}
              className="w-[78vw] shrink-0 snap-start sm:w-[54vw] lg:w-[26vw]"
            >
              <a
                href={watchUrl(video.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="panel panel-interactive panel-ticks card-scan group flex h-full flex-col"
                onClick={() => {
                  trackEvent("youtube_click", { video_id: video.id });
                  trackOutbound(`youtube_video_${video.id}`, watchUrl(video.id));
                }}
              >
                <div className="relative aspect-video overflow-hidden border-b border-border">
                  <img
                    src={thumbnailUrl(video.id)}
                    alt=""
                    loading="lazy"
                  className="h-full w-full scale-[1.35] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.42] group-active:scale-[1.38]"
                  />
                  <span className="hud absolute left-3 top-3 bg-background/80 px-2 py-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                    {video.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="hud">{formatDate(video.publishedAt, lang)}</span>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-foreground transition-colors group-hover:text-primary"
                    />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
