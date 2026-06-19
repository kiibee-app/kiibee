export const SMOOTH_SCROLL = {
  lerp: 0.15,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
  easingPower: 5,
  gsapTimeMultiplier: 1000,
  refreshDelay: 0.15,
} as const;

export const SMOOTH_SCROLL_EVENTS = {
  refresh: "refresh",
  load: "load",
  pageshow: "pageshow",
  orientationchange: "orientationchange",
  resize: "resize",
  visibilitychange: "visibilitychange",
} as const;

export const SCROLL_REVEAL = {
  delay: 0,
  sequenceDelayStep: 0.12,
  yFrom: 30,
  duration: 1.2,
  start: "top 85%",
  onceToggleActions: "play none none none",
  toggleActions: "play none none reverse",
  initialVisibility: "hidden",
  initialOpacity: 0,
  willChange: "opacity, transform",
} as const;

export const SAFE_IMAGE_FALLBACKS = {
  default: "/images/fallbacks/default.svg",
  avatar: "/images/fallbacks/avatar.svg",
  thumbnail: "/images/fallbacks/thumbnail.svg",
  hero: "/images/fallbacks/hero.svg",
} as const;

export const SAFE_IMAGE_DECODING = "async" as const;

export const LANDING_REVEAL = {
  sequenceStepDelay: 0.1,
  ctaSubtitleDelay: 0.1,
  ctaSubtitleStepDelay: 0.1,
  ctaCardStaggerDelay: 0.08,
  shortDelay: 0.1,
  mediumDelay: 0.2,
  revealDuration: 1.2,
  longRevealDuration: 1.4,
  extraLongRevealDuration: 1.6,
  heroKenBurnsDuration: 1.8,
  heroStart: "top 100%",
  imageRevealStart: "top 88%",
} as const;

export const LANDING_IMAGE_FLAGS = {
  fill: true,
  priority: true,
  eagerLoading: "eager",
} as const;

export const LANDING_IMAGE_DIMENSIONS = {
  watchingSteps: {
    width: 640,
    height: 479,
  },
  discoverMediaIcon: {
    width: 24,
    height: 24,
  },
} as const;

export const LANDING_REVEAL_VARIANTS = {
  fadeScale: "fade-scale",
  slideLeft: "slide-left",
  slideRight: "slide-right",
  slideUp: "slide-up",
  kenBurns: "ken-burns",
} as const;

export const LANDING_MOTION = {
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  noReducedMotionQuery: "(prefers-reduced-motion: no-preference)",
  clearPropsAll: "all",
  visibilityInherit: "inherit",
  sectionSelector: "section",
  scrollRevealSelector: "[data-scroll-reveal]",
  sectionFadeInitializedKey: "sectionFadeInitialized",
  variantKenBurns: "ken-burns",
  variantClipReveal: "clip-reveal",
  variantSlideLeft: "slide-left",
  variantSlideRight: "slide-right",
  variantSlideUp: "slide-up",
  easePower2Out: "power2.out",
  easePower3Out: "power3.out",
  easePower3InOut: "power3.inOut",
  clipPathHidden: "inset(0 0 100% 0)",
  clipPathVisible: "inset(0 0 0% 0)",
  slideLeftFrom: -8,
  slideRightFrom: 8,
  slideUpFrom: 6,
  slideUpScaleFrom: 0.97,
  hiddenAlpha: 0,
  visibleAlpha: 1,
  defaultScaleTo: 1,
  defaultPositionTo: 0,
} as const;

export const CARD_IMAGE_RATIOS = [80, 100, 120] as const;
