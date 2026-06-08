import type { ThemeId } from "@/context/ThemeContext";

export interface DiscoveryStat {
  value: string;
  label: string;
}

export interface DiscoverySlide {
  type: "intro" | "fit" | "projects" | "skills" | "closing" | "stats";
  title: string;
  subtitle?: string;
  kicker?: string;
  bullets?: string[];
  stats?: DiscoveryStat[];
  highlight?: string;
}

export interface CompanyDiscovery {
  name: string;
  greeting: string;
  tagline: string;
  accentColor: string;
  themeOverride?: ThemeId;
  ctaLabel?: string;
  slides: DiscoverySlide[];
}

const defaultSlides: DiscoverySlide[] = [
  {
    type: "intro",
    title: "Welcome to My Portfolio",
    subtitle: "I built this experience just for you.",
    highlight: "Let me show you why we'd be a great fit.",
  },
  {
    type: "fit",
    title: "Why I'm a Fit",
    bullets: [
      "8+ years building production-grade products across startups and enterprise",
      "Deep expertise in React, TypeScript, and modern frontend architecture",
      "Track record of leading design system initiatives serving 500K+ users",
      "Passionate about accessibility, performance, and developer experience",
    ],
  },
  {
    type: "projects",
    title: "Relevant Work",
    bullets: [
      "Velocity — Real-time collaboration platform with custom CRDT engine",
      "Luminary — Design system serving 40+ internal products",
      "Meridian — Analytics dashboard processing 2M+ data points",
      "Arcana — AI-powered writing assistant with multi-language support",
    ],
  },
  {
    type: "skills",
    title: "Skills That Match",
    bullets: [
      "Frontend: React, TypeScript, Next.js, TailwindCSS, Framer Motion",
      "Backend: Node.js, Python, PostgreSQL, GraphQL, REST APIs",
      "Design: Figma, Design Systems, Prototyping, Motion Design",
      "Practices: CI/CD, Testing, Agile, Accessibility, Documentation",
    ],
  },
  {
    type: "closing",
    title: "Let's Build Together",
    subtitle: "I'm excited about the possibility of working with your team.",
    highlight: "Ready to chat? Reach out at dghiotto.careers@gmail.com",
  },
];

const MR_FRANZ_SLUG = "mr-franz";

const mrFranzSlides: DiscoverySlide[] = [
  {
    type: "intro",
    title: "Welcome, Mr Franz",
    subtitle: "Your best travel buddy — I've prepared a custom experience for you. Viaggia come un local.",
    highlight: "Let me show you why we'd be a great fit.",
  },
  {
    type: "fit",
    title: "Why I'm a Fit",
    bullets: [
      "Frontend lead with 5+ years building user-first products — no tourist traps, solo il meglio",
      "Deep expertise in React, TypeScript, and design systems that scale",
      "Track record of curated UX: performance, accessibility, and developer experience",
      "Passionate about maps, flows, and experiences that feel local and verified",
    ],
  },
  {
    type: "projects",
    title: "Relevant Work",
    bullets: [
      "Sonarflow — AI-enhanced code quality; focus on clarity and developer delight",
      "Bitcompass — Modular web architecture and design-system tooling",
      "Enterprise booking systems — Large-scale React apps and micro-frontends",
      "Design systems — Consistent, scalable UI that serves real users",
    ],
  },
  {
    type: "skills",
    title: "Skills That Match",
    bullets: [
      "Frontend: React, TypeScript, Next.js, TailwindCSS, Framer Motion",
      "UX: Design Systems, Prototyping, Maps-friendly UIs, Performance",
      "Backend: Node.js, Python, PostgreSQL, REST APIs",
      "Practices: CI/CD, Testing, Accessibility, Documentation",
    ],
  },
  {
    type: "closing",
    title: "Let's Build Together",
    subtitle: "Ready to build the next best travel buddy experience?",
    highlight: "Reach out at dghiotto.careers@gmail.com",
  },
];

const PRIMA_SLUG = "prima";

const primaSlides: DiscoverySlide[] = [
  {
    type: "intro",
    kicker: "Senior Frontend Software Engineer",
    title: "Tu, Prima.",
    subtitle:
      "Ciao! I built this little experience just for you — a quick look at why I'd love to help shape the future of motor insurance with your team.",
    highlight: "Fueled by curiosity, experimentation and collaboration. Sounds like home.",
  },
  {
    type: "stats",
    kicker: "Data + tech, since 2015",
    title: "We speak the same language: data",
    subtitle:
      "Prima rethinks insurance with a love of data and tech. I get it — here's the scale and momentum I'd be joining.",
    stats: [
      { value: "5M+", label: "drivers trust Prima" },
      { value: "#1", label: "online motor insurer in Italy" },
      { value: "350+", label: "engineers in the team" },
      { value: "IT · UK · ES", label: "markets, and growing" },
    ],
  },
  {
    type: "fit",
    kicker: "The match",
    title: "Why I'm a fit",
    bullets: [
      "Proven frontend experience writing clean, efficient, scalable code with React & TypeScript",
      "Comfortable across modern frameworks — React day-to-day, plus Vue & Angular familiarity",
      "Modular, maintainable styling in CSS & SCSS, with a designer's eye for pixel-perfect UI",
      "Test-minded with Jest, Cypress & Vitest, and strong analytical, debugging instincts",
      "Ship seamlessly with design and backend — APIs integrated, cross-browser, fully responsive",
    ],
  },
  {
    type: "projects",
    kicker: "Proof",
    title: "Relevant work",
    bullets: [
      "Pulse HR — React + TypeScript product; component library and pixel-perfect UI built with design",
      "Sonarflow — performance-first frontend; optimized rendering and bundle size for speed at scale",
      "Bitcompass — modular web architecture and reusable, tested design-system tooling",
      "Responsive, cross-browser apps integrating REST & GraphQL with backend teams",
    ],
  },
  {
    type: "skills",
    kicker: "Toolbelt",
    title: "Skills that match the role",
    bullets: [
      "Frontend: React, TypeScript, Next.js, SCSS / CSS Modules, TailwindCSS",
      "Testing: Jest, Cypress, Vitest, React Testing Library",
      "Quality: CI/CD, performance optimization, cross-browser & responsive design",
      "APIs: REST & GraphQL integration alongside backend developers",
      "On my reading list: Elm — your nice-to-have, my next curiosity",
    ],
  },
  {
    type: "closing",
    kicker: "Insieme",
    title: "Let's build the future of insurance",
    subtitle:
      "I move fast, but I move with the team — curiosity, experimentation, collaboration. That's how I work, and it's how Prima works.",
    highlight: "Ready to chat? Reach me at dghiotto.careers@gmail.com",
  },
];

function normalizeCompanySlug(company: string): string {
  const decoded = decodeURIComponent(company).trim().toLowerCase();
  const slug = decoded.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (slug === "mr-franz" || slug === "mrfranz") return MR_FRANZ_SLUG;
  if (slug === "prima" || slug === "prima-assicurazioni" || slug === "primaassicurazioni") return PRIMA_SLUG;
  return slug || "your-company";
}

export function getDiscoveryContent(company: string): CompanyDiscovery {
  const normalized = normalizeCompanySlug(company);

  if (normalized === MR_FRANZ_SLUG) {
    return {
      name: "Mr Franz",
      greeting: "Hey, are you here from Mr Franz?",
      tagline: "Your best travel buddy — I've prepared a custom experience for you.",
      accentColor: "85 58% 48%",
      themeOverride: "mr-franz",
      slides: mrFranzSlides,
    };
  }

  if (normalized === PRIMA_SLUG) {
    return {
      name: "Prima",
      greeting: "Tu, Prima?",
      tagline: "I've prepared a custom experience for the Senior Frontend Engineer role.",
      accentColor: "274 63% 37%",
      themeOverride: "prima",
      ctaLabel: "See the full portfolio",
      slides: primaSlides,
    };
  }

  const rawName = decodeURIComponent(company).replace(/[^a-zA-Z0-9\s]/g, "").trim() || "your company";
  const capitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return {
    name: capitalized,
    greeting: `Hey, are you here from ${capitalized}?`,
    tagline: "I've prepared a custom experience for you.",
    accentColor: "250 85% 60%",
    slides: defaultSlides.map((slide) => {
      if (slide.type === "intro") {
        return {
          ...slide,
          title: `Welcome, ${capitalized}`,
          subtitle: `I noticed you might be visiting from ${capitalized}. I put together something special.`,
        };
      }
      if (slide.type === "closing") {
        return {
          ...slide,
          title: `Let's Build Together, ${capitalized}`,
          subtitle: `I'm excited about the possibility of joining ${capitalized}'s mission.`,
        };
      }
      return slide;
    }),
  };
}
