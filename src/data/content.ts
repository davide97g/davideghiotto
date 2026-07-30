import type { LangId } from "@/context/LanguageContext";

/** A string (or any value) that exists in both site languages. */
export type Localized<T = string> = Record<LangId, T>;

/** Screenshot preview for a project whose live site is gated or hard to show. */
export interface ProjectShot {
  avif: string;
  fallback: string;
  alt: Localized;
}

export interface Project {
  title: string;
  description: Localized;
  tags: string[];
  year: string;
  link?: string;
  linkedin?: string;
  /** Small badge next to the year — e.g. a closed-source or gated-access note. */
  badge?: Localized;
  shot?: ProjectShot;
}


export interface Experience {
  role: Localized;
  company: string;
  period: string;
  description: Localized;
}

export interface StackGroup {
  name: Localized;
  items: string[];
}

export const bio = {
  name: "Davide Ghiotto",
  role: {
    en: "Full-Stack Engineer & Frontend Lead",
    it: "Full-Stack Engineer & Frontend Lead",
  },
  location: { en: "Italy", it: "Italia" },
  email: "dghiotto.careers@gmail.com",
  phone: "+39 3455779838",
  linkedin: "davide-ghiotto",
  github: "davide97g",
  workshop: "https://dacoder.it",
};

/** Every piece of chrome and copy the layout needs, in both languages. */
export const ui = {
  nav: {
    channel: { en: "Channel", it: "Canale" },
    work: { en: "Work", it: "Progetti" },
    journal: { en: "Journal", it: "Diario" },
    stack: { en: "Stack", it: "Stack" },
    path: { en: "Trajectory", it: "Percorso" },
    profile: { en: "Profile", it: "Profilo" },
    contact: { en: "Contact", it: "Contatti" },
  },
  hero: {
    eyebrow: {
      en: "Full-stack engineer · Frontend lead · Italy",
      it: "Full-stack engineer · Frontend lead · Italia",
    },
    /** Rendered one line per array entry, each masked and revealed separately. */
    headline: {
      en: ["Building", "with agents,", "in public."],
      it: ["Costruisco", "con gli agenti,", "in pubblico."],
    },
    lead: {
      en: "Five years shipping enterprise platforms. Now wiring LLM systems and agent architectures into production — and streaming the whole build on YouTube.",
      it: "Cinque anni a costruire piattaforme enterprise. Oggi porto sistemi LLM e architetture ad agenti in produzione — e trasmetto tutto il processo su YouTube.",
    },
    ctaPrimary: { en: "See the work", it: "Guarda i progetti" },
    ctaSecondary: { en: "Watch the builds", it: "Guarda le live" },
    scrollCue: { en: "Scroll", it: "Scorri" },
  },
  channel: {
    label: { en: "Channel", it: "Canale" },
    title: {
      en: "I build on camera, weekly.",
      it: "Costruisco in diretta, ogni settimana.",
    },
    lead: {
      en: "Live coding, agent workflows and honest model comparisons — no hype, and no editing that fakes the rhythm of real development.",
      it: "Live coding, workflow con agenti e confronti onesti tra modelli — senza hype e senza tagli che falsano i ritmi dello sviluppo reale.",
    },
    cta: { en: "Subscribe on YouTube", it: "Iscriviti su YouTube" },
    stats: {
      subscribers: { en: "Subscribers", it: "Iscritti" },
      videos: { en: "Videos", it: "Video" },
      cadence: { en: "Cadence", it: "Frequenza" },
      cadenceValue: { en: "Weekly live", it: "Live ogni settimana" },
    },
    latest: { en: "Latest uploads", it: "Ultimi video" },
  },
  work: {
    label: { en: "Work", it: "Progetti" },
    title: { en: "What I ship.", it: "Quello che costruisco." },
    lead: {
      en: "Open-source tools and platforms, mostly built in the open.",
      it: "Tool e piattaforme open-source, quasi sempre costruiti in pubblico.",
    },
    featuredLabel: { en: "Current focus", it: "Progetto attuale" },
    featuresLabel: { en: "Inside", it: "Cosa contiene" },
    stackLabel: { en: "Built with", it: "Costruito con" },
    visit: { en: "Open sharp", it: "Apri sharp" },
    source: { en: "Source", it: "Codice" },
    others: { en: "Also shipping", it: "Altri progetti" },
    preview: { en: "Preview", it: "Anteprima" },
  },
  journal: {
    label: { en: "Journal", it: "Diario" },
    title: { en: "Thinking out loud.", it: "Pensieri ad alta voce." },
    lead: {
      en: "A working diary: what agents got right, what they broke, and the calls I'd make differently. Written in the open, posted where the conversation already is.",
      it: "Un diario di lavoro: cosa hanno azzeccato gli agenti, cosa hanno rotto e le scelte che rifarei diversamente. Scritto in pubblico e pubblicato dove la conversazione è già in corso.",
    },
    latest: { en: "Latest notes", it: "Ultime note" },
    empty: {
      en: "First note is being written. New entries land here as soon as they go live.",
      it: "La prima nota è in scrittura. Le prossime compaiono qui appena pubblicate.",
    },
    platforms: { en: "Where I post", it: "Dove pubblico" },
    readOn: { en: "Read on", it: "Leggi su" },
    read: { en: "Read the note", it: "Leggi la nota" },
    back: { en: "All notes", it: "Tutte le note" },
    minutes: { en: "min read", it: "min di lettura" },
    watch: { en: "Watch the source live", it: "Guarda la live sorgente" },
    alsoOn: { en: "Also published on", it: "Pubblicato anche su" },
  },
  stack: {
    label: { en: "Stack", it: "Stack" },
    title: { en: "The toolkit.", it: "Il toolkit." },
    lead: {
      en: "What I reach for, grouped by where it sits in the system.",
      it: "Cosa uso, raggruppato per posizione nel sistema.",
    },
    nextLabel: { en: "Next", it: "Prossimo" },
    nextValue: {
      en: "Whatever the next live needs.",
      it: "Quello che serve alla prossima live.",
    },
  },
  path: {
    label: { en: "Trajectory", it: "Percorso" },
    title: { en: "Where I've been.", it: "Da dove vengo." },
    current: { en: "Current", it: "Attuale" },
  },
  profile: {
    label: { en: "Profile", it: "Profilo" },
    title: { en: "The short version.", it: "La versione breve." },
    principles: { en: "How I work", it: "Come lavoro" },
  },
  footer: {
    built: {
      en: "Built with React, GSAP and a lot of agents.",
      it: "Costruito con React, GSAP e un sacco di agenti.",
    },
    rights: { en: "All rights reserved.", it: "Tutti i diritti riservati." },
    workshop: { en: "Open-source workshop", it: "Laboratorio open-source" },
  },
  lang: {
    label: { en: "Language", it: "Lingua" },
  },
  ral: {
    label: { en: "Compensation", it: "Compenso" },
    title: {
      en: "RAL disclosure.",
      it: "Disclosure della RAL.",
    },
    lead: {
      en: "An open look at how my gross annual salary moved across companies — from the first Reply offer to the current Bitrock number. Exact figures unlock with a work email.",
      it: "Uno sguardo aperto a come è cambiata la mia RAL tra le aziende — dalla prima offerta Reply al numero attuale in Bitrock. Le cifre precise si sbloccano con una email di lavoro.",
    },
    back: { en: "Back home", it: "Torna alla home" },
    cta: { en: "See my RAL", it: "Vedi la mia RAL" },
    ctaHint: {
      en: "Current gross · full history",
      it: "Lordo attuale · storico completo",
    },
    lockedHint: {
      en: "Figures locked — reveal to unlock",
      it: "Cifre bloccate — rivela per sbloccare",
    },
    reveal: { en: "Reveal RAL", it: "Rivela RAL" },
    revealHint: {
      en: "Email gate · one step",
      it: "Gate email · un passo",
    },
    unlocked: {
      en: "Unlocked for",
      it: "Sbloccato per",
    },
    expiresIn: {
      en: "Expires in",
      it: "Scade tra",
    },
    expiredBanner: {
      en: "Session expired — figures locked again.",
      it: "Sessione scaduta — cifre di nuovo bloccate.",
    },
    currentLabel: { en: "Current", it: "Attuale" },
    chartLabel: { en: "Trajectory", it: "Traiettoria" },
    chartTitle: {
      en: "RAL over time.",
      it: "RAL nel tempo.",
    },
    chartLead: {
      en: "Each step is a bump. Coloured bands mark the employer so Reply, Namirial, Infodati and Bitrock stay recognisable at a glance.",
      it: "Ogni scalino è un aumento. Le bande colorate segnano il datore di lavoro: Reply, Namirial, Infodati e Bitrock restano riconoscibili a colpo d'occhio.",
    },
    chartAxis: {
      en: "X · time  ·  Y · gross annual RAL",
      it: "X · tempo  ·  Y · RAL lorda annua",
    },
    stats: {
      current: { en: "Current RAL", it: "RAL attuale" },
      growth: { en: "Total growth", it: "Crescita totale" },
      multiple: { en: "vs first offer", it: "vs prima offerta" },
    },
    timeline: {
      label: { en: "Employers", it: "Aziende" },
      title: {
        en: "Where the bumps landed.",
        it: "Dove sono arrivati gli aumenti.",
      },
      lead: {
        en: "Same path as the CV — each company carries its RAL steps underneath.",
        it: "Lo stesso percorso del CV — ogni azienda porta sotto i suoi step di RAL.",
      },
      present: { en: "present", it: "oggi" },
      locked: {
        en: "Amounts stay redacted until you reveal.",
        it: "Gli importi restano oscurati finché non riveli.",
      },
    },
    gate: {
      eyebrow: { en: "Access gate", it: "Gate di accesso" },
      title: {
        en: "Share an email to read the numbers.",
        it: "Condividi un'email per leggere i numeri.",
      },
      lead: {
        en: "Recruiters, founders, curious peers — drop a real address and the chart unlocks. No spam, just a receipt that you showed up.",
        it: "Recruiter, founder, colleghi curiosi — lascia un indirizzo vero e il grafico si sblocca. Niente spam, solo la traccia che ti sei presentato.",
      },
      badge: { en: "OTP · real email", it: "OTP · email reale" },
      badgeOffline: {
        en: "Gate offline · figures locked",
        it: "Gate offline · cifre bloccate",
      },
      emailLabel: { en: "Work email", it: "Email di lavoro" },
      placeholder: { en: "you@company.com", it: "tu@azienda.com" },
      submit: { en: "Send code", it: "Invia codice" },
      verify: { en: "Verify & unlock", it: "Verifica e sblocca" },
      pending: { en: "Working", it: "Attendi" },
      codeTitle: {
        en: "Enter the code from your inbox.",
        it: "Inserisci il codice dalla tua inbox.",
      },
      codeLead: {
        en: "We emailed a short one-time code. Disposable inboxes are rejected.",
        it: "Ti abbiamo mandato un codice monouso. Le inbox usa-e-getta vengono rifiutate.",
      },
      codeLabel: { en: "One-time code", it: "Codice monouso" },
      sentTo: { en: "Sent to", it: "Inviato a" },
      devCode: { en: "Dev code", it: "Codice di sviluppo" },
      back: { en: "Use another email", it: "Usa un'altra email" },
      footnote: {
        en: "Real mailbox required. If the gate service is down, numbers stay hidden.",
        it: "Serve una mailbox reale. Se il servizio del gate è giù, i numeri restano nascosti.",
      },
      errors: {
        invalid: {
          en: "That doesn't look like a usable email.",
          it: "Non sembra un'email utilizzabile.",
        },
        disposable: {
          en: "Temporary / disposable addresses aren't accepted.",
          it: "Indirizzi temporanei / usa-e-getta non sono accettati.",
        },
        network: {
          en: "Something went wrong — try again.",
          it: "Qualcosa è andato storto — riprova.",
        },
        rateLimit: {
          en: "Too many attempts. Wait a bit and try again.",
          it: "Troppi tentativi. Aspetta un po' e riprova.",
        },
        /** `{minutes}` is replaced with the wait the service reports. */
        rateLimitIn: {
          en: "Too many attempts. Try again in {minutes} min.",
          it: "Troppi tentativi. Riprova tra {minutes} min.",
        },
        mail: {
          en: "Couldn't send the email. Try again shortly.",
          it: "Non riesco a inviare l'email. Riprova tra poco.",
        },
        code: {
          en: "That code isn't valid.",
          it: "Quel codice non è valido.",
        },
        expired: {
          en: "That code expired — request a new one.",
          it: "Codice scaduto — richiedine uno nuovo.",
        },
        locked: {
          en: "Too many wrong codes. Request a new one.",
          it: "Troppi codici errati. Richiedine uno nuovo.",
        },
        auth: {
          en: "Session expired — reveal again.",
          it: "Sessione scaduta — rivela di nuovo.",
        },
        unavailable: {
          en: "Unlock service is offline. Figures stay locked.",
          it: "Il servizio di sblocco è offline. Le cifre restano bloccate.",
        },
      },
    },
  },
};

export const summary: Localized = {
  en: "Full-stack engineer and frontend lead with 5+ years building scalable enterprise platforms. I integrate LLM systems, agent architectures and AI-driven workflows into production software, across micro-frontend architectures and high-availability backends. Currently leading a team of 5 engineers delivering modular React applications for a large-scale booking system.",
  it: "Full-stack engineer e frontend lead con più di 5 anni di esperienza su piattaforme enterprise scalabili. Integro sistemi LLM, architetture ad agenti e workflow guidati dall'AI nel software in produzione, tra architetture micro-frontend e backend ad alta disponibilità. Attualmente guido un team di 5 sviluppatori su applicazioni React modulari per un sistema di booking su larga scala.",
};

export const principles: Localized<string[]> = {
  en: [
    "Performance and architectural clarity over cleverness",
    "Developer experience is a product feature",
    "Systems that scale technically and organizationally",
    "AI-assisted workflows: Claude Code, Codex, Cursor, Cline",
  ],
  it: [
    "Performance e chiarezza architetturale prima della furbizia",
    "La developer experience è una feature di prodotto",
    "Sistemi che scalano tecnicamente e organizzativamente",
    "Workflow assistiti dall'AI: Claude Code, Codex, Cursor, Cline",
  ],
};

/** Marquee terms — proper nouns, identical in both languages. */
export const marqueeTerms = [
  "Claude Code",
  "Agents",
  "Codex",
  "Micro-frontends",
  "React",
  "TypeScript",
  "Vibecoding",
  "Bun",
  "LLM Systems",
  "Next.js",
  "Live Coding",
  "Build in Public",
];

/**
 * Pinned lead project. Copy, feature list and version mirror the official
 * landing page at sharp.davideghiotto.it; the mark is the project's own
 * favicon (a violet `#` on #0e0e11), kept in public/sharp.svg.
 */
export const featuredProject = {
  name: "sharp",
  version: "v0.3.0",
  license: "AGPL-3.0",
  price: "$0",
  logo: "/sharp.svg",
  site: "https://sharp.davideghiotto.it/",
  repo: "https://github.com/davide97g/sharp",
  tagline: {
    en: "The self-hosted Slack alternative.",
    it: "L'alternativa a Slack, self-hosted.",
  },
  description: {
    en: "Chat, collaborative docs, whiteboards, kanban boards, voice and video calls, a calendar, a Linear-lite task tracker and an AI assistant — one open-source container on your own server. No per-seat pricing, no history caps, and your data never leaves your infrastructure.",
    it: "Chat, documenti collaborativi, whiteboard, kanban, chiamate voce e video, calendario, un task tracker in stile Linear e un assistente AI — un solo container open-source sul tuo server. Nessun prezzo per utente, nessun limite di cronologia, e i dati non lasciano mai la tua infrastruttura.",
  },
  features: [
    {
      en: "Chat, threads & DMs with presence and full-text search",
      it: "Chat, thread e DM con presenza e ricerca full-text",
    },
    {
      en: "Collaborative docs with real-time co-editing (Yjs)",
      it: "Documenti collaborativi con co-editing in tempo reale (Yjs)",
    },
    {
      en: "Infinite canvas and kanban boards",
      it: "Canvas infinita e board kanban",
    },
    {
      en: "Voice, video and screen share up to 25 participants (LiveKit SFU)",
      it: "Voce, video e screen share fino a 25 partecipanti (LiveKit SFU)",
    },
    {
      en: "Sharpy AI assistant with permission-aware workspace RAG",
      it: "Assistente AI Sharpy con RAG sul workspace che rispetta i permessi",
    },
    {
      en: "Tasks and projects with GitHub sync, calendar with Google sync",
      it: "Task e progetti con sync GitHub, calendario con sync Google",
    },
    {
      en: "Optional end-to-end encrypted DMs and passkeys",
      it: "DM con crittografia end-to-end opzionale e passkey",
    },
  ],
  stack: [
    "Rust (axum)",
    "Postgres 16 + pgvector",
    "Redis",
    "LiveKit",
    "React",
    "Vite",
    "Tauri 2",
    "Astro",
  ],
};

export const projects: Project[] = [
  {
    title: "Thumb Studio",
    description: {
      en: "Browser thumbnail editor for the channel, built because every generic design tool fights the 1280×720 workflow. Layer stack for text, freehand strokes, cut-out logos and emoji effects, a reusable asset library, project archive with autosave, undo/redo and one-click PNG export. Backgrounds come from a parametric generator — the 'Grainient' preset warps three colours with tunable frequency, amplitude and grain.",
      it: "Editor di thumbnail nel browser, nato perché ogni tool di design generico combatte con il workflow 1280×720. Stack di livelli per testo, tratti a mano libera, logo scontornati ed effetti emoji, libreria di asset riutilizzabili, archivio progetti con autosave, undo/redo ed export PNG in un click. Gli sfondi arrivano da un generatore parametrico: il preset «Grainient» deforma tre colori con frequenza, ampiezza e grana regolabili.",
    },
    tags: ["TypeScript", "Canvas", "Image Export"],
    year: "2026 —",
    link: "https://thumb.davideghiotto.it/",
    badge: { en: "Gated access", it: "Accesso protetto" },
    shot: {
      avif: "/shot-thumb-studio.avif",
      fallback: "/shot-thumb-studio.jpg",
      alt: {
        en: "Thumb Studio editor: layer list, 1280×720 canvas and background effect controls",
        it: "Editor Thumb Studio: lista livelli, canvas 1280×720 e controlli dell'effetto di sfondo",
      },
    },
  },
  {
    title: "Channeling",
    description: {
      en: "A personal signal archive. It ingests the videos I watch and the notes I keep, then answers questions with citations back to the exact source and timestamp — every claim traceable to a video second or a topic file. Answers, topics and resources are linked into a force-directed graph you can walk, with saved threads, follow-up questions and a swappable model behind them.",
      it: "Un archivio personale di segnali. Assorbe i video che guardo e le note che tengo, poi risponde citando la fonte esatta e il timestamp — ogni affermazione risalibile al secondo del video o al file di argomento. Risposte, argomenti e risorse finiscono in un grafo force-directed navigabile, con thread salvati, domande di follow-up e modello sostituibile.",
    },
    tags: ["TypeScript", "RAG", "Knowledge Graph"],
    year: "2026 —",
    link: "https://channeling.davideghiotto.it/",
    badge: { en: "Private repo", it: "Repo privata" },
    shot: {
      avif: "/shot-channeling.avif",
      fallback: "/shot-channeling.jpg",
      alt: {
        en: "Channeling: a cited answer next to its force-directed knowledge graph",
        it: "Channeling: una risposta con citazioni accanto al suo grafo di conoscenza force-directed",
      },
    },
  },
  {
    title: "Pulse HR",
    description: {
      en: "Open-source, people-first HR platform. Async status logs, kudos, growth and wellbeing with manager-safe sentiment — raw signals stay with the employee, managers see aggregated trends. Bun monorepo: TanStack Router, Hono API, Neon Postgres, Astro marketing site.",
      it: "Piattaforma HR open-source che mette le persone al centro. Log di stato asincroni, kudos, crescita e benessere con sentiment a prova di manager: i segnali grezzi restano al dipendente, i manager vedono solo trend aggregati. Monorepo Bun: TanStack Router, API Hono, Neon Postgres, sito marketing in Astro.",
    },
    tags: ["TypeScript", "Bun", "Hono"],
    year: "2026 —",
    link: "https://github.com/davide97g/pulse-hr",
    linkedin: "https://www.linkedin.com/company/pulse-hr-official",
  },
  {
    title: "Sonarflow",
    description: {
      en: "AI-enhanced code quality CLI. Extends an open-source SonarQube CLI with AI-assisted issue resolution: automated fetching and analysis from SonarQube/SonarCloud, fix suggestions wired into the developer workflow. Distributed on npm.",
      it: "CLI per la qualità del codice potenziata dall'AI. Estende una CLI SonarQube open-source con risoluzione assistita degli issue: recupero e analisi automatici da SonarQube/SonarCloud e suggerimenti di fix integrati nel workflow. Distribuita su npm.",
    },
    tags: ["Node.js", "TypeScript", "SonarQube"],
    year: "2025 —",
    link: "https://github.com/davide97g/sonarflow",
  },
  {
    title: "Bitcompass",
    description: {
      en: "Modular web architecture toolkit for bootstrapping scalable applications: standardized structure, TypeScript, a modern build setup and Supabase for auth and backend services. Built to accelerate setup and enforce code quality across teams.",
      it: "Toolkit di architettura web modulare per avviare applicazioni scalabili: struttura standardizzata, TypeScript, build moderna e Supabase per auth e servizi backend. Nato per accelerare il setup e imporre qualità del codice tra i team.",
    },
    tags: ["TypeScript", "React", "Supabase"],
    year: "2026 —",
    link: "https://github.com/davide97g/bitcompass",
  },
  {
    title: "Claude Opus 5 (parody)",
    description: {
      en: "A tongue-in-cheek landing page mimicking a fictional model announcement, built to explore SEO, static pre-rendering and Open Graph metadata. Fully static, with sitemap, structured meta tags and a leak-tracker page.",
      it: "Landing page ironica che imita l'annuncio di un modello immaginario, costruita per esplorare SEO, pre-rendering statico e metadati Open Graph. Completamente statica, con sitemap, meta tag strutturati e una pagina leak-tracker.",
    },
    tags: ["HTML", "SEO", "Static Site"],
    year: "2026",
    link: "https://opus5.davideghiotto.it/",
  },
];

export const stackGroups: StackGroup[] = [
  {
    name: { en: "Frontend", it: "Frontend" },
    items: ["React", "Next.js", "Angular", "Vue 3", "TypeScript"],
  },
  {
    name: { en: "Backend", it: "Backend" },
    items: ["Node.js", "Java (Spring)", ".NET", "Python"],
  },
  {
    name: { en: "Databases", it: "Database" },
    items: ["PostgreSQL", "MongoDB", "Oracle", "MySQL"],
  },
  {
    name: { en: "Cloud & DevOps", it: "Cloud & DevOps" },
    items: ["Supabase", "Firebase", "AWS", "GitHub Actions", "Jenkins"],
  },
  {
    name: { en: "AI & Data", it: "AI & Dati" },
    items: ["Claude Code", "Codex", "TensorFlow", "Scikit-learn", "Pandas"],
  },
];

export const experiences: Experience[] = [
  {
    role: { en: "Frontend Team Leader", it: "Frontend Team Leader" },
    company: "Bitrock",
    period: "2023 —",
    description: {
      en: "Leading 5 developers on a large enterprise booking system built from independent React micro-frontends. Built a full-stack vehicle fleet management app with Next.js and Supabase, and Sonarflow — an AI-powered framework that fixes SonarQube issues automatically.",
      it: "Guido 5 sviluppatori su un sistema di booking enterprise costruito con micro-frontend React indipendenti. Ho realizzato un'app full-stack per la gestione di flotte veicoli con Next.js e Supabase, e Sonarflow — un framework AI che risolve automaticamente gli issue SonarQube.",
    },
  },
  {
    role: { en: "Data Scientist", it: "Data Scientist" },
    company: "Infodati",
    period: "2022 — 2023",
    description: {
      en: "Predicted customer scores and opportunity outcomes with Python and machine learning, integrating the models inside the Qlik ecosystem.",
      it: "Previsione di customer score ed esiti delle opportunità con Python e machine learning, integrando i modelli nell'ecosistema Qlik.",
    },
  },
  {
    role: { en: "R&D Full-Stack Developer", it: "Sviluppatore Full-Stack R&D" },
    company: "Namirial",
    period: "2021 — 2022",
    description: {
      en: "Cross-platform applications with Vue 3, Electron and .NET 6 — a digital signature application and a license manager. Agile Scrum.",
      it: "Applicazioni cross-platform con Vue 3, Electron e .NET 6 — un'applicazione di firma digitale e un license manager. Agile Scrum.",
    },
  },
  {
    role: {
      en: "Full-Stack Developer & Database Manager",
      it: "Sviluppatore Full-Stack & Database Manager",
    },
    company: "Reply S.p.A — Cluster & Core Financial Services",
    period: "2019 — 2021",
    description: {
      en: "Angular on the frontend, Java microservices on the backend, Oracle and MySQL underneath.",
      it: "Angular sul frontend, microservizi Java sul backend, Oracle e MySQL sotto.",
    },
  },
];

/**
 * Section render order, and the anchor ids the nav points at. `journal` is the
 * detached band between Work and Stack — it carries no section number, which is
 * why the numbered sections still read 01 → 05.
 */
export const sectionOrder = [
  "hero",
  "channel",
  "work",
  "journal",
  "stack",
  "path",
  "profile",
] as const;

export type SectionId = (typeof sectionOrder)[number];
