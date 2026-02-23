import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { projects, sectionHeadings } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsSection() {
  const { theme } = useTheme();
  const heading = sectionHeadings[theme].projects;

  return (
    <section id="projects" className="section-spacing section-container">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`font-display mb-12 ${
          theme === "editorial"
            ? "text-5xl md:text-7xl tracking-tight"
            : theme === "luxury"
            ? "text-3xl md:text-4xl italic font-medium"
            : "text-3xl md:text-4xl font-bold"
        }`}
      >
        {heading}
      </motion.h2>

      <div
        className={`grid gap-6 ${
          theme === "editorial"
            ? "grid-cols-1 md:grid-cols-2"
            : theme === "luxury"
            ? "grid-cols-1 gap-8"
            : "grid-cols-1 md:grid-cols-2 gap-6"
        }`}
      >
        {projects.map((project, i) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: theme === "luxury" ? 0.8 : theme === "editorial" ? 0.3 : 0.5,
              delay: i * (theme === "luxury" ? 0.15 : 0.08),
              ease: theme === "luxury" ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
            }}
            className="card-themed theme-transition p-6 md:p-8 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-muted-foreground tracking-wider">
                {project.year}
              </span>
              <ArrowUpRight
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>
            <h3
              className={`font-display mb-3 ${
                theme === "luxury"
                  ? "text-2xl md:text-3xl font-medium"
                  : theme === "editorial"
                  ? "text-xl uppercase tracking-wide font-bold"
                  : "text-xl md:text-2xl font-semibold"
              }`}
            >
              {project.title}
            </h3>
            <p className="text-muted-foreground font-body leading-relaxed mb-5 text-sm md:text-base">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-mono px-2.5 py-1 theme-transition ${
                    theme === "editorial"
                      ? "border border-foreground text-foreground"
                      : theme === "luxury"
                      ? "border border-border text-muted-foreground"
                      : "bg-secondary text-secondary-foreground rounded-full"
                  }`}
                  style={{ borderRadius: theme === "modern" ? "9999px" : "var(--radius)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
