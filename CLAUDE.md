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
- `npm run preview` — preview the production build.

`@` resolves to `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).

## Architecture

This is a personal portfolio SPA (Vite + React 18 + TypeScript + Tailwind + shadcn-ui). The core architectural idea is that **theme drives both visual design AND content order**, and a UTM parameter can redirect visitors into a separate per-company slideshow.

### Theme system (the central abstraction)

Themes are not a styling toggle — they reshape the page.

- `src/context/ThemeContext.tsx` exposes `ThemeId = "modern" | "luxury" | "editorial" | "mr-franz"` via `useTheme()`. The current theme is mirrored to `<html data-theme="…">` and to the URL as `?theme=…`. The URL is the source of truth; reading/setting `theme` keeps `useSearchParams` in sync.
- `src/index.css` defines a full set of CSS variables per `[data-theme="…"]` block (colors as HSL channels, radius, fonts, gradients, shadows). Tailwind reads these via `hsl(var(--…))` in `tailwind.config.ts`, so any utility like `bg-primary` or `text-foreground` is automatically themed.
- `src/data/content.ts` exports per-theme variants of `heroMessages` and `sectionHeadings`, plus a `sectionOrder` record that dictates which sections render and in what order for each theme. `pages/Index.tsx` reads `sectionOrder[theme]` and maps each id through `sectionComponents` — there is no fixed layout.
- Section components (`src/components/portfolio/*`) typically read `useTheme()` and branch on `theme` for layout, copy, or animation presets (see `HeroSection.tsx`'s `animationPresets` record keyed by `ThemeId`). When adding a new section or theme, expect to touch: the section component, `heroMessages`/`sectionHeadings`/`sectionOrder` in `content.ts`, the CSS variable block in `index.css`, and the themes list in `ThemeSwitcher.tsx`.
- The `modern` theme is special-cased in `Index.tsx`: it renders a WebGL background via `DarkVeil` (OGL/Three) behind the content and applies a `.dark-veil-background` class that overrides foreground/border tokens for legibility. Cards keep the inner palette via `.card-themed`.

### Routes & discovery flow

`src/App.tsx` wraps everything in `QueryClientProvider`, `TooltipProvider`, `BrowserRouter`, then `ThemeProvider`. Routes:

- `/` → `pages/Index.tsx` — the themed portfolio. Shows `ThemeSwitcher` only if the URL contains `?admin` (any value).
- `/discovery/:company` → `pages/Discovery.tsx` — a horizontal slide deck tailored per company, content from `src/data/discovery-content.ts` via `getDiscoveryContent(company)`. Each `CompanyDiscovery` may set `themeOverride`, which is applied locally with `data-theme` on the page wrapper (not via the global ThemeContext).
- `*` → `pages/NotFound.tsx`.

Discovery is triggered by a UTM param: `useUtmDetection` (`src/hooks/useUtmDetection.ts`) reads `?utm_source=…` from the current URL and, unless dismissed in `sessionStorage`, surfaces `DiscoveryToast`, which navigates to `/discovery/<utm_source>` on confirm. Dismissal is per-company and persists for the session.

### UI components

- `src/components/ui/*` is shadcn-ui (config in `components.json`, `style: default`, icon library lucide). Treat these as vendored — modify them only when the design system needs to change globally.
- `components.json` also registers a `@react-bits` registry (`https://reactbits.dev/r/{name}.json`) — visual effect components like `DarkVeil`, `GradientText`, `ProfileCard` originate there and live at `src/components/*` (not under `ui/`).
- Portfolio-specific sections live in `src/components/portfolio/`. Two toaster systems coexist (`@/components/ui/toaster` and `sonner`); both are mounted in `App.tsx`.

### Deployment

`vercel.json` is an SPA fallback (`/(.*) → /index.html`). The `lovable-tagger` Vite plugin only runs in development mode (it's filtered out in `vite.config.ts` for production builds).
