import Nav from "@/components/Nav";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import Footer from "@/components/portfolio/Footer";
import PostMotion from "@/components/motion/PostMotion";
import Reveal from "@/components/motion/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import {
  findPost,
  journalPlatforms,
  journalPosts,
  loadPostBody,
  readingMinutes,
} from "@/data/journal";
import { thumbnailUrl, watchUrl } from "@/data/youtube";
import { ScrollTrigger } from "@/lib/gsap";
import { ArrowLeft, ArrowUpRight, Youtube } from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { DuckListRow } from "@/components/ui/duck-list-row";
import { DuckProse } from "@/components/ui/duck-prose";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import { StickerCard } from "@/components/ui/sticker-card";

const linkedin = journalPlatforms.find((p) => p.id === "linkedin") ?? journalPlatforms[0];

/**
 * A single journal note at `/journal/:slug`.
 *
 * The body is the raw markdown from `src/content/journal/<slug>.<lang>.md`, rendered
 * with react-markdown + GFM (the notes lean on tables) inside DuckProse, which
 * carries the typographic scale for long-form copy — the rest of the site has no
 * prose styles because nothing else on it is prose.
 */
export default function JournalPost() {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const lenis = useLenis();
  const post = findPost(slug);
  const [body, setBody] = useState("");

  // The bodies are lazy chunks, so a language switch (or a jump to another note)
  // re-fetches; `stale` keeps a slow chunk from overwriting a newer one.
  useEffect(() => {
    if (!post) return;
    let stale = false;
    loadPostBody(post.slug, lang).then((markdown) => {
      if (!stale) setBody(markdown);
    });
    return () => {
      stale = true;
    };
  }, [post, lang]);

  // Arriving from the journal band keeps the previous scroll position, and the
  // reveals below the fold are measured from the top of the new document.
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lenis, slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${t(post.title)} — ${bio.name}`;
    return () => {
      document.title = `${bio.name} — Full-Stack Engineer, Frontend Lead, AI-Native`;
    };
  }, [post, t, lang]);

  if (!post) {
    return (
      <div className="relative min-h-screen">
        <div className="grain" aria-hidden />
        <ShaderBackdrop />
        <Nav />
        <main className="section-container flex min-h-screen flex-col justify-center py-40">
          <span className="hud text-primary">404</span>
          <h1 className="display-lg mt-6">{t(ui.journal.label)}</h1>
          <HoloButton
            asChild
            variant="outline"
            size="lg"
            className="mt-10 self-start"
          >
            <Link to="/#journal">
              <ArrowLeft size={14} /> {t(ui.journal.back)}
            </Link>
          </HoloButton>
        </main>
        <Footer />
      </div>
    );
  }

  const date = new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(post.date));

  const others = journalPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="relative min-h-screen">
      <div className="grain" aria-hidden />
      <ShaderBackdrop />
      <Nav />

      <main className="section-container pb-24 pt-32 md:pt-40">
        <Link to="/#journal" className="hud inline-flex items-center gap-2 hover:text-primary">
          <ArrowLeft size={14} /> {t(ui.journal.back)}
        </Link>

        <article className="mt-10">
          <header className="border-b border-border pb-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="hud text-primary">◢</span>
              <span className="hud">
                <time dateTime={post.date}>{date}</time>
              </span>
              {body && (
                <>
                  <span className="hud" aria-hidden>
                    ·
                  </span>
                  <span className="hud">
                    {readingMinutes(body)} {t(ui.journal.minutes)}
                  </span>
                </>
              )}
            </div>

            <Reveal className="mt-7" y={18} start="top 92%">
              <h1 className="display-lg max-w-4xl">{t(post.title)}</h1>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t(post.excerpt)}
              </p>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap items-center gap-3" y={14} start="top 92%">
              {post.tags.map((tag) => (
                <HoloBadge key={tag} variant="outline" shape="tag" className="text-muted-foreground">
                  {tag}
                </HoloBadge>
              ))}
            </Reveal>
          </header>

          {/* The live the note is drawn from — every quote inside links back into it.
              Notes written outside a stream carry no video and skip this card. */}
          {post.video && (
          <Reveal className="mt-12" y={20} start="top 88%">
          <StickerCard
            asChild
            glass
            className="panel-interactive sheen group flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
          >
          <a
            href={watchUrl(post.video)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={thumbnailUrl(post.video)}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              className="w-full shrink-0 object-cover sm:w-56 sm:aspect-video"
            />
            <div className="min-w-0">
              <span className="hud flex items-center gap-2">
                <Youtube size={14} className="text-primary" /> {t(ui.journal.watch)}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                youtube.com/watch?v={post.video}
              </p>
            </div>
            <ArrowUpRight
              size={18}
              className="ml-auto hidden shrink-0 text-muted-foreground transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block"
            />
          </a>
          </StickerCard>
          </Reveal>
          )}

          <PostMotion contentKey={`${post.slug}:${lang}:${body.length}`}>
          <DuckProse as="section" className="mt-16">
            {body ? (
              <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
            ) : (
              <p className="hud">···</p>
            )}
          </DuckProse>
          </PostMotion>
        </article>

        <Reveal as="aside" className="mt-24 border-t border-border pt-10" y={20} start="top 88%">
          <h2 className="hud">{t(ui.journal.alsoOn)}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {post.crossPost ? (
              <HoloButton asChild variant="primary" size="lg">
                <a
                  href={post.crossPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(ui.journal.readOn)} {post.crossPost.platform}{" "}
                  <ArrowUpRight size={14} />
                </a>
              </HoloButton>
            ) : (
              <HoloButton
                asChild
                variant="outline"
                size="lg"
              >
                <a href={linkedin.url} target="_blank" rel="noopener noreferrer">
                  {linkedin.name} <ArrowUpRight size={14} />
                </a>
              </HoloButton>
            )}
          </div>

          <h2 className="hud mt-16">{t(ui.journal.latest)}</h2>
          <ul className="mt-6 border-t border-border">
            {others.map((other) => (
              <li key={other.slug}>
                <DuckListRow
                  asChild
                  title={t(other.title)}
                  description={t(other.excerpt)}
                  trailing={<ArrowUpRight size={16} />}
                >
                  <Link to={`/journal/${other.slug}`} />
                </DuckListRow>
              </li>
            ))}
          </ul>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
