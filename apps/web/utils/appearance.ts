import { lightTheme } from "@repo/ui/theme/lightTheme";
import { CONTENTS } from "@/utils/translationKeys";
import { INPUT_TYPE } from "./ui";
import { maxReceiptCharacters } from "./Constants";

const FB_OK = /^#[0-9A-Fa-f]{6}$/i;

export const FORM_FIELDS = {
  TEXT_COLOR: "textColor",
  BUTTON_COLOR: "buttonColor",
  BUTTON_HEX: "buttonHex",
  LOGO_TYPE: "logoType",
  LOGO_NAME: "logoName",
  LOGO_URL: "logoUrl",
  DESCRIPTION: "description",
  RECEIPT: "receipt",
  SUPPORT_EMAIL: "supportEmail",
  DESKTOP_COVER_IMAGE_URL: "desktopCoverImageUrl",
  MOBILE_COVER_IMAGE_URL: "mobileCoverImageUrl",
  LAYOUT: "layout",
} as const;

export type FormFieldKey = (typeof FORM_FIELDS)[keyof typeof FORM_FIELDS];

/** Receipt section local form key (maps to {@link FORM_FIELDS.RECEIPT}). */
export const RECEIPT_FIELD = "receiptMessage" as const;

export const API_TEXT_COLOR = "default";
export const API_BUTTON_COLOR = "default";
export const UI_DEFAULT_COLOR = "default-color";

export const DEFAULT_HEX = lightTheme.colors.brand.dark;
export const FALLBACK_HEX = "#000000";
export const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;
export const HEX_COLOR_INPUT_RE = /^#?[0-9a-f]{6}$/i;

export function normalizeHexColor(value: string, fallback: string): string {
  const fb = (fallback.startsWith("#") ? fallback : `#${fallback}`).trim();
  const v = String(value).trim();
  if (/^#[0-9A-Fa-f]{6}$/i.test(v)) return v.toLowerCase();
  const raw = v.startsWith("#") ? v.slice(1) : v;
  if (/^[0-9A-Fa-f]{6}$/i.test(raw)) return `#${raw.toLowerCase()}`;
  return FB_OK.test(fb) ? fb.toLowerCase() : FALLBACK_HEX;
}

export const TEXT_COLOR_VALUES = {
  FOLLOW_THEME: "follow-theme",
  DARK_TEXT: "dark-text",
  WHITE_TEXT: "white-text",
} as const;

export const BUTTON_COLOR_VALUES = {
  DEFAULT: "default-color",
  CUSTOM: "choose-color",
} as const;

export const getTextColorOptions = (t: (key: string) => string) => [
  {
    value: TEXT_COLOR_VALUES.FOLLOW_THEME,
    label: t(CONTENTS.appearance.followTheme),
  },
  {
    value: TEXT_COLOR_VALUES.DARK_TEXT,
    label: t(CONTENTS.appearance.darkText),
  },
  {
    value: TEXT_COLOR_VALUES.WHITE_TEXT,
    label: t(CONTENTS.appearance.whiteText),
  },
];

export const getButtonColorOptions = (t: (key: string) => string) => [
  {
    value: BUTTON_COLOR_VALUES.DEFAULT,
    label: t(CONTENTS.appearance.defaultColor),
  },
  {
    value: BUTTON_COLOR_VALUES.CUSTOM,
    label: t(CONTENTS.appearance.chooseColor),
  },
];

export const getReceiptFields = (form: {
  receiptMessage: string;
  supportEmail: string;
}) => [
  {
    key: RECEIPT_FIELD,
    type: INPUT_TYPE.TEXTAREA,
    label: CONTENTS.appearance.receipt,
    hint: CONTENTS.appearance.receiptHint,
    placeholder: CONTENTS.appearance.receiptPlaceholder,
    value: form.receiptMessage,
    limit: maxReceiptCharacters,
    showCounter: true,
  },
  {
    key: "supportEmail" as const,
    type: INPUT_TYPE.EMAIL,
    label: CONTENTS.appearance.supportEmail,
    hint: CONTENTS.appearance.supportEmailHint,
    placeholder: CONTENTS.appearance.supportEmailPlaceholder,
    value: form.supportEmail,
  },
];
