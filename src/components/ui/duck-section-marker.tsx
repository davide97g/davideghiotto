import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckSectionMarker — the label at the top of a section: an index, a name, and
 * a rule that bleeds out to nothing.
 *
 * The rule fading to transparent rather than stopping at a fixed width is the
 * whole detail. A rule with an end is a divider between two things; a rule that
 * dissolves is an annotation on the one below it.
 *
 * The dot answers to the section, not to itself: it scales up when anything
 * inside the section is hovered, which is why the section wants
 * `className="group/section"` on it. Without that group the marker is simply
 * static, which is a fine place to start.
 */
function DuckSectionMarker({
  className,
  index,
  children,
  align = "left",
  ...props
}: React.ComponentProps<"div"> & {
  /** Section ordinal. A string, so "03" keeps its zero. */
  index?: React.ReactNode;
  /** Which side the rule runs to. */
  align?: "left" | "center";
}) {
  return (
    <div
      data-slot="duck-section-marker"
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 bg-primary duck-glow-primary",
          "transition-transform duration-500 ease-[var(--ease-duck)]",
          "group-hover/section:scale-[1.6]"
        )}
      />
      {index !== undefined && (
        <span className="hud hud-sm text-primary tabular-nums">{index}</span>
      )}
      <span className="hud hud-tight">{children}</span>
      {/* One hairline, one direction, no end. */}
      <span
        aria-hidden
        className="h-px min-w-6 flex-1 bg-[linear-gradient(to_right,var(--border),transparent)]"
      />
    </div>
  );
}

export { DuckSectionMarker };
