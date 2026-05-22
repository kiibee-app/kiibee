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
