import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import FeaturedProject from "@/components/portfolio/FeaturedProject";
import { useLanguage } from "@/context/LanguageContext";
import { projects, ui } from "@/data/content";
import { trackOutbound } from "@/lib/analytics";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";

export default function WorkSection() {
  const { t } = useLanguage();

  return (
    <section id="work" className="section-container section-spacing">
      <Reveal className="section-marker" stagger={0.06}>
        <span className="hud hud-accent">02</span>
        <span className="hud">{t(ui.work.label)}</span>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <SplitReveal as="h2" text={t(ui.work.title)} className="display-lg" />
        <Reveal>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {t(ui.work.lead)}
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        <FeaturedProject />
      </div>

      <Reveal className="mt-24 section-marker" stagger={0.06}>
        <span className="hud">{t(ui.work.others)}</span>
      </Reveal>

      <Reveal as="ol" selector=".work-row" stagger={0.12} className="border-t border-border">
        {projects.map((project, i) => (
          <li key={project.title} className="work-row micro-row group border-b border-border">
            <div className="grid gap-6 py-10 md:grid-cols-[4rem_1fr_auto] md:gap-10 md:py-12">
              <span className="hud pt-3 transition-colors group-hover:text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="max-w-2xl">
                <h3 className="font-display text-3xl font-bold tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-5xl">
                  {project.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t(project.description)}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Screenshot stands in for the live site when it is gated. */}
                {project.shot && project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel panel-interactive card-scan mt-8 block overflow-hidden"
                    onClick={() =>
                      trackOutbound(`project_shot_${project.title}`, project.link!)
                    }
                  >
                    <span className="hud flex items-center gap-3 border-b border-border px-4 py-3">
                      <span className="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                      {t(ui.work.preview)}
                    </span>
                    <picture>
                      <source type="image/avif" srcSet={project.shot.avif} />
                      <img
                        src={project.shot.fallback}
                        width={1400}
                        height={809}
                        loading="lazy"
                        decoding="async"
                        alt={t(project.shot.alt)}
                        className="block w-full opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </picture>
                  </a>
                )}
              </div>

              <div className="flex items-start justify-between gap-6 md:flex-col md:items-end md:justify-start">
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span className="hud whitespace-nowrap">{project.year}</span>
                  {project.badge && (
                    <span className="tag whitespace-nowrap">{t(project.badge)}</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {project.linkedin && (
                    <a
                      href={project.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — LinkedIn`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                      onClick={() =>
                        trackOutbound(`project_linkedin_${project.title}`, project.linkedin!)
                      }
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — ${
                        project.link.includes("github") ? "GitHub" : "Live site"
                      }`}
                      className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                      onClick={() =>
                        trackOutbound(`project_link_${project.title}`, project.link!)
                      }
                    >
                      {project.link.includes("github") ? (
                        <Github size={18} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
