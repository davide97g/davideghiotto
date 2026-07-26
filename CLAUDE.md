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
  `marqueeTerms`, `featuredProject`, `projects`, `stackGroups`, `experiences`, and `sectionOrder`.
- `featuredProject` is the pinned lead project (currently **sharp**, the self-hosted Slack
  alternative). Its copy, version and feature list mirror the official landing page at
  sharp.davideghiotto.it, and its mark is that project's own favicon, stored at `public/sharp.svg`.
  `src/components/portfolio/FeaturedProject.tsx` renders it and locally overrides `--primary` with
  sharp's violet, so accent utilities inside the card adopt the project's brand instead of the site
  lime. That local-override trick is the pattern to follow for any future brand-colored block.
- `src/components/portfolio/HeroPortrait.tsx` is the cut-out portrait: a normal block above the
  headline on mobile, absolutely positioned bleeding off the bottom-right from `lg` up, where it is
  dimmed and desaturated behind the display type and carries a left-to-right scrim so white and lime
  text stay legible over it. Assets are `public/davide-{900,1600}.avif` (~49 KB / ~166 KB) with
  `public/davide-900.png` as the fallback in a `<picture>`. The alpha cut-out was generated on macOS
  with Vision (`VNGenerateForegroundInstanceMaskRequest`) — no third-party tool — and encoded to
  AVIF through ImageIO; regenerate the same way if the photo changes.
- `src/data/youtube.ts` holds channel meta and the latest videos. It is static because the YouTube
  RSS feed sends no CORS headers and cannot be fetched from the browser; refresh it with
  `npm run fetch:youtube` (`scripts/fetch-youtube.mjs`).
- Sections are in `src/components/portfolio/` and are composed in fixed order by `Index.tsx`:
  `HeroSection` → `ChannelSection` (01) → `WorkSection` (02, featured project + numbered list) →
  `StackSection` (03) → `PathSection` (04) → `ProfileSection` (05) → `Footer`, with `Marquee` strips
  between. Section numbering is hardcoded in each component; renumber if you reorder.
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
