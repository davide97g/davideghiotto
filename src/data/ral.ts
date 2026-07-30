import type { Localized } from "@/data/content";

/**
 * Public RAL metadata (companies, dates, notes). Exact amounts live only on
 * the ral-gate service and are merged in after a verified session.
 */

export type RalCompanyId = "reply" | "namirial" | "infodati" | "bitrock";

/** How the official mark is framed on the dark canvas. */
export type RalLogoTreatment = "round-white" | "round" | "raw";

export interface RalCompany {
  id: RalCompanyId;
  name: string;
  /** Short mark shown in HUD chrome when the logo isn't used. */
  mark: string;
  /** Accent used for bands, dots and legend chips — pulled from the official mark. */
  color: string;
  /** Official logo under `/public/logos`. */
  logo: string;
  /** Framing treatment — shapes differ per brand. */
  logoTreatment: RalLogoTreatment;
  /** Inclusive tenure on the chart (ISO month). */
  from: string;
  /** Exclusive end — null means still current. */
  to: string | null;
  /**
   * Optional CV-facing labels when chart tenure differs slightly
   * (e.g. first RAL bump before the official start month).
   */
  displayFrom?: string;
  displayTo?: string | null;
  role: Localized;
}

export interface RalBump {
  id: string;
  /** ISO date at the start of the month the bump landed. */
  date: string;
  /** Gross annual RAL in euros — only present after a verified unlock. */
  amount?: number;
  companyId: RalCompanyId;
  note?: Localized;
}

export interface RalUnlockedData {
  bumps: Array<{
    id: string;
    date: string;
    amount: number;
    companyId: RalCompanyId;
    note: Localized;
  }>;
  current: { amount: number; companyId: RalCompanyId; date: string };
  first: { amount: number; companyId: RalCompanyId; date: string };
  delta: number;
  multiplier: number;
}

/**
 * Employers in chronological order — tenure matches the CV (July 2026).
 * Logo treatments match each mark's shape; colours are sampled from the assets.
 * Note: Infodati (Apr 2022) overlaps Namirial's last months (to Sep 2022) as on the CV.
 */
export const ralCompanies: RalCompany[] = [
  {
    id: "reply",
    name: "Reply",
    mark: "RP",
    color: "#00CC48",
    logo: "/logos/reply.png",
    logoTreatment: "round-white",
    from: "2019-09",
    to: "2021-10",
    displayFrom: "2019-11",
    displayTo: "2021-10",
    role: {
      en: "Full-Stack Developer & Database Manager",
      it: "Sviluppatore Full-Stack & Database Manager",
    },
  },
  {
    id: "namirial",
    name: "Namirial",
    mark: "NM",
    color: "#E8E8E8",
    logo: "/logos/namirial.png",
    logoTreatment: "round",
    from: "2021-10",
    to: "2022-09",
    displayFrom: "2021-10",
    displayTo: "2022-09",
    role: {
      en: "R&D Full-Stack Developer",
      it: "Sviluppatore Full-Stack R&D",
    },
  },
  {
    id: "infodati",
    name: "Infodati",
    mark: "ID",
    color: "#FC0078",
    logo: "/logos/infodati.png",
    logoTreatment: "raw",
    from: "2022-04",
    to: "2023-02",
    displayFrom: "2022-04",
    displayTo: "2023-02",
    role: {
      en: "Data Scientist",
      it: "Data Scientist",
    },
  },
  {
    id: "bitrock",
    name: "Bitrock",
    mark: "BR",
    color: "#E46000",
    logo: "/logos/bitrock.png",
    logoTreatment: "round-white",
    from: "2023-03",
    to: null,
    displayFrom: "2023-03",
    displayTo: null,
    role: {
      en: "Frontend Team Leader",
      it: "Frontend Team Leader",
    },
  },
];

/** Public bump skeleton — dates + companies only, no amounts. */
export const ralBumps: RalBump[] = [
  {
    id: "reply-22",
    date: "2019-09-01",
    companyId: "reply",
    note: { en: "Entry offer", it: "Offerta d'ingresso" },
  },
  {
    id: "reply-25",
    date: "2020-01-01",
    companyId: "reply",
    note: { en: "First bump", it: "Primo aumento" },
  },
  {
    id: "reply-27",
    date: "2020-09-01",
    companyId: "reply",
    note: { en: "Year-one review", it: "Review del primo anno" },
  },
  {
    id: "namirial-30",
    date: "2021-10-01",
    companyId: "namirial",
    note: { en: "Move to Namirial", it: "Passaggio a Namirial" },
  },
  {
    id: "infodati-35",
    date: "2022-09-01",
    companyId: "infodati",
    note: { en: "Move to Infodati", it: "Passaggio a Infodati" },
  },
  {
    id: "bitrock-38",
    date: "2023-03-01",
    companyId: "bitrock",
    note: { en: "Join Bitrock", it: "Ingresso in Bitrock" },
  },
  {
    id: "bitrock-41",
    date: "2024-07-01",
    companyId: "bitrock",
    note: { en: "Mid-cycle review", it: "Review di metà ciclo" },
  },
  {
    id: "bitrock-44",
    date: "2025-07-01",
    companyId: "bitrock",
    note: { en: "Current RAL", it: "RAL attuale" },
  },
];

export const companyById = Object.fromEntries(
  ralCompanies.map((c) => [c.id, c])
) as Record<RalCompanyId, RalCompany>;

/** Merge server amounts onto the public skeleton. */
export function mergeRalAmounts(
  skeleton: RalBump[],
  data: RalUnlockedData
): RalBump[] {
  const byId = new Map(data.bumps.map((b) => [b.id, b]));
  return skeleton.map((bump) => {
    const remote = byId.get(bump.id);
    if (!remote) return bump;
    return {
      ...bump,
      amount: remote.amount,
      note: remote.note ?? bump.note,
      companyId: remote.companyId,
      date: remote.date,
    };
  });
}

export function formatRal(amount: number, lang: "en" | "it"): string {
  return new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRalShort(amount: number): string {
  return `€${Math.round(amount / 1000)}k`;
}

/** Month label for chart ticks — keeps the axis readable without overcrowding. */
export function formatRalMonth(iso: string, lang: "en" | "it"): string {
  const d = new Date(iso.length === 7 ? `${iso}-01` : iso);
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-US", {
    month: "short",
    year: "2-digit",
  }).format(d);
}
