import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { bio, sectionHeadings } from "@/data/content";
import { MapPin, Mail } from "lucide-react";

export default function AboutSection() {
  const { theme } = useTheme();
  const heading = sectionHeadings[theme].about;

  return (
    <section id="about" className="section-spacing section-container">
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

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`${
          theme === "editorial"
            ? "grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12"
            : theme === "luxury"
            ? "max-w-3xl"
            : "max-w-2xl"
        }`}
      >
        <div>
          <p
            className={`font-body leading-relaxed mb-8 ${
              theme === "luxury"
                ? "text-lg md:text-xl italic text-muted-foreground"
                : theme === "editorial"
                ? "text-base"
                : "text-base md:text-lg text-muted-foreground"
            }`}
          >
            {bio.summary}
          </p>

          <ul
            className={`space-y-3 mb-8 ${
              theme === "editorial" ? "border-t-2 border-foreground pt-6" : ""
            }`}
          >
            {bio.values.map((value) => (
              <li
                key={value}
                className={`font-body flex items-start gap-3 ${
                  theme === "editorial"
                    ? "text-sm"
                    : theme === "luxury"
                    ? "text-muted-foreground"
                    : "text-sm text-muted-foreground"
                }`}
              >
                <span className={`mt-1.5 w-1.5 h-1.5 flex-shrink-0 ${
                  theme === "editorial" ? "bg-accent" : "bg-primary rounded-full"
                }`} />
                {value}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`space-y-4 ${
            theme === "editorial" ? "border-t-2 md:border-t-0 md:border-l-2 border-foreground pt-6 md:pt-0 md:pl-8" : ""
          }`}
        >
          <div className="flex items-center gap-2 text-muted-foreground font-body text-sm">
            <MapPin size={14} />
            {bio.location}
          </div>
          <a
            href={`mailto:${bio.email}`}
            className="flex items-center gap-2 text-primary font-body text-sm hover:underline"
          >
            <Mail size={14} />
            {bio.email}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
