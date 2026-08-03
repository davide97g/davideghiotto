import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * HoloButton — the signature CTA.
 *
 * Label typography is deliberately absent from these classes. Family, weight,
 * tracking, case and size come from --font-button / --weight-button /
 * --tracking-button / --case-button / --text-button*, which the theme reads in a
 * zero-specificity rule. A `text-sm font-semibold` here would be a utility, and
 * a theme whose CTA is mono uppercase 12px could not undo it from CSS — it would
 * need a class on every call site, and the font-size half could not be undone at
 * all. Any single call site still overrides all of it with a plain utility.
 */
const holoButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "cursor-pointer select-none",
    "transition-[background-color,box-shadow,transform,border-color] duration-300 ease-[var(--ease-duck)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        /* The signature: animated iridescent border. One per viewport. */
        holo: "holo-border-animated text-foreground hover:duck-glow active:scale-[0.98]",
        /* Solid duck lime, the workhorse CTA. */
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:duck-glow-primary active:scale-[0.98]",
        outline:
          "sticker border-border bg-transparent hover:border-primary hover:text-primary active:scale-[0.98]",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-12 rounded-xl px-8",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "holo", size: "default" },
  }
);

export interface HoloButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof holoButtonVariants> {
  asChild?: boolean;
}

function HoloButton({
  className,
  variant = "holo",
  size = "default",
  asChild = false,
  ...props
}: HoloButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="holo-button"
      // The variant is the only thing a stylesheet cannot infer from the DOM,
      // and it is the thing themes most want to hook: "outline buttons get a
      // faint fill on hover" is one rule here and a class on every call site
      // without it. data-size carries the typography step for the same reason.
      data-variant={variant}
      data-size={size}
      className={cn(holoButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { HoloButton, holoButtonVariants };
