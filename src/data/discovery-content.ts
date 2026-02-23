export interface DiscoverySlide {
  type: "intro" | "fit" | "projects" | "skills" | "closing";
  title: string;
  subtitle?: string;
  bullets?: string[];
  highlight?: string;
}

export interface CompanyDiscovery {
  name: string;
  greeting: string;
  tagline: string;
  accentColor: string;
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

export function getDiscoveryContent(company: string): CompanyDiscovery {
  const name = decodeURIComponent(company).replace(/[^a-zA-Z0-9\s]/g, "").trim() || "your company";
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

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
