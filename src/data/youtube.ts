/**
 * YouTube channel data — the static fallback.
 *
 * The channel RSS feed sends no CORS headers, so the browser cannot read it.
 * The live copy comes from the backend instead (GET /v1/youtube, refreshed
 * every 15 min, read through `useChannelData` in `src/lib/youtubeLive.ts`);
 * this file is what renders first and what stays on screen if that call fails.
 * Regenerate it with `npm run fetch:youtube` (RSS feed + channel about page).
 */

export interface Video {
  id: string;
  title: string;
  publishedAt: string;
}

export const channel = {
  id: "UCp-6Cv5ksm2mY-xLJqvLVKw",
  handle: "@davideghi",
  url: "https://www.youtube.com/channel/UCp-6Cv5ksm2mY-xLJqvLVKw",
  subscribers: 212,
  videoCount: 52,
};

export const thumbnailUrl = (id: string, quality: "hq" | "maxres" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${quality === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** Latest videos, newest first. */
export const videos: Video[] = [
  {
    "id": "ODXsaA_UhxA",
    "title": "Lego 2.0: Claude Code genera le istruzioni in 3d per la mia tastiera custom",
    "publishedAt": "2026-10-12"
  },
  {
    "id": "r_bNd7V3wYs",
    "title": "Fino a ieri ero una breadboard. Adesso parlo. ⌨️🔊",
    "publishedAt": "2026-10-10"
  },
  {
    "id": "lLebkmYWYPc",
    "title": "\"Sorry, Claude can't do this\" — so Claude Code built it in 7:40 for $3.72",
    "publishedAt": "2026-10-09"
  },
  {
    "id": "T2EEUZtG5Fk",
    "title": "Il corriere lancia il pacco, ma dentro c'è la tua tastiera custom 📦⌨️",
    "publishedAt": "2026-10-09"
  },
  {
    "id": "kGj5I7xX7cw",
    "title": "keybordy MP: full custom macropad that listens | Teaser",
    "publishedAt": "2026-10-08"
  },
  {
    "id": "2fRQfnD6epE",
    "title": "keybordy mp: building a macropad that listens",
    "publishedAt": "2026-10-08"
  },
  {
    "id": "4dFPQwh95_o",
    "title": "Custom Keyboard con ESP32: Saldatura in live + Simulatore Hardware",
    "publishedAt": "2026-10-07"
  },
  {
    "id": "6N5R-YSJrG4",
    "title": "Autocratico: la burocrazia semplificata dall'AI",
    "publishedAt": "2026-10-03"
  },
  {
    "id": "G0JiXB4-XiA",
    "title": "HOMELAB da ZERO: NAS + Mini PC Ryzen 5 7640HS | Server, Docker e AI in casa [LIVE]",
    "publishedAt": "2026-10-02"
  },
  {
    "id": "iwr_Yv30m2g",
    "title": "riddle: a Tom Riddle diary for the reMarkable",
    "publishedAt": "2026-09-28"
  },
  {
    "id": "bHsGNG2BZPE",
    "title": "Tom Riddle Diary: reMarkable + AI",
    "publishedAt": "2026-09-26"
  },
  {
    "id": "P9OFJRKhpRU",
    "title": "Ho CREATO un Brick da 65€ con AI e una Stampante 3D (costa il 99% in meno)",
    "publishedAt": "2026-09-23"
  },
  {
    "id": "6p0ZLsQtJHM",
    "title": "Rinascimento Artificiale: come usare l'AI per migliorarsi",
    "publishedAt": "2026-09-06"
  },
  {
    "id": "jJuME3i6QAI",
    "title": "Rinascimento Artificiale: un nuovo approccio",
    "publishedAt": "2026-09-05"
  },
  {
    "id": "gW0i5VYqeFQ",
    "title": "Da grandi poteri derivano troppi progetti: effetti di 1 anno di lavoro con l'AI",
    "publishedAt": "2026-08-14"
  }
];
