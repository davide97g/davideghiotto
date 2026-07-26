/**
 * Shared scroll state, written by the Lenis bridge and read inside
 * requestAnimationFrame loops (the shader backdrop, the progress rail).
 *
 * Deliberately a mutable module singleton rather than React state: these values
 * change every frame and must never trigger a re-render.
 */
export const scrollSignal = {
  /** 0 → 1 through the whole document. */
  progress: 0,
  /** Raw Lenis velocity, roughly -60 → 60 on a fast flick. */
  velocity: 0,
};
