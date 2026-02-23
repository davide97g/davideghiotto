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

export interface Bio {
  name: string;
  role: string;
  location: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  values: string[];
}

export const heroMessages = {
  modern: {
    greeting: "Hey there! 👋",
    heading: "Full-Stack Engineer & Frontend Lead",
    subheading:
      "5+ years building scalable enterprise platforms. AI-native developer integrating LLM systems, agent architectures, and AI-driven workflows into production.",
    cta: "See my work",
    ctaSecondary: "Let's chat",
  },
  luxury: {
    greeting: "",
    heading: "Full-Stack Engineer & Frontend Lead",
    subheading:
      "AI-native developer integrating LLM systems and agent architectures. Led a team of 5 engineers delivering modular React applications for large-scale booking systems.",
    cta: "View Portfolio",
    ctaSecondary: "Inquire",
  },
  editorial: {
    greeting: "",
    heading: "FULL-STACK.\nFRONTEND LEAD.\nAI-NATIVE.",
    subheading:
      "Building systems that scale technically and organizationally. Performance, architecture clarity, and developer experience.",
    cta: "Work",
    ctaSecondary: "Contact",
  },
  "mr-franz": {
    greeting: "Hey, ready to build something great? 👋",
    heading: "Full-Stack Engineer & Frontend Lead",
    subheading:
      "Build experiences people love — no tourist traps. 5+ years building scalable platforms. AI-native developer and design-system advocate.",
    cta: "See my work",
    ctaSecondary: "Let's chat",
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
  "mr-franz": {
    projects: "Things I've Built ✨",
    skills: "My Toolkit 🛠",
    experience: "Where I've Been 🚀",
    about: "A Bit About Me 👤",
  },
};

export const bio: Bio = {
  name: "Davide Ghiotto",
  role: "Full-Stack Engineer & Frontend Lead",
  location: "Italy",
  email: "dghiotto.careers@gmail.com",
  phone: "+39 3455779838",
  linkedin: "davide-ghiotto",
  github: "davideghiotto",
  summary:
    "Full-Stack Engineer & Frontend Lead with 5+ years building scalable enterprise platforms. AI-native developer integrating LLM systems, agent architectures, and AI-driven workflows into production. Experienced in micro-frontend architectures, high-availability backend systems, and AI-augmented development. Led a team of 5 engineers delivering modular React applications for large-scale booking systems.",
  values: [
    "Strong focus on performance and architecture clarity",
    "Developer experience and code quality",
    "Systems that scale technically and organizationally",
    "AI-assisted workflows: Cursor, Claude Code, Codex, Cline",
  ],
};

export const projects: Project[] = [
  {
    title: "Sonarflow",
    description:
      "AI-Enhanced Code Quality CLI. Extended an open-source SonarQube CLI with AI-assisted issue resolution. Automated issue fetching and analysis from SonarQube/SonarCloud, AI-driven fix suggestions integrated into developer workflows. Distributed via npm for DevOps integration.",
    tags: ["Node.js", "TypeScript", "SonarQube"],
    year: "Oct 2025 — Present",
    link: "https://github.com/davide97g/sonarflow",
  },
  {
    title: "Bitcompass",
    description:
      "Modular Web Architecture Toolkit for bootstrapping scalable web applications with standardized architecture and developer tooling. Modular frontend structure with TypeScript and modern build setup. Integrated Supabase for auth and backend services. Built to accelerate project setup and enforce code quality across teams.",
    tags: ["TypeScript", "React", "Supabase"],
    year: "Feb 2026 — Present",
    link: "https://github.com/davide97g/bitcompass",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: ["React", "Next.js", "Angular", "Vue 3", "TypeScript"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Java (Spring)", ".NET", "Python"],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Oracle", "MySQL"],
  },
  {
    name: "Cloud & DevOps",
    skills: ["Supabase", "Firebase", "AWS (basic)", "GitHub Actions", "Jenkins"],
  },
  {
    name: "AI & Data",
    skills: ["TensorFlow", "Scikit-learn", "Pandas", "R"],
  },
];

export const experiences: Experience[] = [
  {
    role: "Frontend Team Leader",
    company: "Bitrock",
    period: "March 2023 — Present",
    description:
      "Frontend Team Lead of 5 developers. Building a large enterprise booking system with micro-frontend applications (independent React apps). Developed a full-stack vehicle fleet management app with Next.js and Supabase. Built Sonarflow, an AI-powered framework to automatically fix SonarQube issues and improve code quality.",
  },
  {
    role: "Data Scientist",
    company: "Infodati",
    period: "April 2022 — February 2023",
    description:
      "Prediction of customer score and opportunity outcomes using Python and Machine Learning. Integrated Python models inside the Qlik ecosystem.",
  },
  {
    role: "R&D Full Stack Developer",
    company: "Namirial",
    period: "October 2021 — September 2022",
    description:
      "Built cross-platform applications with Vue.js 3, Electron and .NET 6. Developed a digital signature application and a license manager. Agile SCRUM.",
  },
  {
    role: "Full Stack Developer & Database Manager",
    company: "Reply S.p.A — Cluster & Core Financial Services",
    period: "November 2019 — October 2021",
    description:
      "Frontend: Angular. Backend: Java in a microservice-oriented architecture. Database: Oracle, MySQL.",
  },
];

export const sectionOrder = {
  modern: ["hero", "projects", "skills", "experience", "about"] as const,
  luxury: ["hero", "about", "projects", "experience", "skills"] as const,
  editorial: ["hero", "experience", "projects", "skills", "about"] as const,
  "mr-franz": ["hero", "projects", "skills", "experience", "about"] as const,
};
