import { bio, type Localized } from "@/data/content";
import { channel } from "@/data/youtube";

/**
 * Journal posts.
 *
 * Bodies are markdown files under `src/content/journal/<slug>.<lang>.md`, loaded on
 * demand by the glob below — adding a post means adding both language files and one
 * entry to `journalPosts`. `src/data/journal.test.ts` fails if a language file is
 * missing, so a half-translated post can't ship.
 */
export interface JournalPost {
  slug: string;
  /** ISO date; formatted per-language at render time. */
  date: string;
  title: Localized;
  excerpt: Localized;
  tags: string[];
  /** YouTube id the post is anchored to — used for the header thumbnail. */
  video: string;
  /** Where it was also published, once it is cross-posted. */
  crossPost?: { platform: JournalPlatformId; url: string };
}

export type JournalPlatformId = "linkedin" | "youtube" | "github" | "site";

export interface JournalPlatform {
  id: JournalPlatformId;
  name: string;
  handle: string;
  url: string;
  focus: Localized;
}

/** Newest first — this is the order the journal band renders. */
export const journalPosts: JournalPost[] = [
  {
    slug: "ho-staccato-tutto",
    date: "2026-07-26",
    title: {
      en: "I detached everything: Vercel, Supabase, Clerk",
      it: "Ho staccato tutto: Vercel, Supabase, Clerk",
    },
    excerpt: {
      en: "One VPS, one docker-compose, Traefik in front, Better Auth instead of Clerk — and what self-hosting actually costs you in exchange.",
      it: "Una VPS, un docker-compose, Traefik davanti, Better Auth invece di Clerk — e cosa ti costa davvero il self-hosting in cambio.",
    },
    tags: ["Self-hosting", "Docker", "VPS"],
    video: "6JAmrUIjDM0",
  },
  {
    slug: "il-costo-non-e-il-prezzo-del-token",
    date: "2026-07-26",
    title: {
      en: "The cost is not the price of a token",
      it: "Il costo non è il prezzo del token",
    },
    excerpt: {
      en: "Sonnet 5 is cheaper per token and still cost me more: 15 subagents, a saturated context, a million tokens. What I measure instead.",
      it: "Sonnet 5 costa meno per token e mi è costato di più: 15 subagent, contesto saturo, un milione di token. Cosa misuro al suo posto.",
    },
    tags: ["Token efficiency", "Agents", "LLM cost"],
    video: "_tx5HibNMW4",
  },
  {
    slug: "orchestratore-non-scrive-codice",
    date: "2026-07-26",
    title: {
      en: "The orchestrator doesn't write code",
      it: "L'orchestratore non scrive codice",
    },
    excerpt: {
      en: "Fable plans and dispatches, Codex executes, Grok takes the routine UI. Isolated subagents burn more raw tokens and cost less — here's why.",
      it: "Fable pianifica e dispaccia, Codex esegue, Grok prende la UI di routine. I subagent isolati bruciano più token grezzi e costano meno: ecco perché.",
    },
    tags: ["Orchestration", "Context", "Delegation"],
    video: "LIvW0-c-kUI",
  },
  {
    slug: "riusare-batte-rigenerare",
    date: "2026-07-26",
    title: {
      en: "Reuse beats regeneration",
      it: "Riusare batte rigenerare",
    },
    excerpt: {
      en: "Generating from scratch produces slop and costs the most. Affine's backend, AppFlowy and tldraw got me a real-time product in one session.",
      it: "Generare da zero produce slop ed è la cosa più costosa. Il backend di Affine, AppFlowy e tldraw mi hanno dato un prodotto real-time in una sessione.",
    },
    tags: ["Open source", "References", "Design"],
    video: "qYqGsOKy40w",
  },
  {
    slug: "ho-smesso-di-scrivere-codice",
    date: "2026-07-26",
    title: {
      en: "I stopped writing code in December",
      it: "Ho smesso di scrivere codice a dicembre",
    },
    excerpt: {
      en: "Copilot, Cursor, September, December — the four steps that took me from typing code to directing it, and why that's 0 to 1, not 10 to 12.",
      it: "Copilot, Cursor, settembre, dicembre — i quattro passi che mi hanno portato dallo scrivere codice al dirigerlo, e perché è da 0 a 1, non da 10 a 12.",
    },
    tags: ["Career", "Developer role", "Agents"],
    video: "UwMhqq9Evxk",
  },
];

/**
 * Markdown body loaders, keyed `<slug>.<lang>`. Lazy on purpose: the bodies are the
 * heaviest part of the journal and the landing page never renders one, so they must
 * not ride in the main chunk.
 */
const bodyLoaders = Object.fromEntries(
  Object.entries(
    import.meta.glob("../content/journal/*.md", {
      query: "?raw",
      import: "default",
    }) as Record<string, () => Promise<string>>
  ).map(([path, load]) => [path.replace(/^.*\/(.+)\.md$/, "$1"), load])
);

export const hasBody = (slug: string, lang: string): boolean =>
  `${slug}.${lang}` in bodyLoaders;

export const loadPostBody = async (slug: string, lang: string): Promise<string> =>
  (await bodyLoaders[`${slug}.${lang}`]?.()) ?? "";

export const findPost = (slug?: string): JournalPost | undefined =>
  journalPosts.find((post) => post.slug === slug);

/** Rough reading time, on the usual 200-words-per-minute assumption. */
export const readingMinutes = (body: string): number =>
  Math.max(1, Math.round(body.split(/\s+/).length / 200));

/** Where the notes also get published, and what each channel carries. */
export const journalPlatforms: JournalPlatform[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: `/in/${bio.linkedin}`,
    url: `https://www.linkedin.com/in/${bio.linkedin}`,
    focus: {
      en: "Long-form notes on agents, architecture and team practice",
      it: "Note lunghe su agenti, architettura e pratica di team",
    },
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: channel.handle,
    url: channel.url,
    focus: {
      en: "The same thinking, live and unedited",
      it: "Gli stessi ragionamenti, in diretta e senza tagli",
    },
  },
  {
    id: "github",
    name: "GitHub",
    handle: `/${bio.github}`,
    url: `https://github.com/${bio.github}`,
    focus: {
      en: "Commits, prototypes and the code behind each note",
      it: "Commit, prototipi e il codice dietro ogni nota",
    },
  },
  {
    id: "site",
    name: "dacoder.it",
    handle: "/workshop",
    url: bio.workshop,
    focus: {
      en: "Open-source workshop and long-running experiments",
      it: "Laboratorio open-source ed esperimenti a lungo termine",
    },
  },
];
