import type { LangId } from "@/context/LanguageContext";
import { channel } from "@/data/youtube";

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

/** A YouTube cut a featured project links to. The first one is the trailer. */
export interface ProjectTrailer {
  id: string;
  title: Localized;
}

/** One cell of a featured project's spec strip. `accent` paints the value in the brand colour. */
export interface ProjectMeta {
  label: Localized;
  value: Localized;
  accent?: boolean;
}

/** A project in active development, rendered as a full `FeaturedProject` card. */
export interface FeaturedProjectEntry {
  id: string;
  name: string;
  logo: string;
  site: string;
  repo: string;
  /** Its own accent, swapped in for `--primary` inside the card. A complete colour. */
  brand: string;
  tagline: Localized;
  description: Localized;
  meta: ProjectMeta[];
  features: Localized[];
  stack: string[];
  trailers: ProjectTrailer[];
  /** 16:9-ish screenshots or renders, shown beside the trailer. */
  shots: ProjectShot[];
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
  instagram: "ai_quack",
  workshop: "https://dacoder.it",
  /** The design system this site wears — credited in the footer. */
  duckUi: "https://duckui.davideghiotto.it/",
};

export type SocialId = "linkedin" | "github" | "youtube" | "instagram" | "site";

export interface Social {
  id: SocialId;
  name: string;
  /** Mono short form shown beside the name — `/in/davide-ghiotto`, `@davideghi`. */
  handle: string;
  url: string;
}

/**
 * The places worth following, in the order every rail renders them.
 *
 * Single source of truth for the links: the left rail, the nav drawer, the hero
 * row and `journalPlatforms` in `src/data/journal.ts` all read this list, so a
 * changed handle only has to be changed here.
 */
export const socials: Social[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: `/in/${bio.linkedin}`,
    url: `https://www.linkedin.com/in/${bio.linkedin}`,
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: channel.handle,
    url: channel.url,
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: `@${bio.instagram}`,
    url: `https://www.instagram.com/${bio.instagram}/`,
  },
  {
    id: "github",
    name: "GitHub",
    handle: `/${bio.github}`,
    url: `https://github.com/${bio.github}`,
  },
  {
    id: "site",
    name: "dacoder.it",
    handle: "/workshop",
    url: bio.workshop,
  },
];

/** Every piece of chrome and copy the layout needs, in both languages. */
export const ui = {
  nav: {
    channel: { en: "Channel", it: "Canale" },
    work: { en: "Work", it: "Progetti" },
    prints: { en: "3D", it: "3D" },
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
  covers: {
    label: { en: "Manifesto", it: "Manifesto" },
    /** The headline before the struck word, one masked line per entry. */
    lines: {
      en: ["Ship it", "before it's"],
      it: ["Rilascialo", "prima che sia"],
    },
    /** Crossed out on scroll, then stamped over with `stamp`. */
    struck: { en: "perfect.", it: "perfetto." },
    stamp: { en: "Shipped.", it: "Fatto." },
    rules: {
      en: ["Perfect never shows up.", "Ship today, fix tomorrow.", "Done beats perfect. Always."],
      it: ["Il perfetto non arriva mai.", "Rilascia oggi, sistema domani.", "Fatto batte perfetto. Sempre."],
    },
    cover: { en: "Cover", it: "Copertina" },
    issue: { en: "Issue 10 · 2026", it: "Numero 10 · 2026" },
    hint: { en: "Tap a cover to open it", it: "Tocca una copertina per aprirla" },
    close: { en: "Close", it: "Chiudi" },
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
    featuredLabel: { en: "Building now", it: "In sviluppo" },
    featuresLabel: { en: "Inside", it: "Cosa contiene" },
    stackLabel: { en: "Built with", it: "Costruito con" },
    /** Followed by the project name: "Open Autocratico". */
    visit: { en: "Open", it: "Apri" },
    trailer: { en: "Watch the trailer", it: "Guarda il trailer" },
    alsoWatch: { en: "Also on YouTube", it: "Anche su YouTube" },
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
  prints: {
    label: { en: "3D prints", it: "Stampa 3D" },
    title: { en: "Designed in code, printed in PLA.", it: "Disegnati in codice, stampati in PLA." },
    lead: {
      en: "Parametric CAD, sliced for a Bambu Lab A1 and printed at home. Every model here is read live from its GitHub repo: push a new STL and it shows up.",
      it: "CAD parametrico, slicing per una Bambu Lab A1 e stampa a casa. Ogni modello qui è letto in tempo reale dal suo repo GitHub: pusho un nuovo STL e compare.",
    },
    projects: { en: "Projects", it: "Progetti" },
    parts: { en: "Parts", it: "Pezzi" },
    /** Counted: "1 part", "7 parts". */
    partCount: { en: ["part", "parts"], it: ["pezzo", "pezzi"] },
    filament: { en: "Filament", it: "Filamento" },
    size: { en: "Size", it: "Ingombro" },
    triangles: { en: "Triangles", it: "Triangoli" },
    file: { en: "File", it: "File" },
    updated: { en: "Updated", it: "Aggiornato" },
    source: { en: "Open on GitHub", it: "Apri su GitHub" },
    download: { en: "Download", it: "Scarica" },
    hint: { en: "Drag to rotate", it: "Trascina per ruotare" },
    loading: { en: "Loading model", it: "Carico il modello" },
    heavy: { en: "Large file", it: "File pesante" },
    load: { en: "Load", it: "Carica" },
    error: { en: "This model did not load.", it: "Il modello non si è caricato." },
    retry: { en: "Retry", it: "Riprova" },
    unsupported: {
      en: "This browser cannot draw WebGL, so the model stays a download.",
      it: "Questo browser non disegna WebGL, quindi il modello resta un download.",
    },
    emptyLabel: { en: "Bed clear · 0 parts", it: "Piatto libero · 0 pezzi" },
    empty: {
      en: "First prints are still on the bed.",
      it: "Le prime stampe sono ancora sul piatto.",
    },
    emptyHint: {
      en: "Every model here is pulled straight from GitHub, so the next push lands on this plate. Until then, the CAD is in the repos.",
      it: "Ogni modello qui arriva direttamente da GitHub, quindi il prossimo push finisce su questo piatto. Nel frattempo il CAD è nei repo.",
    },
    emptyAction: { en: "Browse the repos", it: "Sfoglia i repo" },
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
    privacy: { en: "Privacy", it: "Privacy" },
    cookies: { en: "Cookies", it: "Cookie" },
    manageCookies: { en: "Manage cookies", it: "Gestisci i cookie" },
    duckUi: { en: "Made with", it: "Realizzato con" },
  },
  cookies: {
    bannerTitle: { en: "Cookies on this site", it: "Cookie su questo sito" },
    bannerBody: {
      en: "I use necessary storage to run the site and optional analytics (Google Analytics 4) only if you agree. No ads.",
      it: "Uso storage necessario per far funzionare il sito e analytics opzionali (Google Analytics 4) solo se accetti. Niente pubblicità.",
    },
    acceptAll: { en: "Accept all", it: "Accetta tutti" },
    rejectAll: { en: "Reject all", it: "Rifiuta tutti" },
    customize: { en: "Customize", it: "Personalizza" },
    cookiePolicy: { en: "Cookie policy", it: "Cookie policy" },
    privacyPolicy: { en: "Privacy policy", it: "Privacy policy" },
    prefsTitle: { en: "Cookie preferences", it: "Preferenze cookie" },
    prefsLead: {
      en: "Choose which optional technologies to allow. You can change this anytime from the footer.",
      it: "Scegli quali tecnologie opzionali consentire. Puoi cambiare in qualsiasi momento dal footer.",
    },
    necessaryLabel: { en: "Necessary", it: "Necessari" },
    necessaryDesc: {
      en: "Language preference and RAL unlock session. Required for the site to work as you use it.",
      it: "Preferenza lingua e sessione di sblocco RAL. Necessari perché il sito funzioni come lo usi.",
    },
    analyticsLabel: { en: "Analytics", it: "Analytics" },
    analyticsDesc: {
      en: "Google Analytics 4 measures visits and interactions. Loads only with your consent.",
      it: "Google Analytics 4 misura visite e interazioni. Si carica solo con il tuo consenso.",
    },
    save: { en: "Save preferences", it: "Salva preferenze" },
    cancel: { en: "Cancel", it: "Annulla" },
  },
  legal: {
    privacyTitle: { en: "Privacy policy", it: "Informativa privacy" },
    cookiesTitle: { en: "Cookie policy", it: "Cookie policy" },
    updated: { en: "Last updated", it: "Ultimo aggiornamento" },
    back: { en: "Back home", it: "Torna alla home" },
  },
  lang: {
    label: { en: "Language", it: "Lingua" },
  },
  social: {
    /** Vertical label on the left rail, and the accessible name of every set. */
    label: { en: "Elsewhere", it: "Altrove" },
    /** The Instagram-style badge beside the hero links and on the journal rail. */
    follow: { en: "Follow", it: "Segui" },
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
 * The magazine cover dealt in the manifesto opener. The Italian poster that
 * used to sit beside it is the home page backdrop now, so it is not dealt.
 * Encoded from the master in `drafts/covers/` (frame cropped, 48px a side) to
 * `public/cover-<id>-{640,1200}.avif` plus a `-900.jpg` fallback.
 */
export const cover = {
  id: "commit-en",
  lang: "en" as LangId,
  src: "/cover-commit-en",
  title: { en: "The Daily Commit", it: "The Daily Commit" },
  alt: {
    en: "Magazine cover 'The Daily Commit': Davide holding a newspaper headlined 'Shipped.' while pages fly around him.",
    it: "Copertina di rivista 'The Daily Commit': Davide regge un giornale con il titolo 'Shipped.' mentre le pagine volano intorno a lui.",
  },
};

/**
 * The projects in active development, each a full card at the top of Work, in
 * render order. Copy, feature lists and specs mirror each project's README and
 * landing page; each mark is the project's own favicon in public/.
 *
 * sharp held the first slot until it stopped being self-hosted; it is in git
 * history if it comes back.
 */
export const featuredProjects: FeaturedProjectEntry[] = [
  {
    id: "autocratico",
    name: "Autocratico",
    logo: "/autocratico.svg",
    site: "https://autocratico.it/",
    repo: "https://github.com/davide97g/autocratico",
    // Autocratico ships monochrome: its accent is off-white.
    brand: "oklch(0.93 0 0)",
    tagline: {
      en: "The private register for your Italian bureaucracy.",
      it: "Il registro privato della tua burocrazia.",
    },
    description: {
      en: "Deadlines, payments, checks and cases, kept in plain-text files and shown in a web app you install on phone and desktop. An always-on Claude Code agent files whatever arrives — Gmail, forwarded PEC, photos, Telegram messages, WhatsApp exports — updates the deadlines, opens the cases and pings you on Telegram. Every change it makes is a git commit you can undo.",
      it: "Scadenze, pagamenti, controlli e pratiche, tenuti in file di testo e mostrati in una web app da installare su telefono e desktop. Un agente Claude Code sempre acceso archivia tutto quello che arriva — Gmail, PEC inoltrate, foto, messaggi Telegram, export di WhatsApp — aggiorna le scadenze, apre le pratiche e ti avvisa su Telegram. Ogni modifica è un commit git che puoi annullare.",
    },
    meta: [
      { label: { en: "Version", it: "Versione" }, value: { en: "v0.1.0", it: "v0.1.0" } },
      { label: { en: "License", it: "Licenza" }, value: { en: "MIT", it: "MIT" } },
      { label: { en: "Price", it: "Prezzo" }, value: { en: "€0", it: "€0" }, accent: true },
    ],
    features: [
      {
        en: "One inbox for everything: several Gmail accounts, PEC, photos, PDFs, voice notes, WhatsApp exports",
        it: "Un'inbox per tutto: più account Gmail, PEC, foto, PDF, note vocali, export di WhatsApp",
      },
      {
        en: "Always-on agent (Claude Code, headless) that files each item in about a minute",
        it: "Agente sempre acceso (Claude Code headless) che archivia ogni documento in circa un minuto",
      },
      {
        en: "Every change is a git commit, reviewed and undone from the Activity log",
        it: "Ogni modifica è un commit git, da rivedere e annullare nel registro Attività",
      },
      {
        en: "Deadlines coloured by urgency, recurring ones expanded, .ics export for any calendar",
        it: "Scadenze colorate per urgenza, ricorrenze espanse, export .ics per qualsiasi calendario",
      },
      {
        en: "Telegram reminders at 7 and 3 days, with personal data masked",
        it: "Promemoria Telegram a 7 e a 3 giorni, con i dati personali oscurati",
      },
      {
        en: "Chat with Claude over your own files, from the app, ⌘K or Telegram",
        it: "Chat con Claude sui tuoi file, dall'app, da ⌘K o da Telegram",
      },
      {
        en: "No database: plain-text files on your own server, and a privacy mode for demos",
        it: "Nessun database: file di testo sul tuo server, e una modalità privacy per le demo",
      },
    ],
    stack: ["React 19", "Vite", "Tailwind v4", "Hono", "Node 24", "Python", "Claude Code", "PWA"],
    trailers: [
      {
        id: "6N5R-YSJrG4",
        title: {
          en: "Autocratico: Italian bureaucracy, simplified by AI",
          it: "Autocratico: la burocrazia semplificata dall'AI",
        },
      },
    ],
    shots: [
      {
        avif: "/shot-autocratico-overview.avif",
        fallback: "/shot-autocratico-overview.jpg",
        alt: {
          en: "Autocratico overview: a six-month calendar of deadlines by area, and a dark panel of what is still to pay.",
          it: "Panoramica di Autocratico: calendario a sei mesi delle scadenze per ambito, e un pannello scuro con quello che resta da pagare.",
        },
      },
      {
        avif: "/shot-autocratico-inbox.avif",
        fallback: "/shot-autocratico-inbox.jpg",
        alt: {
          en: "Autocratico inbox: documents arriving from email, Telegram and uploads, each already filed by the agent, one flagged as phishing.",
          it: "Inbox di Autocratico: documenti arrivati da email, Telegram e caricamenti, ognuno già archiviato dall'agente, uno segnalato come phishing.",
        },
      },
    ],
  },
  {
    id: "keybordy-mp",
    name: "keybordy MP",
    logo: "/keybordy.svg",
    site: "https://keybordy.davideghiotto.it/",
    repo: "https://github.com/davide97g/keybordy",
    // The landing page lime, a touch yellower than the site one.
    brand: "#d6ff1f",
    tagline: {
      en: "A macropad that listens.",
      it: "Una macropad che ti ascolta.",
    },
    description: {
      en: "An ESP32-S3 macropad I am designing, 3D-printing and assembling by hand: 22 hot-swap MX keys, three clicky knobs, a white OLED that names each key's action as you press it, and a green push-to-talk bar. Hold it and talk: the audio goes to the Mac, which transcribes it and works out the answer, and keybordy says it back from its own speaker.",
      it: "Una macropad ESP32-S3 che sto progettando, stampando in 3D e montando a mano: 22 switch MX hot-swap, tre manopole a scatti, un OLED bianco che dice cosa fa ogni tasto mentre lo premi e una barra verde push-to-talk. La tieni premuta e parli: l'audio va al Mac, che trascrive e pensa la risposta, e keybordy la dice dal suo speaker.",
    },
    meta: [
      { label: { en: "MCU", it: "MCU" }, value: { en: "ESP32-S3", it: "ESP32-S3" } },
      { label: { en: "Keys", it: "Tasti" }, value: { en: "22 + 3 knobs", it: "22 + 3 manopole" } },
      { label: { en: "Status", it: "Stato" }, value: { en: "On the bench", it: "Sul banco" }, accent: true },
    ],
    features: [
      {
        en: "22 hot-swap MX keys in three sizes (1u, 1.5u, 2u), legends are just K numbers",
        it: "22 switch MX hot-swap in tre misure (1u, 1,5u, 2u), sui tasti solo il numero K",
      },
      {
        en: "Three 24-detent push encoders for volume, scroll, brightness, or whatever you map",
        it: "Tre encoder a 24 scatti con pulsante: volume, scroll, luminosità o quello che vuoi",
      },
      {
        en: "White 2.42\" OLED that names each key's action on every press",
        it: "OLED bianco da 2,42\" che mostra l'azione di ogni tasto a ogni pressione",
      },
      {
        en: "Push-to-talk bar: I2S mic with a hardware kill switch, a speaker for sounds and speech",
        it: "Barra push-to-talk: microfono I2S con interruttore hardware, speaker per suoni e voce",
      },
      {
        en: "USB-C or LiPo, wired as USB HID or over Bluetooth LE",
        it: "USB-C o LiPo, via cavo come HID USB o in Bluetooth LE",
      },
      {
        en: "Custom PCB assembled by JLCPCB, case printed in one piece on a Bambu Lab A1",
        it: "PCB custom assemblato da JLCPCB, case stampato in un pezzo solo su una Bambu Lab A1",
      },
      {
        en: "Keymap editor on the Mac: apps, shell commands, Shortcuts, keystrokes, media keys",
        it: "Editor della keymap sul Mac: app, comandi shell, Comandi rapidi, scorciatoie, tasti media",
      },
    ],
    stack: ["ESP32-S3", "Arduino C++", "KiCad", "three.js", "TypeScript", "Python", "Hammerspoon", "Bambu Lab A1"],
    trailers: [
      {
        id: "kGj5I7xX7cw",
        title: {
          en: "keybordy MP: full custom macropad that listens",
          it: "keybordy MP: la macropad custom che ti ascolta",
        },
      },
      {
        id: "2fRQfnD6epE",
        title: {
          en: "Building a macropad that listens",
          it: "Costruire una macropad che ti ascolta",
        },
      },
    ],
    shots: [
      {
        avif: "/shot-keybordy-mp-deck.avif",
        fallback: "/shot-keybordy-mp-deck.jpg",
        alt: {
          en: "keybordy MP rendered from its CAD: black case, white keycaps labelled with their actions, a green talk bar and three knobs.",
          it: "keybordy MP renderizzata dal CAD: case nero, tasti bianchi con le loro azioni, barra verde per parlare e tre manopole.",
        },
      },
      {
        avif: "/shot-keybordy-mp-oled.avif",
        fallback: "/shot-keybordy-mp-oled.jpg",
        alt: {
          en: "Close-up of the keybordy MP OLED reading MUTE above the keycaps, rendered from the CAD.",
          it: "Primo piano dell'OLED di keybordy MP con la scritta MUTE sopra i tasti, renderizzato dal CAD.",
        },
      },
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Calorico",
    description: {
      en: "A calorie and macro diary built around the products actually on Italian shelves. Every tracker sold here is an English database with a translation layer on top — search «fusilli Coop» and you get nothing — so this one starts from Open Food Facts filtered to Italy, private labels included, and fills the other half of the diary (raw chicken breast, cooked pasta, an apple) from CREA and BDA-IEO composition tables. Barcode scanning, a meal photo that comes back as food plus estimated grams, day/week/month analysis, weight trend and push reminders, in an installable PWA. Fastify and Drizzle over Postgres with trigram search, self-hosted on a VPS behind Dokploy.",
      it: "Contacalorie e diario dei macro costruito attorno ai prodotti che stanno davvero sugli scaffali italiani. Ogni app venduta qui è un database inglese con sopra uno strato di traduzione — cerchi «fusilli Coop» e non trovi niente — così questa parte da Open Food Facts filtrato sull'Italia, marche del supermercato incluse, e riempie l'altra metà del diario (petto di pollo crudo, pasta cotta, una mela) con le tabelle di composizione CREA e BDA-IEO. Scansione del codice a barre, foto del pasto che torna come alimenti più grammi stimati, analisi giorno/settimana/mese, andamento del peso e promemoria push, in una PWA installabile. Fastify e Drizzle su Postgres con ricerca trigram, self-hosted su VPS dietro Dokploy.",
    },
    tags: ["TypeScript", "Fastify", "Postgres", "PWA"],
    year: "2026 —",
    link: "https://calorico.davideghiotto.it/",
    badge: { en: "AGPL-3.0 · open source", it: "AGPL-3.0 · open source" },
    shot: {
      avif: "/shot-calorico.avif",
      fallback: "/shot-calorico.jpg",
      alt: {
        en: "Calorico: the daily diary, a search for «fusilli» returning supermarket brands, and the analysis tab",
        it: "Calorico: il diario del giorno, una ricerca «fusilli» che restituisce le marche del supermercato e la scheda Analisi",
      },
    },
  },
  {
    title: "Majestic",
    description: {
      en: "A hand-authored 2D world, where the world is data and the code only renders it: areas compiled into Tiled maps, one catalog of tilesets and brushes, kingdoms sliced from a single landmass file, and a narrative bible the NPCs are written against. A Rust server owns the content and the save state, a React + Phaser client owns none of it. Milestone one is single-player — walk Beown, talk to the people standing in it, gather and build the settlement — with the websocket scaffold already in place for when it stops being solo.",
      it: "Un mondo 2D scritto a mano, dove il mondo è dato e il codice lo disegna soltanto: aree compilate in mappe Tiled, un solo catalogo di tileset e pennelli, regni ritagliati da un unico file di continente e una bibbia narrativa su cui sono scritti gli NPC. Un server Rust possiede i contenuti e i salvataggi, il client React + Phaser non possiede niente. Il primo traguardo è single-player — girare Beown, parlare con chi ci vive, raccogliere e costruire l'insediamento — con lo scaffold websocket già pronto per quando non sarà più da soli.",
    },
    tags: ["Rust", "Phaser", "React", "Tiled"],
    year: "2026 —",
    badge: { en: "Not shipped yet", it: "Non ancora pubblicato" },
    shot: {
      avif: "/shot-majestic.avif",
      fallback: "/shot-majestic.jpg",
      alt: {
        en: "Majestic: the pixel-art town of Beown with named NPCs, the clock and season readout, and the minimap",
        it: "Majestic: la città pixel art di Beown con gli NPC nominati, orologio e stagione, e la minimappa",
      },
    },
  },
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
 * detached band between 3D prints and Stack — it carries no section number, which
 * is why the numbered sections still read 01 → 06.
 */
export const sectionOrder = [
  "covers",
  "hero",
  "channel",
  "work",
  "prints",
  "journal",
  "stack",
  "path",
  "profile",
] as const;

export type SectionId = (typeof sectionOrder)[number];
