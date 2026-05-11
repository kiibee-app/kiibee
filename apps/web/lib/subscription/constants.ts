import { lightTheme } from "@repo/ui/theme/lightTheme";

export const SUBSCRIPTION_STEP = {
  PLAN: "plan",
  DETAILS: "details",
  PAYMENT: "payment",
} as const;

export const maxReceiptCharacters = 200;
export const maxDescriptionCharacters = 500;
export const maxLogoNameCharacters = 100;

export const APPEARANCE_DEFAULT_HEX_COLOR = lightTheme.colors.brand.dark;
