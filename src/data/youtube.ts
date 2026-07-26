/**
 * YouTube channel data.
 *
 * Static on purpose: the channel RSS feed sends no CORS headers, so it cannot be
 * fetched from the browser. Regenerate with `npm run fetch:youtube`
 * (reads https://www.youtube.com/feeds/videos.xml?channel_id=<CHANNEL_ID>).
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
  subscribers: 181,
  videoCount: 34,
};

export const thumbnailUrl = (id: string, quality: "hq" | "maxres" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${quality === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** Latest videos, newest first. */
export const videos: Video[] = [
  {
    "id": "pMzN-o7wNlQ",
    "title": "Claude Opus 5: Il Profeta x Il Clone",
    "publishedAt": "2026-07-24"
  },
  {
    "id": "t0wFRl-Re5g",
    "title": "Profetico: Claude Opus 5",
    "publishedAt": "2026-07-22"
  },
  {
    "id": "9E1Y0Ry7E3s",
    "title": "Sharp \"Mega Saas\": AI Maxxing SOL + FABLE + GROK 4.5 + KIMI K3 + Gemini 3.6",
    "publishedAt": "2026-07-22"
  },
  {
    "id": "3EoE9hhYDwM",
    "title": "token saving maxxing",
    "publishedAt": "2026-07-22"
  },
  {
    "id": "qYqGsOKy40w",
    "title": "Fable+Sol = Sharp. Rimpiazzo Slack + Notion + Excalidraw (claude & codex)",
    "publishedAt": "2026-07-16"
  },
  {
    "id": "i5Yqx-ZIwjQ",
    "title": "Guida (semplicissima) per iniziare a sviluppare con l'AI",
    "publishedAt": "2026-07-13"
  },
  {
    "id": "LIvW0-c-kUI",
    "title": "Costruiamo un Personal Knowledge System con Fable (ultime ore 🚨)",
    "publishedAt": "2026-07-08"
  },
  {
    "id": "u5c2djqwOPU",
    "title": "Live 3D Game Fable 5: Qualcosa non va... #000",
    "publishedAt": "2026-07-05"
  },
  {
    "id": "6JAmrUIjDM0",
    "title": "VPS + Dokploy con Claude Code: Addio Vercel & Supabase",
    "publishedAt": "2026-07-04"
  },
  {
    "id": "UwMhqq9Evxk",
    "title": "Spingiamo Fable 5 al limite: creazione 3D + game dev LIVE",
    "publishedAt": "2026-07-03"
  },
  {
    "id": "LdvKveiykjg",
    "title": "Claude Art Online - Teaser (Fable 5 x Blender)",
    "publishedAt": "2026-07-02"
  },
  {
    "id": "-XmrA0TF__U",
    "title": "Come pubblicare la tua web app FREE + FAST + EASY",
    "publishedAt": "2026-07-01"
  },
  {
    "id": "_tx5HibNMW4",
    "title": "Fable 5 Ritorna! Ah si, c'è anche Sonnet 5... #claudecode #fable5 #anthropic",
    "publishedAt": "2026-07-01"
  },
  {
    "id": "ubpckz1sTLY",
    "title": "Claude Code Live: Stripe + Dominio per il mio Saas!",
    "publishedAt": "2026-07-01"
  },
  {
    "id": "WbqnLcVT3cE",
    "title": "Sviluppo e Pubblico GRATIS una webapp (Saas) da zero usando Claude Code!",
    "publishedAt": "2026-06-28"
  }
];
