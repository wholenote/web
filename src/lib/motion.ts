/** Read at interaction time so a changed OS preference takes effect immediately. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollBehavior = (): ScrollBehavior => prefersReducedMotion() ? "instant" : "smooth";
