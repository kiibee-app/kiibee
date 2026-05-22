export const SMOOTH_SCROLL = {
  lerp: 0.08,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
  easingPower: 5,
  gsapTimeMultiplier: 1000,
} as const;

export const SMOOTH_SCROLL_EVENTS = {
  refresh: "refresh",
  load: "load",
  pageshow: "pageshow",
  orientationchange: "orientationchange",
  resize: "resize",
  visibilitychange: "visibilitychange",
} as const;
