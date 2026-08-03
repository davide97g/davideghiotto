import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckProse — the long-form surface: an article, a changelog entry, whatever
 * a CMS or an MDX file hands over as bare tags.
 *
 * Every duck component before this one styled markup it could see. Prose
 * styles markup it cannot: the content arrives as <h2>, <p>, <blockquote>,
 * <table> with no class anywhere, so the rules have to be descendant selectors
 * on one wrapper. That is the whole reason @tailwindcss/typography exists —
 * and the reason it is not used here is that it ships its own type scale,
 * its own greys and its own idea of a blockquote, none of which are duck's or
 * a theme's. This reads the tokens instead: --font-display for headings,
 * --font-mono for code and table headers, --primary for the rules and marks,
 * --radius for anything boxed.
 *
 * Measure is the one thing a consumer must not have to think about. 68ch is
 * the default because that is where a line stops being pleasant to read;
 * `measure="wide"` is for a docs page that already sits in a narrow column,
 * and full turns it off for a table-heavy page.
 *
 * Selectors use :where() throughout, so every one of them is zero specificity
 * and a utility on the element itself always wins. `class="text-2xl"` on a
 * heading inside prose has to work, or the component is a cage.
 */

const measures = {
  /** 68ch. Long-form default. */
  default: "[--prose-measure:68ch]",
  /** 76ch, for a page that is already narrow. */
  wide: "[--prose-measure:76ch]",
  /** No limit — the container decides. */
  full: "[--prose-measure:none]",
} as const;

export interface DuckProseProps extends React.ComponentProps<"div"> {
  measure?: keyof typeof measures;
  /**
   * Render as this element instead of a div. Pass "article" for a post — the
   * wrapper is the article, not a div inside it.
   */
  as?: "div" | "article" | "section" | "main";
}

function DuckProse({
  className,
  measure = "default",
  as: Comp = "div",
  ...props
}: DuckProseProps) {
  return (
    <Comp
      data-slot="duck-prose"
      data-measure={measure}
      className={cn(
        "duck-prose max-w-[var(--prose-measure)]",
        measures[measure],
        className
      )}
      {...props}
    />
  );
}

export { DuckProse };
