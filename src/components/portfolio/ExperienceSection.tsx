import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { experiences, sectionHeadings } from "@/data/content";

export default function ExperienceSection() {
  const { theme } = useTheme();
  const heading = sectionHeadings[theme].experience;

  return (
    <section id="experience" className="section-spacing section-container">
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

      <div className={`space-y-0 ${theme === "luxury" ? "max-w-3xl" : ""}`}>
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: theme === "luxury" ? 0.7 : 0.4,
              delay: i * 0.1,
            }}
            className={`theme-transition ${
              theme === "editorial"
                ? "border-t-2 border-foreground py-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4"
                : theme === "luxury"
                ? "border-t border-border py-10"
                : "border-l-2 border-primary pl-6 py-4 ml-2 mb-6 relative"
            }`}
          >
            {theme === "modern" && (
              <div className="absolute -left-[7px] top-6 w-3 h-3 rounded-full bg-primary" />
            )}

            <div
              className={`font-mono text-xs tracking-wider text-muted-foreground ${
                theme === "editorial" ? "uppercase" : "mb-2"
              }`}
            >
              {exp.period}
            </div>

            <div>
              <h3
                className={`font-display ${
                  theme === "editorial"
                    ? "text-lg uppercase tracking-wide font-bold"
                    : theme === "luxury"
                    ? "text-xl md:text-2xl font-medium mb-1"
                    : "text-lg font-semibold"
                }`}
              >
                {exp.role}
              </h3>
              <div
                className={`font-display ${
                  theme === "luxury" ? "text-primary italic mb-4" : "text-primary mb-2 text-sm font-medium"
                }`}
              >
                {exp.company}
              </div>
              <p className="text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
