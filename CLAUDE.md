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
- `bun run fetch:prints` — regenerates `src/data/prints.snapshot.json`, the static fallback of the 3D section (set `GITHUB_TOKEN` to lift the 60/hour limit).
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
- **Every `useGSAP` with `dependencies` also passes `revertOnUpdate: true`.** Without it the hook
  re-runs on a change but never reverts the previous run, so each language switch stacked another
  copy of every ScrollTrigger, tween and ticker callback — the page got slower the longer it was
  used. For the same reason `SplitReveal` keys its element by `text` (SplitText detaches the node
  React would patch) and the cover cards are keyed by language (a moved card keeps GSAP's cached
  transform for its old slot).
- **`gsap.ticker` callbacks must be free at rest.** They run every frame for the life of the page:
  skip the write when the value has not changed (`ScrollRail`, the covers shear), and pause loops
  that are off screen (`Marquee` toggles its tween and its boost on a ScrollTrigger). An idle page
  should make zero style writes.
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
- `featuredProjects` are the projects in active development, each a full `FeaturedProject` card at
  the top of Work, in render order: currently **Autocratico** (the private register for Italian
  bureaucracy) and **keybordy MP** (the ESP32-S3 macropad that listens). Copy, specs and feature
  lists mirror each project's README and landing page; each mark is the project's own favicon in
  `public/` (`autocratico.svg`, `keybordy.svg`). The card locally overrides `--primary` (and
  `--ring` / `--glow-primary`) with the entry's `brand` colour, so accent utilities inside it adopt
  the project's brand instead of the site lime — the pattern for any future brand-colored block.
  Under the pitch sits a media strip: the first of `trailers` as a YouTube tile (maxres thumbnail,
  links out), then `shots` (`public/shot-<project>-*.avif` + `.jpg`, 1400 wide, 16:9 or 16:10),
  then any further cuts as text links. Autocratico shots are the app screenshots from its landing
  page; keybordy MP shots are frames of its CAD-rendered trailer. **sharp** held the first slot
  until it stopped being self-hosted; it is hidden, not deleted — its entry is in git history and
  `public/sharp.svg` is kept.
- `src/components/portfolio/HeroPortrait.tsx` is the hero poster: slide `01-intro` ("Hi, I'm
  Davide") of the Instagram presentation carousel in Contexto, shown whole — its own type included —
  as a tilted sticker card (`public/hero-intro-{640,1120}.avif` + `hero-intro-800.jpg`). A normal
  block above the headline on mobile; from `lg` up it is vertically centred in the right column,
  clear of the display type, and neither dimmed nor overlapped. Two things keep it that way: the
  placement sits on a wrapper, not on `.hero-portrait`, because GSAP owns that element's transform
  and resets CSS `translate` (a `-translate-y` centring was silently dropped); and the `h1` reserves
  the card's width as right padding, so the long Italian line wraps instead of running under the
  card. The `max-[1439.98px]` / `min-[1440px]` pair on that padding is deliberate: a bare
  `min-[1440px]:` loses to `lg:` in Tailwind's ordering. The only alpha cut-out left is
  `src/components/portfolio/JournalPortrait.tsx`, the pointing one inside the journal
  band — its raised hand sits top-right in the frame, which is why the figure is placed left of the
  copy and reads as pointing at the notes; it also gets a scrubbed vertical parallax (assets
  `public/davide-point-{900,1600}.avif`, ~42 KB / ~118 KB, plus `davide-point-900.png`).
- Cut-outs are generated on macOS with Vision (`VNGenerateForegroundInstanceMaskRequest`) — no
  third-party tool. `scripts/cutout.swift` is that pipeline: `swift scripts/cutout.swift <input>
  <output.png> [rotationDegreesClockwise]` reads HEIC, masks every foreground instance, crops to
  their extent and writes straight-alpha PNG. Resize and AVIF-encode the result with `sips`
  (`sips -Z 1600 …`, then `sips -s format avif -s formatOptions 60 …`), which also goes through
  ImageIO. Verify alpha survived with `sips -g hasAlpha out.avif`.
- **YouTube data is live, with a static fallback.** The browser cannot read the channel itself (the
  RSS feed sends no CORS headers, and the counts are not in it), so `services/ral-gate` refreshes a
  snapshot every 15 min (`src/youtube.ts`: RSS for the 15 latest videos, the Data API for counts
  when `YOUTUBE_API_KEY` is set, the public about page otherwise) and serves it at
  `GET /v1/youtube`. `ChannelSection` reads it through `useChannelData()` in
  `src/lib/youtubeLive.ts`, which polls on the same beat and merges the response field by field
  over `src/data/youtube.ts` — the copy the bundle ships, renders first and keeps on screen if the
  call fails. Refresh that copy with `npm run fetch:youtube` (`scripts/fetch-youtube.mjs`, same
  feed + about page) so a cold load is not stale. Both the RAL gate and this call take their base
  URL from `VITE_RAL_API_URL` via `src/lib/api.ts`.
- Sections are in `src/components/portfolio/` and are composed in fixed order by `Index.tsx`:
  `CoversSection` (detached, the page opener) → `HeroSection` → `ChannelSection` (01) → `WorkSection` (02, featured project + numbered list) →
  `PrintsSection` (03, 3D prints) → `JournalSection` (detached) → `StackSection` (04) → `PathSection` (05) → `ProfileSection` (06) →
  `Footer`, with `Marquee` strips between. Section numbering is hardcoded in each component;
  renumber if you reorder.
- Every section opens with a **`DuckSectionMarker`** — dot, index, label, dissolving rule — wrapped
  in a `Reveal` that staggers the marker's parts via
  `selector="[data-slot='duck-section-marker'] > *"`, because Reveal has to own the ref. Two things
  the component does not draw ride in its `className`: `border-b border-border pb-6`. The dot scales
  on section hover, which is why **every section carries `group/section`** — drop that class and the
  marker simply goes static.
- `CoversSection` is the manifesto and **opens the page**, ahead of the hero; it is unnumbered like
  the journal (its marker is a `✳`).
  It deals one magazine cover, `cover` in `src/data/content.ts` (The Daily Commit), like a sticker
  while the headline writes itself, then strikes the last word and slams a lime stamp over it. The
  Italian "Rilascialo" poster is **not** dealt: it is the page backdrop, and a card of it on top read
  as a clone. Act one (first line, scroll cue) is a time-based intro played on load, since there is no scroll
  before the first section; act two is scrubbed, pinned from the very top on desktop and over a
  short range on phones. The cover is not lazy-loaded, being dealt on the first scroll. Because the hero is
  second, its intro timeline waits on a `top 70%` ScrollTrigger and its lead is a scroll-triggered
  `SplitReveal`, not an `immediate` one; the portrait intro moves `y`, not `yPercent`, which the
  scroll drift owns. The stamp is
  **not** scrubbed — it plays and reverses whole from `onUpdate`, since a scrubbed slam reads as a
  slow zoom. The stage tilts
  under a fine pointer and shears with `scrollSignal.velocity`; the card opens full-size in a
  `StickerDialog` (Lenis is stopped while it is open). The cover ships as
  `public/cover-<id>-{640,1200}.avif` + `-900.jpg`, cropped 48px a side to drop the black frame
  baked into the masters; the 20 MB PNG masters live in `drafts/covers/` and are git-ignored.
- `src/components/motion/Magnetic.tsx` pulls a child toward the pointer (fine pointer, motion
  allowed). The transform sits on the wrapper, never on the duck button inside it. The hero CTAs
  use it, and the hero portrait has an inner `.hero-portrait-inner` plane for pointer parallax,
  because the outer element already owns the intro and the scroll drift.
- `JournalSection` is the detached band: full-bleed on `bg-surface/45` between top and bottom rules,
  and deliberately **unnumbered** (its marker is a `◢` instead of an index) so the numbered sections
  still read 01 → 06. It lists `journalPosts` from `src/data/journal.ts` — each row linking to
  `/journal/:slug` — plus the `journalPlatforms` rail (LinkedIn, YouTube, GitHub, dacoder.it). With
  no posts it falls back to a dashed empty state and a LinkedIn CTA rather than filler.

### 3D prints

- `PrintsSection` (03, `#prints`, nav label "3D") renders the GitHub repos tagged with the
  **`3d-printing` topic** — nothing else is scanned. Opting a project in means adding the topic and
  committing its `.stl` / `.3mf` files; the site picks them up at runtime.
- Discovery is `src/lib/printsGithub.ts`: one `GET /users/davide97g/repos` (filtered on `topics`),
  then one recursive git tree per tagged repo. Models are fetched from `raw.githubusercontent.com`,
  which is CORS-open and not rate limited. An optional **`3d.json`** at the repo root sets `title`,
  a localized `summary`, `paths` (folder or file prefixes to include) and per-file `name` / `color`
  (a `#rrggbb` filament hex); without it every model in the tree is listed under the repo name and
  description. The file is pure (types-only imports, `fetch` injected) because
  `scripts/fetch-prints.mjs` runs it under Node type stripping.
- No backend in the loop, unlike YouTube: GitHub sends CORS headers. `usePrints()`
  (`src/lib/printsLive.ts`) calls GitHub from the browser, caches the result in `sessionStorage` for
  15 min so reloads do not spend the unauthenticated 60/hour, and falls back to
  `src/data/prints.snapshot.json` on any failure. A live answer of zero repos is trusted: the empty
  state (`EmptyPond` pointing at the topic) is what an untagged account looks like.
- The viewer is three.js, **lazy**: `src/components/prints/printScene.ts` is its own ~150 KB gzip
  chunk, imported when the viewer comes within 600px of the viewport. Never import three anywhere
  else. One renderer per viewer, reused across parts; it renders only while the canvas intersects
  the viewport, and under reduced motion there is no loop at all (a frame per orbit change, no
  auto-rotate, no reveal).
- Loading plays a "print" reveal: a clipping plane rises from the bed and a back-face twin of the
  mesh paints the cut face lime. The camera fit holds the circle the footprint sweeps under
  auto-rotate, in both fields of view — fitting the axis-aligned box crops wide parts mid-turn on a
  phone. Zoom and pan are off (the wheel belongs to Lenis) and the canvas keeps `touch-action:
  pan-y` so a vertical swipe still scrolls the page.
- Files over 12 MB wait for a click. Prefer plain STL exports over sliced Bambu plates: a plate
  3MF carries the G-code and thumbnails (the keybordy caps plate is 1.1 MB zipped for 38k
  triangles). Bambu project 3MFs with `3D/Objects/*.model` sub-models load fine.
- Empty, loading, error and "no WebGL" states use **`StateSticker`** (`src/components/StateSticker.tsx`):
  six die-cut stickers of the logo character — `empty`, `loading`, `error`, `success`, `notfound`,
  `offline` — in `public/stickers/` as 640 px WebP with alpha plus a 320 px PNG fallback. They were
  generated as one set with Codex image generation (`codex exec --enable image_generation
  --image=<logo> < prompt`); the prompt is `drafts/stickers/PROMPT.md` and the 1254 px masters
  beside it are git-ignored. Reuse a sticker for a new state rather than drawing an icon, and
  regenerate the whole set from that prompt if a new state is needed, so the six stay one voice.
  `NotFound` wears `notfound`. AVIF is not an option here: libsvtav1 cannot encode alpha.
- The filament swatches are the four Bambu PLA Basic spools from
  `~/personal/projects/bambulab/filament-pla-basic.md` (`filaments` in `src/data/prints.ts`);
  `--primary` is hardcoded as `#CBDA42` in the scene, since a three `Color` cannot read an oklch token.

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
  password-gated, private, or (Majestic) not deployed anywhere yet. `ProjectPreview` in
  `WorkSection.tsx` links the card out when the project has a `link` and leaves it a plain figure
  when it has none, so a card never looks clickable without being so. Screenshots are cropped
  free of browser chrome with `ffmpeg -vf "crop=W:H:0:137,scale=1400:-2"`, sized **1400×810**, and
  encoded to `public/shot-*.avif` with a `.jpg` fallback.
- **Encode those AVIFs with ffmpeg, not `sips`.** `ffmpeg -i shot.png -c:v libsvtav1 -crf 32
  -preset 4 -pix_fmt yuv420p -f avif out.avif` — `sips -s format avif` wrote files that pass
  `sips -g pixelWidth` and even decode to the right `naturalWidth` in Chrome, then paint blank. The
  `.jpg` fallback is still `sips -s format jpeg -s formatOptions 72`. libsvtav1 needs even
  dimensions, which is the other reason the shots are 810 and not 809 tall.
- Mobile-first apps get a triptych instead of one desktop frame: screenshot the phone-width column
  three times, then compose the panels onto a canvas painted the app's own background —
  `shot-calorico.avif` is three `crop=450:1000:225:0,scale=327:726` panels on `0xdef0c4`.
- The nav switches to the burger menu below `lg` (not `md`): seven labels plus the name and language
  toggle do not fit a 768 px bar. Between `lg` and `xl` the name shows as its initials ("DG") and the
  gaps drop to `gap-4` — at 1024 px the full name pushed the Italian RAL link onto two lines.
- **`socials` in `src/data/content.ts` is the one link set** — LinkedIn, YouTube, Instagram, GitHub, dacoder.it,
  in render order. `journalPlatforms` maps over it and only adds the per-platform `focus` copy, so a
  changed handle is a one-line change. `src/components/SocialLinks.tsx` renders it two ways:
  `SocialRail`, the fixed left-gutter rail that mirrors `ScrollRail` (vertical `ui.social.label`,
  hairline stems, 28px ghost buttons, the handle appearing in a `.social-flyout` on hover or focus),
  and `SocialRow`, the touch-sized horizontal set — icon-only on the hero scroll-cue line, `labels`
  on in the nav drawer. Instagram (`@ai_quack`) also gets `InstagramFollow`, the one element that wears the
  platform gradient (`.ig-follow`): a "Follow" pill beside the hero links, at every width, and a small
  inert copy on its journal rail row, which is already the link.
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
- **The home page backdrop is the manifesto poster, not the shader.** `src/components/PosterBackdrop.tsx`
  pins `public/bg-poster-it-{1952.avif,1200.jpg}` (encoded from `drafts/covers/s1_it_b.png`, frame
  cropped) full-screen with `object-cover` focused on the face, under a scrim that
  darkens toward the bottom. The manifesto shows it as it is; below that a canvas-colour veil shades
  it in two scrubbed steps, to 70% as `#hero` arrives and 95% as `#channel` arrives, then holds —
  the poster lettering is the site lime and fought every line of body copy. Do not thin the later
  step to show more poster. The other pages keep the shader. It parallaxes on a scrubbed tween: a 160%-tall plane
  drifts up 37.5% over the first 2400px of scroll, then holds. Do not spread the drift over the whole
  page: the page is ~18000px long, which makes it too slow to read as motion.
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
