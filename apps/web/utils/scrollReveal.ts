export const SCROLL_REVEAL = {
  delay: 0,
  sequenceDelayStep: 0.12,
  yFrom: 30,
  blurFrom: "blur(12px)",
  blurTo: "blur(0px)",
  duration: 1.2,
  start: "top 85%",
  toggleActions: "play none none reverse",
  initialVisibility: "hidden",
  initialOpacity: 0,
  willChange: "opacity, transform, filter",
} as const;
