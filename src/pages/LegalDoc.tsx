import Nav from "@/components/Nav";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import Footer from "@/components/portfolio/Footer";
import Reveal from "@/components/motion/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { bio, ui } from "@/data/content";
import { legalDocs, loadLegalBody, type LegalDocId } from "@/data/legal";
import { ScrollTrigger } from "@/lib/gsap";
import { ArrowLeft } from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

type LegalDocProps = {
  id: LegalDocId;
};

export default function LegalDoc({ id }: LegalDocProps) {
  const { lang, t } = useLanguage();
  const lenis = useLenis();
  const meta = legalDocs[id];
  const [body, setBody] = useState("");

  useEffect(() => {
    let stale = false;
    loadLegalBody(id, lang).then((markdown) => {
      if (!stale) setBody(markdown);
    });
    return () => {
      stale = true;
    };
  }, [id, lang]);

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(timer);
  }, [lenis, id]);

  useEffect(() => {
    document.title = `${t(meta.title)} — ${bio.name}`;
    return () => {
      document.title = `${bio.name} — Full-Stack Engineer, Frontend Lead, AI-Native`;
    };
  }, [meta.title, t, lang]);

  const updated = new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(meta.updated));

  return (
    <div className="grain relative min-h-screen">
      <ShaderBackdrop />
      <Nav />

      <main className="section-container py-28 md:py-36">
        <Reveal>
          <Link to="/" className="btn-ghost inline-flex">
            <ArrowLeft size={14} /> {t(ui.legal.back)}
          </Link>
          <span className="hud hud-accent mt-10 block">
            {t(ui.legal.updated)} · {updated}
          </span>
          <h1 className="display-lg mt-4 max-w-3xl">{t(meta.title)}</h1>
        </Reveal>

        <Reveal className="post-body mt-14 max-w-[68ch]">
          {body ? (
            <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
          ) : (
            <p className="text-muted-foreground">…</p>
          )}
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
