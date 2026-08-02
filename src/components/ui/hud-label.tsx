import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * HudLabel — the instrument-panel label: tiny, mono, uppercase, tracked wide
 * enough that it reads as machine output rather than as prose.
 *
 * This is the smallest piece of chrome in the system and the one that appears
 * most often, so it is a component rather than a habit: HoloSeparator's caption
 * and StickerSheet's margin note each carried their own copy of the same five
 * declarations, and had already drifted apart — 11px/0.18em against
 * 10px/0.2em — for no reason anyone chose.
 *
 * Tracking is the whole effect. `tight` is for labels boxed inside a control,
 * where the extra width would push the layout around; anything standing alone
 * wants the default.
 *
 * The item also installs a plain `.hud` utility (plus `.hud-sm` and
 * `.hud-tight`). Reach for that whenever the label is a property of an element
 * that already exists — a <dt>, a <figcaption>, a table header — because
 * wrapping those in a span to get the typography changes the document for the
 * sake of a font size. Use the component when the label *is* the element.
 *
 * The utility's default colour is declared through `:where(.hud)`, at zero
 * specificity. A registry `css` block lands at the end of the utilities layer,
 * so a normal `.hud { color: ... }` would outrank Tailwind's own `text-primary`
 * and quietly win — `class="hud text-primary"` would render muted with no
 * error anywhere. At zero specificity any text-* utility takes precedence and
 * a bare `.hud` still comes out muted.
 */

const hudLabelVariants = cva(
  "font-mono uppercase leading-none whitespace-nowrap",
  {
    variants: {
      tone: {
        muted: "text-muted-foreground",
        foreground: "text-foreground",
        /** The accent read: a live value, a section index, a status. */
        primary: "text-primary",
      },
      size: {
        sm: "text-[10px]",
        default: "text-[11px]",
      },
      tracking: {
        default: "tracking-[0.3em]",
        tight: "tracking-[0.18em]",
      },
    },
    defaultVariants: {
      tone: "muted",
      size: "default",
      tracking: "default",
    },
  }
);

export interface HudLabelProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof hudLabelVariants> {
  /**
   * Draw a lime status dot before the text. Decorative — if the state it
   * stands for matters, keep it in the label's own words too.
   */
  dot?: boolean;
}

function HudLabel({
  className,
  tone,
  size,
  tracking,
  dot = false,
  children,
  ...props
}: HudLabelProps) {
  return (
    <span
      data-slot="hud-label"
      className={cn(
        hudLabelVariants({ tone, size, tracking }),
        dot && "inline-flex items-center gap-2",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          // Square, not round: the rest of the HUD is drawn with straight
          // edges, and a lone circle in it reads as a bullet point.
          className="size-1.5 shrink-0 bg-primary duck-glow-primary"
        />
      )}
      {children}
    </span>
  );
}

export { HudLabel, hudLabelVariants };
