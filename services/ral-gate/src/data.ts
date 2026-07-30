/**
 * Private RAL figures — never ship these in the portfolio bundle.
 * Keep in sync with the CV / disclosure history.
 */
export interface RalBumpRecord {
  id: string;
  date: string;
  amount: number;
  companyId: "reply" | "namirial" | "infodati" | "bitrock";
  note: { en: string; it: string };
}

export const ralBumps: RalBumpRecord[] = [
  {
    id: "reply-22",
    date: "2019-09-01",
    amount: 22_000,
    companyId: "reply",
    note: { en: "Entry offer", it: "Offerta d'ingresso" },
  },
  {
    id: "reply-25",
    date: "2020-01-01",
    amount: 25_000,
    companyId: "reply",
    note: { en: "First bump", it: "Primo aumento" },
  },
  {
    id: "reply-27",
    date: "2020-09-01",
    amount: 27_000,
    companyId: "reply",
    note: { en: "Year-one review", it: "Review del primo anno" },
  },
  {
    id: "namirial-30",
    date: "2021-10-01",
    amount: 30_000,
    companyId: "namirial",
    note: { en: "Move to Namirial", it: "Passaggio a Namirial" },
  },
  {
    id: "infodati-35",
    date: "2022-09-01",
    amount: 35_000,
    companyId: "infodati",
    note: { en: "Move to Infodati", it: "Passaggio a Infodati" },
  },
  {
    id: "bitrock-38",
    date: "2023-03-01",
    amount: 38_000,
    companyId: "bitrock",
    note: { en: "Join Bitrock", it: "Ingresso in Bitrock" },
  },
  {
    id: "bitrock-41",
    date: "2024-07-01",
    amount: 41_000,
    companyId: "bitrock",
    note: { en: "Mid-cycle review", it: "Review di metà ciclo" },
  },
  {
    id: "bitrock-44",
    date: "2025-07-01",
    amount: 44_000,
    companyId: "bitrock",
    note: { en: "Current RAL", it: "RAL attuale" },
  },
];

export function getRalPayload() {
  const first = ralBumps[0];
  const current = ralBumps[ralBumps.length - 1];
  return {
    bumps: ralBumps.map((b) => ({
      id: b.id,
      date: b.date,
      amount: b.amount,
      companyId: b.companyId,
      note: b.note,
    })),
    current: { amount: current.amount, companyId: current.companyId, date: current.date },
    first: { amount: first.amount, companyId: first.companyId, date: first.date },
    delta: current.amount - first.amount,
    multiplier: current.amount / first.amount,
  };
}
