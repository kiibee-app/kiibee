export const VARIANT = {
  PRIMARY: "primary",
  PRIMARY_LITE: "primary-lite",
  SECONDARY: "secondary",
  SOFT_OUTLINE: "soft-outline",
  DANGER: "danger",
} as const;

export type Variant = (typeof VARIANT)[keyof typeof VARIANT];

export const SIZE = {
  LG: "lg",
  MD: "md",
  SM: "sm",
} as const;

export type SIZE = (typeof SIZE)[keyof typeof SIZE];

export const INPUT_VARIANTS = {
  DEFAULT: "default",
  PRIMARY_GRAY: "primaryGray",
  SURFACE: "surface",
} as const;

export type InputVariant = (typeof INPUT_VARIANTS)[keyof typeof INPUT_VARIANTS];

export const SORT_DROPDOWN_VARIANT = {
  DEFAULT: "default",
  SURFACE: "surface",
  SUCCESS: "success",
} as const;

export type SortDropdownVariant =
  (typeof SORT_DROPDOWN_VARIANT)[keyof typeof SORT_DROPDOWN_VARIANT];

export const BG_GREEN = "green";
export const BG_WHITE = "white";
export type BgVariant = typeof BG_GREEN | typeof BG_WHITE;
