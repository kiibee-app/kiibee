export type CardHeightState = 1 | 2 | 3;

export interface CardHeightDimensions {
  state1: number;
  state2: number;
  state3: number;
  width: number;
}

export const getCardHeightDimensions = (
  isMobile: boolean,
): CardHeightDimensions =>
  isMobile
    ? { state1: 165, state2: 190, state3: 220, width: 148 }
    : { state1: 240, state2: 275, state3: 300, width: 230 };

export const getCardHeightState = (
  index: number,
  activeIndex: number,
): CardHeightState => {
  if (index === activeIndex) return 3;
  if (Math.abs(index - activeIndex) === 1) return 2;
  return 1;
};

export const getCardHeight = (
  state: CardHeightState,
  dimensions: CardHeightDimensions,
): number => {
  if (state === 3) return dimensions.state3;
  if (state === 2) return dimensions.state2;
  return dimensions.state1;
};

export const HERO_MOTION = {
  textDuration: 0.9,
  textStagger: 0.1,
  ctaDuration: 0.72,
  cardEntranceDuration: 1.08,
  cardEntranceStagger: 0.11,
  cardResizeDuration: 0.45,
  hoverDuration: 0.42,
  hoverLift: 0,
  blurFrom: "blur(12px)",
  blurTo: "blur(0px)",
  easeBackOut: "back.out(1.35)",
  easeExpoOut: "expo.out",
} as const;
