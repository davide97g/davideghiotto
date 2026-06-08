import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { getDiscoveryContent, type DiscoverySlide } from "@/data/discovery-content";
import { ArrowLeft, ArrowRight, Home, Sparkles, Target, Briefcase, Code2, Heart, BarChart3 } from "lucide-react";

const slideIcons: Record<DiscoverySlide["type"], ReactNode> = {
  intro: <Sparkles size={28} />,
  fit: <Target size={28} />,
  projects: <Briefcase size={28} />,
  skills: <Code2 size={28} />,
  stats: <BarChart3 size={28} />,
  closing: <Heart size={28} />,
};

/** Prima's two-tone checkmark mark: a navy sweep + a rounded violet bar. */
function PrimaCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <path d="M16 62 L46 92" stroke="hsl(var(--pr-violet))" strokeWidth="22" strokeLinecap="round" />
      <path d="M42 90 L104 24" stroke="currentColor" strokeWidth="22" strokeLinecap="round" />
    </svg>
  );
}

export default function Discovery() {
  const { company = "visitor" } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const content = getDiscoveryContent(company);
  const slide = content.slides[current];
  const total = content.slides.length;
  const isPrima = content.themeOverride === "prima";

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => Math.min(Math.max(prev + dir, 0), total - 1));
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  // For Prima, accent every occurrence of the word "Prima" in violet (à la "Tu, Prima").
  const withBrandAccent = (text: string): ReactNode => {
    if (!isPrima || !text.includes("Prima")) return text;
    return text.split(/(Prima)/g).map((part, i) =>
      part === "Prima" ? (
        <span key={i} style={{ color: "hsl(var(--pr-violet))" }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground flex flex-col ${isPrima ? "prima-stage" : ""}`}
      data-theme={content.themeOverride ?? "modern"}
    >
      {/* Prima: large faint checkmark watermark for atmosphere */}
      {isPrima && (
        <PrimaCheck className="pointer-events-none absolute -right-[8%] bottom-[6%] w-[55vw] max-w-[680px] -z-10 opacity-[0.05] text-foreground" />
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
        >
          <Home size={16} />
          Back to Portfolio
        </button>

        {isPrima ? (
          <div className="flex items-center gap-2 text-foreground">
            <PrimaCheck className="w-5 h-5" />
            <span className="prima-wordmark text-2xl leading-none">prima</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={16} />
            <span className="font-display text-sm font-semibold">Prepared for {content.name}</span>
          </div>
        )}
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-6">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center gap-8 py-12"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"
                style={{ borderRadius: "var(--radius)" }}
              >
                {slideIcons[slide.type]}
              </motion.div>

              {/* Kicker */}
              {slide.kicker && (
                <motion.span
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                  className="-mb-4 font-mono text-xs md:text-sm uppercase tracking-[0.18em] text-accent"
                >
                  {slide.kicker}
                </motion.span>
              )}

              {/* Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight"
              >
                {withBrandAccent(slide.title)}
              </motion.h1>

              {/* Subtitle */}
              {slide.subtitle && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-lg md:text-xl text-muted-foreground font-body max-w-lg leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {/* Stats */}
              {slide.stats && (
                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-xl">
                  {slide.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.28 + i * 0.1, duration: 0.45 }}
                      className="card-themed p-5 md:p-6 flex flex-col items-center gap-2 text-center"
                    >
                      <span
                        className="prima-stat-value text-3xl md:text-5xl"
                        style={{ color: i % 2 === 0 ? "hsl(var(--pr-teal))" : "hsl(var(--pr-violet))" }}
                      >
                        {stat.value}
                      </span>
                      <span className="text-sm md:text-base text-muted-foreground font-body leading-snug">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bullets */}
              {slide.bullets && (
                <motion.ul className="flex flex-col gap-4 text-left max-w-xl w-full">
                  {slide.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.1, duration: 0.4 }}
                      className="flex items-start gap-3 text-base md:text-lg font-body text-foreground"
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              {/* Highlight */}
              {slide.highlight && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-primary font-display font-semibold text-lg"
                >
                  {slide.highlight}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <footer className="flex items-center justify-between px-6 py-6 border-t border-border">
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-display font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {content.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {current < total - 1 ? (
          <button
            onClick={() => go(1)}
            className="disc-cta flex items-center gap-2 px-5 py-2.5 text-sm font-display font-semibold hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--radius)" }}
          >
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="disc-cta flex items-center gap-2 px-5 py-2.5 text-sm font-display font-semibold hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--radius)" }}
          >
            {content.ctaLabel ?? "View Full Portfolio"}
            <ArrowRight size={16} />
          </button>
        )}
      </footer>
    </div>
  );
}
