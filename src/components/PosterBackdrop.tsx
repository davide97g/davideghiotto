/**
 * Full-screen poster behind the home page, in place of the WebGL backdrop.
 * The poster is portrait, so on a landscape screen `object-cover` keeps the
 * face and the headline (upper-middle of the frame) and lets the legs go.
 * The bottom scrim fades it into the canvas so the sections below stay legible.
 */
export default function PosterBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 bg-background" aria-hidden>
      <picture>
        <source srcSet="/bg-poster-it-1952.avif" type="image/avif" />
        <img
          src="/bg-poster-it-1200.jpg"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="block h-full w-full object-cover object-[50%_6%]"
        />
      </picture>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-background/35 to-background/85" />
    </div>
  );
}
