import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckListRow — the row is the unit of a journal index, a project list, a
 * changelog. One hairline, one leading rule that grows in on hover, and the
 * whole row is the link.
 *
 * The rule is a scaleX transform rather than a width, so the hover costs a
 * composited property and nothing on the main thread — and it grows from the
 * top because that is the edge the eye is already tracking down.
 *
 * `index` prints a HUD ordinal, which is what makes a list read as a catalogue
 * rather than as a stack of headings.
 */

const rowClasses = [
  "group/row relative flex items-start gap-4 border-b border-border py-4 pl-0",
  "outline-none transition-[padding,background-color] duration-300 ease-[var(--ease-duck)]",
  // The row shifts right by the width of its own rule, so the rule reads as
  // having pushed the content rather than landed on top of it.
  "hover:pl-4 focus-visible:pl-4",
  "before:absolute before:top-1/2 before:left-0 before:h-[calc(100%-1.5rem)] before:w-px",
  "before:origin-top before:-translate-y-1/2 before:scale-y-0 before:bg-primary",
  "before:transition-transform before:duration-300 before:ease-[var(--ease-duck)]",
  "hover:before:scale-y-100 focus-visible:before:scale-y-100",
];

export interface DuckListRowProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Ordinal in the list. A string, so "01" stays "01". */
  index?: React.ReactNode;
  title?: React.ReactNode;
  /** A line under the title. */
  description?: React.ReactNode;
  /** Date, tag, reading time — the quiet half of the row. */
  meta?: React.ReactNode;
  /** Right edge: a chevron, a value, a badge. */
  trailing?: React.ReactNode;
  /**
   * Render the child element as the row, for a whole-row link. The row builds
   * its own content from index / title / description / meta / trailing, so the
   * child is written as a bare element: <a href="…" />.
   */
  asChild?: boolean;
}

function DuckListRow({
  className,
  index,
  title,
  description,
  meta,
  trailing,
  asChild = false,
  children,
  ...props
}: DuckListRowProps) {
  const body = (
    <>
      {index !== undefined && (
        <span className="hud hud-sm shrink-0 pt-1.5 tabular-nums">{index}</span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {title !== undefined && (
          <span className="font-display leading-snug font-semibold tracking-tight">
            {title}
          </span>
        )}
        {description !== undefined && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
        {!asChild && children}
      </span>
      {meta !== undefined && (
        <span className="hud hud-sm hud-tight shrink-0 pt-1.5">{meta}</span>
      )}
      {trailing !== undefined && (
        <span className="flex shrink-0 items-center pt-1 text-muted-foreground transition-colors duration-300 group-hover/row:text-primary">
          {trailing}
        </span>
      )}
    </>
  );

  // Radix Slot appends its own children only where a <Slottable> sits among its
  // direct children, and the row needs its content interleaved between three
  // slots rather than appended at one point. So the clone is done here: the
  // child element becomes the row and the row supplies its children.
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return React.cloneElement(
      child,
      {
        ...props,
        "data-slot": "duck-list-row",
        className: cn(rowClasses, child.props.className, className),
      } as React.HTMLAttributes<HTMLElement>,
      body
    );
  }

  return (
    <div
      data-slot="duck-list-row"
      className={cn(rowClasses, className)}
      {...props}
    >
      {body}
    </div>
  );
}

export { DuckListRow };
