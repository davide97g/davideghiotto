import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { skillCategories, sectionHeadings } from "@/data/content";

export default function SkillsSection() {
  const { theme } = useTheme();
  const heading = sectionHeadings[theme].skills;

  return (
    <section id="skills" className="section-spacing section-container">
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
            : theme === "mr-franz"
            ? "text-3xl md:text-5xl font-bold hero-gradient-text"
            : "text-3xl md:text-4xl font-bold"
        }`}
      >
        {heading}
      </motion.h2>

      <div
        className={`grid gap-8 ${
          theme === "editorial"
            ? "grid-cols-2 md:grid-cols-4"
            : theme === "luxury"
            ? "grid-cols-1 md:grid-cols-2 gap-12"
            : theme === "mr-franz"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        }`}
      >
        {skillCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <h3
              className={`font-display mb-4 ${
                theme === "editorial"
                  ? "text-sm uppercase tracking-[0.2em] font-bold border-b-2 border-foreground pb-2"
                  : theme === "luxury"
                  ? "text-lg italic text-primary"
                  : "text-lg font-semibold text-primary"
              }`}
            >
              {cat.name}
            </h3>
            <ul className="space-y-2">
              {cat.skills.map((skill) => (
                <li
                  key={skill}
                  className={`font-body ${
                    theme === "editorial"
                      ? "text-sm text-foreground"
                      : theme === "luxury"
                      ? "text-base text-muted-foreground"
                      : "text-sm text-muted-foreground"
                  }`}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
