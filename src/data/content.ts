export interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
  link?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const heroMessages = {
  modern: {
    greeting: "Hey there! 👋",
    heading: "I build delightful digital experiences",
    subheading: "Full-stack developer & designer who loves turning complex problems into simple, beautiful solutions.",
    cta: "See my work",
    ctaSecondary: "Let's chat",
  },
  luxury: {
    greeting: "",
    heading: "Crafting Exceptional Digital Experiences",
    subheading: "A meticulous approach to full-stack development and design — where every pixel serves a purpose.",
    cta: "View Portfolio",
    ctaSecondary: "Inquire",
  },
  editorial: {
    greeting: "",
    heading: "DEVELOPER.\nDESIGNER.\nSTRATEGIST.",
    subheading: "Building systems that scale. Designing interfaces that endure.",
    cta: "Work",
    ctaSecondary: "Contact",
  },
};

export const sectionHeadings = {
  modern: {
    projects: "Things I've Built ✨",
    skills: "My Toolkit 🛠",
    experience: "Where I've Been 🚀",
    about: "A Bit About Me 👤",
  },
  luxury: {
    projects: "Selected Works",
    skills: "Expertise",
    experience: "Professional Journey",
    about: "Background",
  },
  editorial: {
    projects: "PROJECTS",
    skills: "CAPABILITIES",
    experience: "EXPERIENCE",
    about: "ABOUT",
  },
};

export const bio = {
  name: "Alex Chen",
  role: "Full-Stack Developer & Designer",
  location: "San Francisco, CA",
  email: "hello@alexchen.dev",
  summary:
    "I'm a developer and designer with 8+ years of experience building products for startups and enterprises. I specialize in React, TypeScript, and design systems. I believe great software is invisible — it just works.",
  values: [
    "Obsessed with craft and detail",
    "Systems thinking over quick fixes",
    "Accessibility is non-negotiable",
    "Ship fast, iterate faster",
  ],
};

export const projects: Project[] = [
  {
    title: "Velocity",
    description: "A real-time collaboration platform for distributed teams. Built with WebSockets, React, and a custom CRDT engine.",
    tags: ["React", "TypeScript", "WebSockets", "CRDT"],
    year: "2024",
  },
  {
    title: "Luminary",
    description: "Design system and component library serving 40+ internal products. Includes tokens, primitives, and composable patterns.",
    tags: ["Design Systems", "Storybook", "Figma", "CSS"],
    year: "2023",
  },
  {
    title: "Meridian",
    description: "Analytics dashboard for climate data visualization. Processes 2M+ data points with interactive charts and maps.",
    tags: ["D3.js", "Node.js", "PostgreSQL", "MapboxGL"],
    year: "2023",
  },
  {
    title: "Arcana",
    description: "AI-powered writing assistant with real-time suggestions, tone analysis, and multi-language support.",
    tags: ["OpenAI", "Next.js", "Redis", "TailwindCSS"],
    year: "2022",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Framer Motion", "Three.js"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
  },
  {
    name: "Design",
    skills: ["Figma", "Design Systems", "Prototyping", "Typography", "Motion Design"],
  },
  {
    name: "Tools & Practices",
    skills: ["Git", "CI/CD", "Testing", "Agile", "Documentation", "Accessibility"],
  },
];

export const experiences: Experience[] = [
  {
    role: "Senior Full-Stack Engineer",
    company: "Stellar Labs",
    period: "2022 — Present",
    description: "Leading frontend architecture and design system development for a B2B SaaS platform serving 500K+ users.",
  },
  {
    role: "Software Engineer",
    company: "NovaTech",
    period: "2019 — 2022",
    description: "Built and shipped 3 major product features. Reduced bundle size by 40% and improved Core Web Vitals across all pages.",
  },
  {
    role: "Frontend Developer",
    company: "PixelCraft Studio",
    period: "2017 — 2019",
    description: "Developed responsive web applications and interactive prototypes for agency clients across fintech and healthcare.",
  },
];

export const sectionOrder = {
  modern: ["hero", "projects", "skills", "experience", "about"] as const,
  luxury: ["hero", "about", "projects", "experience", "skills"] as const,
  editorial: ["hero", "experience", "projects", "skills", "about"] as const,
};
