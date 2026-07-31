import type { Localized } from "@/data/content";
import { ui } from "@/data/content";

export type LegalDocId = "privacy" | "cookies";

export const legalDocs: Record<
  LegalDocId,
  { title: Localized; updated: string }
> = {
  privacy: {
    title: ui.legal.privacyTitle,
    updated: "2026-07-31",
  },
  cookies: {
    title: ui.legal.cookiesTitle,
    updated: "2026-07-31",
  },
};

const bodyLoaders = Object.fromEntries(
  Object.entries(
    import.meta.glob("../content/legal/*.md", {
      query: "?raw",
      import: "default",
    }) as Record<string, () => Promise<string>>
  ).map(([path, load]) => [path.replace(/^.*\/(.+)\.md$/, "$1"), load])
);

export const hasLegalBody = (id: LegalDocId, lang: string): boolean =>
  `${id}.${lang}` in bodyLoaders;

export const loadLegalBody = async (
  id: LegalDocId,
  lang: string
): Promise<string> => (await bodyLoaders[`${id}.${lang}`]?.()) ?? "";
