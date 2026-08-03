"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StickerOtp — a die-cut strip of cells. Each digit lands with a pop, the caret
 * is the Terminal's, and when the code is complete the *strip* glows as one
 * object. Six cells glowing six times would read as six separate wins.
 *
 * Underneath it is one real input lying transparent across the whole strip,
 * not six. Six inputs announce "edit blank, one of six" with no context, break
 * paste, and break password managers. One input gets paste, iOS SMS autofill
 * and a sane screen-reader experience for free.
 */
export interface StickerOtpProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "value" | "defaultValue"> {
  /** Number of cells. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired once the last cell fills. */
  onComplete?: (value: string) => void;
}

function StickerOtp({
  className,
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  onFocus,
  onBlur,
  disabled,
  ...props
}: StickerOtpProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = (controlled ? value : internal).slice(0, length);
  const [focused, setFocused] = React.useState(false);

  const complete = current.length === length;
  const activeIndex = Math.min(current.length, length - 1);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value.replace(/\D/g, "").slice(0, length);
      if (!controlled) setInternal(next);
      onValueChange?.(next);
      if (next.length === length) onComplete?.(next);
    },
    [controlled, length, onValueChange, onComplete]
  );

  return (
    <div
      data-slot="sticker-otp"
      data-complete={complete || undefined}
      className={cn("relative w-fit", className)}
    >
      <div aria-hidden className="flex gap-2">
        {Array.from({ length }, (_, index) => {
          const char = current[index];
          const caret = focused && !complete && index === activeIndex;
          return (
            <span
              key={index}
              className={cn(
                "grid h-12 w-10 place-items-center rounded-lg font-mono text-lg font-semibold tabular-nums",
                "sticker border-border bg-transparent",
                "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-duck)]",
                caret && "border-primary",
                complete && "border-primary",
                disabled && "opacity-50"
              )}
            >
              {char ? (
                <span
                  key={char + index}
                  className="[animation:duck-pop_0.25s_var(--ease-squash)]"
                >
                  {char}
                </span>
              ) : caret ? (
                <span className="h-6 w-px bg-primary [animation:duck-caret_1s_step-end_infinite]" />
              ) : null}
            </span>
          );
        })}
      </div>

      {/* One input, lying across the whole strip. Transparent text and caret,
          because the cells above are doing the drawing. */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={length}
        disabled={disabled}
        value={current}
        onChange={handleChange}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cn(
          "absolute inset-0 w-full rounded-lg bg-transparent text-transparent caret-transparent outline-none",
          "selection:bg-transparent disabled:cursor-not-allowed",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
        {...props}
      />

      <span
        aria-live="polite"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg",
          complete && "duck-glow-primary [animation:duck-pop_0.35s_var(--ease-squash)]"
        )}
      >
        {/* Only the finish is worth announcing. A running count would talk
            over the user on every keystroke. */}
        <span className="sr-only">{complete ? "Code complete" : ""}</span>
      </span>
    </div>
  );
}

export { StickerOtp };
