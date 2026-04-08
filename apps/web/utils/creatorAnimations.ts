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
