import { useTheme, ThemeId } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { heroMessages, bio } from "@/data/content";
import { ArrowDown, Mail } from "lucide-react";

const MR_FRANZ_SKILLS =
  "React • TypeScript • Next.js • Node.js • PostgreSQL • Tailwind • Framer Motion • Supabase • Python • Vue • AWS • Figma • ";

/* eslint-disable @typescript-eslint/no-explicit-any */
const animationPresets: Record<ThemeId, { container: any; item: any }> = {
  modern: {
    container: { staggerChildren: 0.12, delayChildren: 0.2 },
    item: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
    },
  },
  luxury: {
    container: { staggerChildren: 0.25, delayChildren: 0.4 },
    item: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
    },
  },
  editorial: {
    container: { staggerChildren: 0.08, delayChildren: 0.1 },
    item: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
    },
  },
  "mr-franz": {
    container: { staggerChildren: 0.1, delayChildren: 0.15 },
    item: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    },
  },
};

const HERO_IMAGE_SRC = "/hero.jpg";

function ModernHero() {
  const msg = heroMessages.modern;
  const anim = animationPresets.modern;

  return (
    <section className="min-h-[90vh] flex items-center section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        <motion.div
          className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          initial="hidden"
          animate="visible"
          variants={{ visible: anim.container }}
        >
          <motion.p variants={anim.item} className="text-lg text-muted-foreground mb-4 font-body">
            {msg.greeting}
          </motion.p>
          <motion.h1
            variants={anim.item}
            className="text-5xl md:text-7xl font-bold font-display hero-gradient-text leading-tight mb-6"
          >
            {msg.heading}
          </motion.h1>
          <motion.p variants={anim.item} className="text-lg md:text-xl text-muted-foreground font-body mb-10 leading-relaxed">
            {msg.subheading}
          </motion.p>
          <motion.div variants={anim.item} className="flex gap-4 justify-center lg:justify-start">
            <a href="#projects" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity">
              {msg.cta} <ArrowDown size={16} />
            </a>
            <a href={`mailto:${bio.email}`} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-display font-medium hover:bg-secondary transition-colors">
              {msg.ctaSecondary}
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="aspect-[3/4] max-h-[70vh] lg:max-h-none rounded-lg overflow-hidden shrink-0 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none"
        >
          <img src={HERO_IMAGE_SRC} alt={bio.name} className="w-full h-full object-cover object-top" />
        </motion.div>
      </div>
    </section>
  );
}

function LuxuryHero() {
  const msg = heroMessages.luxury;
  const anim = animationPresets.luxury;

  return (
    <section className="min-h-screen flex items-center section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: anim.container }}
        >
          <motion.div variants={anim.item} className="w-16 h-[1px] bg-primary mb-8" />
          <motion.h1
            variants={anim.item}
            className="text-5xl md:text-7xl lg:text-8xl font-display hero-gradient-text leading-[1.05] mb-8 font-medium"
          >
            {msg.heading}
          </motion.h1>
          <motion.p variants={anim.item} className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-10 max-w-md italic">
            {msg.subheading}
          </motion.p>
          <motion.div variants={anim.item} className="flex gap-6">
            <a href="#projects" className="inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary font-display text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors">
              {msg.cta}
            </a>
            <a href={`mailto:${bio.email}`} className="inline-flex items-center gap-2 text-muted-foreground font-display text-sm uppercase tracking-[0.2em] hover:text-primary transition-colors">
              {msg.ctaSecondary}
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="aspect-[3/4] max-h-[70vh] lg:max-h-none rounded-sm overflow-hidden shrink-0 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none"
        >
          <img src={HERO_IMAGE_SRC} alt={bio.name} className="w-full h-full object-cover object-top" />
          <p className="mt-4 text-primary font-display text-2xl italic text-center lg:text-left">
            {bio.name}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MrFranzHero() {
  const msg = heroMessages["mr-franz"];
  const anim = animationPresets["mr-franz"];

  return (
    <>
      <section className="mf-hero-section min-h-[88vh] flex flex-col justify-center section-container pt-8 relative">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ visible: anim.container }}
        >
          <motion.p
            variants={anim.item}
            className="text-xs font-mono uppercase tracking-[0.25em] text-primary mb-4 font-medium"
          >
            Your best travel buddy
          </motion.p>
          <motion.h1
            variants={anim.item}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold hero-gradient-text leading-tight mb-6"
          >
            {msg.heading}
          </motion.h1>
          <motion.p
            variants={anim.item}
            className="text-lg md:text-xl text-muted-foreground font-body mb-10 leading-relaxed"
          >
            {msg.subheading}
          </motion.p>
          <motion.div variants={anim.item} className="flex flex-wrap gap-4 justify-center">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-display font-medium hover:opacity-95 transition-opacity shadow-lg shadow-primary/20"
            >
              {msg.cta} <ArrowDown size={18} />
            </a>
            <a
              href={`mailto:${bio.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-border text-foreground font-display font-medium hover:bg-secondary hover:border-primary/30 transition-colors"
            >
              <Mail size={18} />
              {msg.ctaSecondary}
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 lg:mt-16 w-full max-w-4xl mx-auto relative"
        >
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mf-hero-frame">
            <img
              src={HERO_IMAGE_SRC}
              alt={bio.name}
              className="w-full h-full object-cover object-center rounded-[calc(1.25rem-4px)]"
            />
            <span className="absolute top-4 right-4 mf-badge">Full stack</span>
          </div>
        </motion.div>
      </section>
      <div className="mf-ticker">
        <div className="inline-flex whitespace-nowrap animate-mf-ticker will-change-transform w-[200%]">
          <span className="inline-block pr-12">{MR_FRANZ_SKILLS.repeat(3)}</span>
          <span className="inline-block pr-12">{MR_FRANZ_SKILLS.repeat(3)}</span>
        </div>
      </div>
    </>
  );
}

function EditorialHero() {
  const msg = heroMessages.editorial;
  const anim = animationPresets.editorial;

  return (
    <section className="min-h-[85vh] flex flex-col justify-end section-container pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: anim.container }}
        >
          <motion.h1
            variants={anim.item}
            className="text-6xl md:text-8xl lg:text-[10rem] font-display leading-[0.9] tracking-tight mb-8 whitespace-pre-line"
          >
            {msg.heading}
          </motion.h1>
          <motion.div variants={anim.item} className="w-full h-[2px] bg-foreground mb-6" />
          <motion.div variants={anim.item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <p className="text-base md:text-lg text-muted-foreground font-body max-w-md">
              {msg.subheading}
            </p>
            <div className="flex gap-6 text-sm font-mono uppercase">
              <a href="#projects" className="border-b-2 border-foreground pb-1 hover:text-accent transition-colors">
                {msg.cta}
              </a>
              <a href={`mailto:${bio.email}`} className="border-b-2 border-transparent pb-1 hover:border-foreground transition-colors">
                {msg.ctaSecondary}
              </a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
          className="aspect-[3/4] max-h-[60vh] lg:max-h-none rounded overflow-hidden shrink-0 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none"
        >
          <img src={HERO_IMAGE_SRC} alt={bio.name} className="w-full h-full object-cover object-top" />
        </motion.div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();

  switch (theme) {
    case "luxury":
      return <LuxuryHero />;
    case "editorial":
      return <EditorialHero />;
    case "mr-franz":
      return <MrFranzHero />;
    default:
      return <ModernHero />;
  }
}
