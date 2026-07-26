# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is bun (see `bun.lockb`), but `npm`/`pnpm` work the same with `package.json` scripts.

- `npm run dev` — Vite dev server on port `8080` (host `::`, HMR overlay disabled in `vite.config.ts`).
- `npm run build` — production build to `dist/`.
- `npm run build:dev` — build with `mode=development` (keeps the `lovable-tagger` plugin enabled).
- `npm run lint` — ESLint over the whole repo (flat config in `eslint.config.js`; `dist` ignored, `@typescript-eslint/no-unused-vars` is off).
- `npm run test` — Vitest single run (jsdom env, setup at `src/test/setup.ts`).
- `npm run test:watch` — Vitest watch mode.
- Run one test file: `npx vitest run src/path/to/file.test.ts` (or `... -t "case name"` to filter by test name).
- `npm run fetch:youtube` — regenerates the `videos` array in `src/data/youtube.ts` from the channel RSS feed.
- `npm run preview` — preview the production build.

`@` resolves to `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).

## Architecture

Single-page personal portfolio (Vite + React 18 + TypeScript + Tailwind + shadcn-ui) with one fixed
visual identity — **terminal noir**: near-black canvas, off-white type, a single lime accent
(`#8CFF2E`), and tiny wide-tracked uppercase mono labels used as HUD chrome. There is no theme
switcher and no per-company deck; earlier versions had both and they were removed deliberately.

Two systems carry most of the design intent: **the scroll choreography** and **the bilingual copy layer**.

### Scroll choreography (GSAP + Lenis)

- `src/lib/gsap.ts` registers `ScrollTrigger`, `SplitText` and `useGSAP` once and exports them plus
  a `prefersReducedMotion()` helper. Import GSAP from here, never from `gsap` directly, so plugin
  registration can't be missed.
- `src/components/SmoothScroll.tsx` wraps the app in `ReactLenis root` and bridges Lenis to
  ScrollTrigger (`lenis.on("scroll", ScrollTrigger.update)` plus `gsap.ticker.add(lenis.raf)`).
  Without that bridge, pinned sections jitter. It also re-syncs ScrollTrigger after fonts load, on
  `window.load`, and after an initial `#hash` jump — otherwise a page opened deep-linked leaves
  reveals stuck at `opacity: 0`.
- `src/lib/scrollSignal.ts` is a mutable module singleton (`{ progress, velocity }`) written by the
  Lenis bridge and read inside rAF loops. It is intentionally **not** React state — these values
  change every frame and must never re-render.
- Reusable motion primitives live in `src/components/motion/`: `Reveal` (fade/lift children on
  enter), `SplitReveal` (masked line-by-line `SplitText` reveal, `autoSplit` so it survives resize
  and font swaps), `Marquee` (seamless double-track loop whose timescale is boosted by scroll
  velocity).
- Every animation branches through `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)`
  arm that sets the final state instead of animating. When adding motion, add that arm too —
  content must never be left invisible.

### Bilingual copy layer

- `src/context/LanguageContext.tsx` exposes `LangId = "en" | "it"` via `useLanguage()`, mirrored to
  `?lang=` in the URL, persisted to `localStorage`, and falling back to `navigator.language`. It also
  sets `<html lang>`.
- All copy lives in `src/data/content.ts` as `Localized<T> = Record<LangId, T>` values, read through
  the `t()` helper from `useLanguage()` (`t(ui.hero.lead)`). `src/data/content.test.ts` walks the
  whole tree and fails if any localized entry is missing a language, so adding English-only copy
  breaks the suite by design.
- `src/pages/Index.tsx` calls `ScrollTrigger.refresh()` when the language changes — swapping copy
  changes every text length, and pins and scrub ranges have to be re-measured.

### Content and sections

- `src/data/content.ts` holds `bio`, `ui` (all chrome strings), `summary`, `principles`,
  `marqueeTerms`, `featuredProject`, `projects`, `journalEntries`, `journalPlatforms`, `stackGroups`,
  `experiences`, and `sectionOrder`.
- `featuredProject` is the pinned lead project (currently **sharp**, the self-hosted Slack
  alternative). Its copy, version and feature list mirror the official landing page at
  sharp.davideghiotto.it, and its mark is that project's own favicon, stored at `public/sharp.svg`.
  `src/components/portfolio/FeaturedProject.tsx` renders it and locally overrides `--primary` with
  sharp's violet, so accent utilities inside the card adopt the project's brand instead of the site
  lime. That local-override trick is the pattern to follow for any future brand-colored block.
- Two alpha cut-out portraits carry the page. `src/components/portfolio/HeroPortrait.tsx` is the
  hero one: a normal block above the headline on mobile, absolutely positioned bleeding off the
  bottom-right from `lg` up, where it is dimmed and desaturated behind the display type and carries
  a left-to-right scrim so white and lime text stay legible over it (assets
  `public/davide-{900,1600}.avif`, ~49 KB / ~166 KB, `public/davide-900.png` as the `<picture>`
  fallback). `src/components/portfolio/JournalPortrait.tsx` is the pointing one inside the journal
  band — its raised hand sits top-right in the frame, which is why the figure is placed left of the
  copy and reads as pointing at the notes; it also gets a scrubbed vertical parallax (assets
  `public/davide-point-{900,1600}.avif`, ~42 KB / ~118 KB, plus `davide-point-900.png`).
- Cut-outs are generated on macOS with Vision (`VNGenerateForegroundInstanceMaskRequest`) — no
  third-party tool. `scripts/cutout.swift` is that pipeline: `swift scripts/cutout.swift <input>
  <output.png> [rotationDegreesClockwise]` reads HEIC, masks every foreground instance, crops to
  their extent and writes straight-alpha PNG. Resize and AVIF-encode the result with `sips`
  (`sips -Z 1600 …`, then `sips -s format avif -s formatOptions 60 …`), which also goes through
  ImageIO. Verify alpha survived with `sips -g hasAlpha out.avif`.
- `src/data/youtube.ts` holds channel meta and the latest videos. It is static because the YouTube
  RSS feed sends no CORS headers and cannot be fetched from the browser; refresh it with
  `npm run fetch:youtube` (`scripts/fetch-youtube.mjs`).
- Sections are in `src/components/portfolio/` and are composed in fixed order by `Index.tsx`:
  `HeroSection` → `ChannelSection` (01) → `WorkSection` (02, featured project + numbered list) →
  `JournalSection` (detached) → `StackSection` (03) → `PathSection` (04) → `ProfileSection` (05) →
  `Footer`, with `Marquee` strips between. Section numbering is hardcoded in each component;
  renumber if you reorder.
- `JournalSection` is the detached band: full-bleed on `bg-surface/45` between top and bottom rules,
  and deliberately **unnumbered** (its marker is a `◢` instead of an index) so the numbered sections
  still read 01 → 05. It lists `journalPosts` from `src/data/journal.ts` — each row linking to
  `/journal/:slug` — plus the `journalPlatforms` rail (LinkedIn, YouTube, GitHub, dacoder.it). With
  no posts it falls back to a dashed empty state and a LinkedIn CTA rather than filler.

### The journal

- `src/data/journal.ts` owns everything journal: `journalPosts` (slug, ISO date, localized
  title/excerpt, tags, and the `video` id the note quotes), `journalPlatforms`, and the body
  loaders. Post bodies are markdown at `src/content/journal/<slug>.<lang>.md`, pulled in by a
  **non-eager** `import.meta.glob(… "?raw")` — they must stay lazy, since the landing page never
  renders one and eager loading put every body in the main chunk. `loadPostBody` is therefore async
  and `readingMinutes` takes the loaded body, not a slug.
- `src/pages/JournalPost.tsx` is the `/journal/:slug` route, lazy-imported in `App.tsx` so
  react-markdown (~160 KB) stays out of the landing chunk. It renders the body with
  `react-markdown` + `remark-gfm` (the notes lean on GFM tables) inside `.post-body`, sets
  `document.title`, resets Lenis scroll on slug change, and falls back to an in-page 404 for an
  unknown slug.
- `.post-body` in `src/index.css` is the only prose scale on the site (68ch measure, lime-ruled
  blockquotes, mono uppercase table headers, tables scrolling inside their own `overflow-x`).
  `@tailwindcss/typography` is a dependency but is deliberately **not** registered as a plugin —
  the notes are the only prose here, so the scale is hand-rolled to match the HUD chrome.
- Adding a note: two markdown files (`.en.md` and `.it.md`) plus one `journalPosts` entry.
  `src/data/journal.test.ts` fails if a language file is missing or thin, if a `[TK` marker survives,
  or if any `@ HH:MM:SS](…&t=Ns)` deep link disagrees with its label — the notes quote the streams by
  timestamp, so a mislabelled link silently misattributes a quote. `src/pages/JournalPost.test.tsx`
  renders the real route and asserts the markdown, both languages and the 404 path.
- Drafts (LinkedIn cuts, unresolved `[TK]`s, cross-post copy) live in `drafts/journal/` and are not
  shipped — only `src/content/journal/` is.
- `projects` entries may carry a `badge` (rendered under the year, e.g. "Private repo") and a `shot`
  (`{ avif, fallback, alt }`) — a cropped screenshot standing in for a live site that is
  password-gated or private, rendered as a `panel` preview inside the row. Screenshots are cropped
  free of browser chrome with `ffmpeg -vf "crop=W:H:0:137,scale=1400:-2"` and encoded to
  `public/shot-*.avif` with a `.jpg` fallback.
- The nav switches to the burger menu below `lg` (not `md`): six labels plus the name and language
  toggle do not fit a 768 px bar.
- `ChannelSection` pins its video gallery and drags it horizontally on `min-width: 1024px` with
  motion allowed; mobile and reduced-motion get a plain swipeable overflow list. YouTube thumbnails
  use `hqdefault` scaled `1.35` inside an `aspect-video` box to crop the 4:3 letterboxing.

### Design system

- `src/index.css` defines all tokens on `:root` (no `[data-theme]` blocks) plus the component layer:
  `.hud`, `.section-marker`, `.display-xl` / `.display-lg`, `.line-mask`, `.panel` (+
  `.panel-interactive`, `.panel-ticks`), `.tag`, `.btn-primary`, `.btn-ghost`, `.link-wipe`,
  `.marquee-strip` / `.marquee-track` / `.marquee-invert`, and the `.grain` overlay utility.
  Prefer these classes over ad-hoc utility stacks so the chrome stays consistent.
- `src/components/ShaderBackdrop.tsx` is the fixed WebGL backdrop (OGL): flow-noise haze, a
  receding grid and a scanline shimmer, with scroll velocity smearing the grid. Note `uResolution`
  must be the drawing-buffer size, not the CSS size — `gl_FragCoord` is in device pixels, so using
  CSS pixels shrinks the field to `1/dpr` of the canvas. It renders a single static frame under
  reduced motion and returns early (falling back to the CSS background) if WebGL is unavailable.
- `src/components/ui/*` is shadcn-ui (config in `components.json`) — treat as vendored. Fonts are
  Space Grotesk (display), Inter (body) and JetBrains Mono (chrome), loaded in `index.html`.

### Routes

`src/App.tsx` wraps everything in `QueryClientProvider` → `TooltipProvider` → `BrowserRouter` →
`LanguageProvider` → `SmoothScroll`. Only two routes: `/` (`pages/Index.tsx`) and `*`
(`pages/NotFound.tsx`).

### Deployment

`vercel.json` is an SPA fallback (`/(.*) → /index.html`). The `lovable-tagger` Vite plugin only
runs in development mode (filtered out in `vite.config.ts` for production builds).
