export const MODAL_WIDTHS = {
  sm: "480px",
  md: "630px",
  lg: "760px",
} as const;

export type ModalSize = keyof typeof MODAL_WIDTHS;

export const MODAL_PADDINGS = {
  lg: "40px 60px",
  xs: "40px 30px",
  md: "40px 44px",
  sm: "40px 32px",
  start: "30px",
  mobile: "32px 24px",
} as const;

export type ModalPadding = keyof typeof MODAL_PADDINGS;
