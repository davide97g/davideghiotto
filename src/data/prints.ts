/**
 * 3D-print projects — the static fallback.
 *
 * The live list is discovered in the browser from GitHub (repos tagged
 * `3d-printing`, see `src/lib/printsGithub.ts`) and read through `usePrints` in
 * `src/lib/printsLive.ts`; this snapshot is what renders first and what stays on
 * screen if GitHub fails or rate-limits. Regenerate it with `npm run fetch:prints`.
 */

import type { PrintsSnapshot } from "@/lib/printsGithub";
import snapshot from "./prints.snapshot.json";

export const printsSnapshot = snapshot as PrintsSnapshot;

/**
 * The four Bambu PLA Basic spools on the shelf, hex codes from Bambu Studio's
 * filament table (`~/personal/projects/bambulab/filament-pla-basic.md`). A model
 * shows in its manifest colour, or in gray, and the viewer can swap spools.
 */
export const filaments = [
  { id: "gray", hex: "#8E9089", name: { en: "Gray", it: "Grigio" } },
  { id: "white", hex: "#FFFFFF", name: { en: "Jade White", it: "Bianco giada" } },
  { id: "black", hex: "#000000", name: { en: "Black", it: "Nero" } },
  { id: "green", hex: "#00AE42", name: { en: "Bambu Green", it: "Verde Bambu" } },
] as const;
