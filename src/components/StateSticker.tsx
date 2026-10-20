import { cn } from "@/lib/utils";

export type StickerState = "empty" | "loading" | "error" | "success" | "notfound" | "offline";

/**
 * The status stickers: the logo character, die-cut, one per UI state. Generated
 * as a set with Codex image generation from `logo-mark.png` (prompt and 1254 px
 * masters in `drafts/stickers/`) so empty, loading and error screens share one
 * voice instead of each drawing its own icon. Shipped as 640 px WebP with alpha
 * (svt-av1 cannot encode alpha, so no AVIF) and a 320 px PNG fallback.
 * Decorative — the copy beside it carries the meaning.
 */
export function StateSticker({
  state,
  className,
  float = false,
}: {
  state: StickerState;
  className?: string;
  /** Bob gently, for screens that wait. Off under reduced motion. */
  float?: boolean;
}) {
  return (
    <picture aria-hidden className={cn("block select-none", className)}>
      <source type="image/webp" srcSet={`/stickers/sticker-${state}.webp`} />
      <img
        src={`/stickers/sticker-${state}.png`}
        alt=""
        width={320}
        height={320}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn(
          "size-full object-contain drop-shadow-[0_12px_24px_rgb(0_0_0/0.45)]",
          float && "motion-safe:[animation:duck-float_5s_ease-in-out_infinite]"
        )}
      />
    </picture>
  );
}
