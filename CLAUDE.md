# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun**, and `bun.lockb` is the only lockfile — install with `bun install`, not
`npm install`, which would drop a competing `package-lock.json` beside it. The `bun run <script>`
and `npm run <script>` forms are interchangeable for the scripts below; only installs differ.

Note `bun install` blocks `@swc/core`'s postinstall as untrusted. That is fine — the platform binary
arrives as an optional dependency and the build works without it.

- `bun run dev` — Vite dev server on port `8080` (host `::`, HMR overlay disabled in `vite.config.ts`).
- `bun run build` — production build to `dist/`.
- `bun run build:dev` — build with `mode=development` (keeps the `lovable-tagger` plugin enabled).
- `bun run lint` — ESLint over the whole repo (flat config in `eslint.config.js`; `dist` ignored, `@typescript-eslint/no-unused-vars` is off).
- `bun run test` — Vitest single run (jsdom env, setup at `src/test/setup.ts`).
- `bun run test:watch` — Vitest watch mode.
- Run one test file: `bunx vitest run src/path/to/file.test.ts` (or `... -t "case name"` to filter by test name).
- `bun run fetch:youtube` — regenerates the `videos` array in `src/data/youtube.ts` from the channel RSS feed.
- `bun run sitemap` — regenerates `public/sitemap.xml` from `src/data/journal.ts` (`scripts/generate-sitemap.mjs`). `build` and `build:dev` run it first, so the committed file only goes stale if a note is added without building; `src/data/sitemap.test.ts` catches that.
- `bun run preview` — preview the production build.

`@` resolves to `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).

## Architecture

Single-page personal portfolio (Vite + React 18 + TypeScript + Tailwind v4 + duck/ui) wearing
**stock duck/ui**: near-black violet-tinted canvas, off-white type, duck lime
(`#CBDA42`, `oklch(0.85 0.17 115)`), 3px die-cut sticker edges on 0.75rem corners, and the
violet→cyan→green holo spectrum reserved for one element per viewport. There is no theme switcher
and no per-company deck; earlier versions had both and they were removed deliberately.

The site used to ship **`@duck/theme-noir`** on top of this — lime at chroma 0.25, a 0.125rem
radius, a 1px edge, mono uppercase control type. That layer is gone: the palette, the geometry, the
easings, the control typography and the fonts are duck's own. Do not reintroduce it piecemeal. What
survives of the old identity is deliberate and listed below (hero display sizes, the HUD label
chrome, the section marker language).

Three systems carry most of the design intent: **the design system**, **the scroll choreography**
and **the bilingual copy layer**.

### Design system (duck/ui, unthemed)

- UI primitives come from **duck/ui**, the registry at `duckui.davideghiotto.it` (source lives at
  `~/personal/dacoder/projects/duck-ui`). `components.json` registers it as `@duck`, so
  `npx shadcn@latest add @duck/<name>` copies a component into `src/components/ui/`. They are
  ordinary owned files after that — edit them freely, but prefer fixing the registry and
  reinstalling, so other consumers get the fix too.
- **The tokens at the top of `src/index.css` are the duck dark defaults, verbatim.** Keep them in
  sync with the `.dark` block of `duck-ui/app/globals.css` rather than editing them by taste: this
  site is now a consumer of that palette, not a fork of it. **No duck component is restyled per call
  site** — if one looks wrong, the fix belongs in the registry, not in a `className`.
- In use: `HoloButton`, `QuackButton`, `HoloBadge`, `HudLabel` (+ the `.hud` utility), `StickerCard`,
  `StickerDialog`, `DuckSwitch`, `GlowInput` (+ `GlowField` / `GlowFieldset`), `StickerOtp`,
  `QuackToastProvider`, `EmptyPond`, `DuckProse`, `DuckSectionMarker`, `DuckListRow`. Replacing the
  shadcn/Radix layer with these took the runtime dependency count from 47 to 17.
- **`RalGate` is the reference duck form.** `GlowField` owns the label, the helper and the in-field
  error, `QuackButton` owns the pending state, `StickerOtp` owns the code — and there is not one
  colour class at any call site. Copy that shape for any new form: errors go in the field, never in a
  toast or on the button.
- **CTA and tag typography are tokens, not classes.** `--font-button` / `--weight-button` /
  `--tracking-button` / `--case-button` / `--text-button*` and the five `--*-badge` equivalents are
  declared once in the theme block at the top of `src/index.css`, and `@duck/theme` reads them in a
  zero-specificity base rule. They now hold duck's values — sentence-case Geist at 0.75/0.875/1rem —
  where noir made every control mono uppercase at 0.16em. The old `.btn-hud`, `.btn-hud-ghost` and
  `.tag` classes are gone, and `.btn-ral` reads the same tokens rather than hardcoding a second
  vocabulary. A `<HoloBadge shape="tag">` follows the radius scale; `shape="pill"` is the status pill.
- **Every duck component emits `data-variant` / `data-size`**, so a theme rule can say "outline
  buttons get a faint fill on hover" once instead of marking the call sites. Two site rules do
  exactly that, for `[data-variant="outline"]` buttons and `[data-shape="tag"]` badges.
- **Site overrides live in one `@layer utilities` block at the bottom of `src/index.css`**, not
  beside the rule they override. A duck component sets its fill, its edge and its hover as Tailwind
  utilities, and the utilities layer beats the components layer at every state — a `background` in
  `@layer components` never reaches the element. Anything overriding a duck component goes in that
  block, as a plain class or attribute selector so it also outranks the theme's own `:where()`.
- Every gap this site found is written up in
  `duck-ui/docs/feature-requests/portfolio-site-gaps.md`, now closed — read it before working
  around something here. What is still hand-rolled and why is in the stylesheet section below.

Two systems carry the rest: **the scroll choreography** and **the bilingual copy layer**.

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
- Every section opens with a **`DuckSectionMarker`** — dot, index, label, dissolving rule — wrapped
  in a `Reveal` that staggers the marker's parts via
  `selector="[data-slot='duck-section-marker'] > *"`, because Reveal has to own the ref. Two things
  the component does not draw ride in its `className`: `border-b border-border pb-6`. The dot scales
  on section hover, which is why **every section carries `group/section`** — drop that class and the
  marker simply goes static.
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
  `react-markdown` + `remark-gfm` (the notes lean on GFM tables) inside `DuckProse`, sets
  `document.title`, resets Lenis scroll on slug change, and falls back to an in-page 404 for an
  unknown slug.
- Long-form copy is **`@duck/duck-prose`**, unrestyled — the 68ch measure, the scale, the spacing,
  the headings, the links, the code, the lists, the rules, the tables and the captions all come from
  it. The noir half that used to sit in the override layer (muted body, lime-underlined links, square
  lime bullets, a drawn code chip, fully ruled tables) is gone; only two structural fixes remain, the
  table scroll below and the `lg`-and-up image breakout. `@tailwindcss/typography` never fit and stays
  removed.
- **`.duck-prose table` sets `display: block; overflow-x: auto` and must keep doing so.** The duck
  rule puts the scroll on a `.duck-prose-scroll` wrapper, and markdown emits a bare `<table>` with
  nothing to hang that class on — without the override a wide table widens the whole page.
- Adding a note: two markdown files (`.en.md` and `.it.md`) plus one `journalPosts` entry.
  `src/data/journal.test.ts` fails if a language file is missing or thin, if a `[TK` marker survives,
  or if any `@ HH:MM:SS](…&t=Ns)` deep link disagrees with its label — the notes quote the streams by
  timestamp, so a mislabelled link silently misattributes a quote. `src/pages/JournalPost.test.tsx`
  renders the real route and asserts the markdown, both languages and the 404 path.
- Drafts (LinkedIn cuts, unresolved `[TK]`s, cross-post copy) live in `drafts/journal/` and are not
  shipped — only `src/content/journal/` is.
- `projects` entries may carry a `badge` (rendered under the year, e.g. "Private repo") and a `shot`
  (`{ avif, fallback, alt }`) — a cropped screenshot standing in for a live site that is
  password-gated or private, rendered as a `StickerCard` preview inside the row. Screenshots are cropped
  free of browser chrome with `ffmpeg -vf "crop=W:H:0:137,scale=1400:-2"` and encoded to
  `public/shot-*.avif` with a `.jpg` fallback.
- The nav switches to the burger menu below `lg` (not `md`): six labels plus the name and language
  toggle do not fit a 768 px bar.
- **`socials` in `src/data/content.ts` is the one link set** — LinkedIn, YouTube, GitHub, dacoder.it,
  in render order. `journalPlatforms` maps over it and only adds the per-platform `focus` copy, so a
  changed handle is a one-line change. `src/components/SocialLinks.tsx` renders it two ways:
  `SocialRail`, the fixed left-gutter rail that mirrors `ScrollRail` (vertical `ui.social.label`,
  hairline stems, 28px ghost buttons, the handle appearing in a `.social-flyout` on hover or focus),
  and `SocialRow`, the touch-sized horizontal set — icon-only on the hero scroll-cue line, `labels`
  on in the nav drawer.
- **The rail's `min-[1440px]` breakpoint is measured, not chosen.** The content column is
  `--content-max-width: 82rem` (1312 px), so under ~1440 px there is no gutter and the rail lands on
  the display type — it did, at `lg`. `SocialRow` in the hero carries the same links below that
  width and hides above it, so the two never appear together; change one breakpoint and change both.
- `ChannelSection` pins its video gallery and drags it horizontally on `min-width: 1024px` with
  motion allowed; mobile and reduced-motion get a plain swipeable overflow list. YouTube thumbnails
  use `hqdefault` scaled `1.35` inside an `aspect-video` box to crop the 4:3 letterboxing.

### Stylesheet

- **Tailwind v4, no config file.** There is no `tailwind.config.ts` and no `postcss.config.js`;
  `@tailwindcss/vite` runs as a Vite plugin and `src/index.css` is the single source of truth.
  Colours, fonts, radius scale, easings and animations are declared in `:root` and `@theme inline`
  at the top of that file.
- **Tokens hold complete `oklch()` colours, not HSL channels.** Duck components pass `var(--card)`
  and `var(--border)` straight into gradients and box-shadows, which a bare `213 10% 7%` cannot
  satisfy. In markup use Tailwind's `/opacity` modifier (`bg-primary/55`); in hand-written CSS use
  `color-mix(in oklab, var(--primary) 55%, transparent)`. Never reintroduce `hsl(var(--x))`.
- The radius scale is **multiplicative** (`calc(var(--radius) * 1.833)`), matching the duck registry.
  Stock shadcn adds fixed pixel offsets, so any theme that moves `--radius` lands on corners it never
  chose — which is exactly what happened when this site ran at `0.125rem`. It is duck's `0.75rem` now.
- What the theme ships that used to be local: `.hud` (`@duck/hud-label`), `.display-xl` /
  `.display-lg` / `.display-md`, `.grain`, `.sheen` and `.balance`. The **grain is an element**, not
  a `::before` on a wrapper — every page renders a bare `<div className="grain" aria-hidden />`
  inside its root, and putting `grain` back on the wrapper would make that wrapper the fixed
  full-screen overlay.
- **The site override layer is down to five things**, and each one is a layout or stacking decision
  rather than a look: the two `.display-*` sizes (a portfolio hero is bigger than a docs headline —
  tracking and weight come from duck), the `.grain` z-index (under the nav), the `.duck-prose` table
  scroll and image breakout, the `[data-shape="tag"]` hover, the `[data-variant="outline"]` hover fill
  and `.panel-interactive`. Anything colour-shaped that shows up there is a regression toward the old
  theme — fix the registry instead.
- Remaining hand-rolled chrome in the component layer: `.line-mask`, `.link-wipe`, `.micro-row`,
  `.marquee-strip` / `.marquee-track` / `.marquee-invert`, `.btn-ral`, `.contact-link`,
  `.stack-group`, `.lang-switch` and the nav classes. Prefer these over ad-hoc utility stacks so the
  chrome stays consistent. `.micro-row` survives because `@duck/duck-list-row` builds its own body
  from index / title / description / meta / trailing, which the project row (a three-column grid
  holding a screenshot) and the journal and platform rows (tags, logos) cannot fit — the plain
  title-and-description list at the bottom of a post does use the component.
- **Defaults meant to be overridable go in `:where()`.** `:where(.hud)` carries its colour at zero
  specificity so `class="hud text-primary"` actually works. A plain `.hud { color }` sits in the
  utilities layer and outranks Tailwind's own `text-*`, which fails silently — it cost this site
  every lime section index once already. The site overrides at the bottom of the file are the
  deliberate inverse: they are plain classes precisely so they outrank the theme's `:where()`.
- **No apostrophes in CSS comments.** Tailwind v4's parser treats `'` as a string delimiter even
  inside a comment; a stray one swallows the rules that follow and surfaces only as
  `Unterminated string` in a Vite stack trace.
- `src/components/ShaderBackdrop.tsx` is the fixed WebGL backdrop (OGL): flow-noise haze, a
  receding grid and a scanline shimmer, with scroll velocity smearing the grid. Its `base` and
  `accent` defaults are `--background` and `--primary` converted to sRGB 0-1 by hand, since a uniform
  takes numbers and not tokens — move the palette and move those two arrays. Note `uResolution`
  must be the drawing-buffer size, not the CSS size — `gl_FragCoord` is in device pixels, so using
  CSS pixels shrinks the field to `1/dpr` of the canvas. It renders a single static frame under
  reduced motion and returns early (falling back to the CSS background) if WebGL is unavailable.
- `src/components/ui/*` is the installed duck/ui set (config in `components.json`) — owned code, but
  see the design-system section before editing. Fonts are duck's own, loaded from Google Fonts in
  `index.html`: **Bricolage Grotesque** (display, variable `opsz`/`wdth`/`wght`), **Geist** (body) and
  **Geist Mono** (HUD chrome). Bricolage is tighter than the Space Grotesk it replaced, which is why
  `.display-xl` tracking sits at duck's `-0.03em` instead of the old `-0.045em`.

### Routes

`src/App.tsx` wraps everything in `QueryClientProvider` → `QuackToastProvider` → `BrowserRouter` →
`LanguageProvider` → `SmoothScroll`. Routes: `/` (`pages/Index.tsx`), `/journal/:slug`, `/ral`,
`/privacy`, `/cookies`, and `*` (`pages/NotFound.tsx`).

### Deployment

`vercel.json` is an SPA fallback (`/(.*) → /index.html`). The `lovable-tagger` Vite plugin only
runs in development mode (filtered out in `vite.config.ts` for production builds).
