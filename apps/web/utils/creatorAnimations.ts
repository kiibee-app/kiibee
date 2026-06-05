export interface CardDimensions {
  activeWidth: string | number;
  inactiveWidth: string | number;
  activePadding: [number, number, number, number];
  inactivePadding: [number, number, number, number];
}

export interface SpringTransition {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

export const getCardDimensions = (isMobile: boolean): CardDimensions => ({
  activeWidth: isMobile ? "56vw" : 498,
  inactiveWidth: isMobile ? "18vw" : 154,
  activePadding: isMobile ? [20, 16, 18, 14] : [34, 54, 26, 20],
  inactivePadding: isMobile ? [18, 0, 18, 0] : [26, 0, 26, 0],
});

export const springTransition: SpringTransition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.7,
};

export const createCardTransition = (): {
  width: SpringTransition;
  paddingTop: SpringTransition;
  paddingRight: SpringTransition;
  paddingLeft: SpringTransition;
  paddingBottom: SpringTransition;
} => ({
  width: springTransition,
  paddingTop: springTransition,
  paddingRight: springTransition,
  paddingLeft: springTransition,
  paddingBottom: springTransition,
});

export interface CardAnimation {
  width: string | number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  [key: `--${string}`]: string | number;
}

export const getCardAnimation = (
  isActive: boolean,
  dimensions: CardDimensions,
): CardAnimation => ({
  width: isActive ? dimensions.activeWidth : dimensions.inactiveWidth,
  paddingTop: isActive
    ? dimensions.activePadding[0]
    : dimensions.inactivePadding[0],
  paddingRight: isActive
    ? dimensions.activePadding[1]
    : dimensions.inactivePadding[1],
  paddingBottom: isActive
    ? dimensions.activePadding[2]
    : dimensions.inactivePadding[2],
  paddingLeft: isActive
    ? dimensions.activePadding[3]
    : dimensions.inactivePadding[3],
});

export const HERO_MOTION = {
  textDuration: 0.9,
  textStagger: 0.1,
  ctaDuration: 0.72,
  cardEntranceDuration: 1.08,
  cardEntranceStagger: 0.11,
  cardResizeDuration: 0.82,
  hoverDuration: 0.42,
  hoverLift: -8,
  blurFrom: "blur(12px)",
  blurTo: "blur(0px)",
  easeBackOut: "back.out(1.35)",
  easeExpoOut: "expo.out",
} as const;
