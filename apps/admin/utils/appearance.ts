import type {
  AppearanceFormValues,
  ContentAppearance,
  ContentAppearancePayload,
  CreatorLayoutKey,
  LogoType,
} from "../types/content-appearance";
import { CREATOR_LAYOUT_KEY, DEFAULT_CREATOR_LAYOUT } from "./constants";

export const API_TEXT_COLOR = "default";
export const API_BUTTON_COLOR = "default";
export const FALLBACK_HEX = "#000000";
export const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

export const TEXT_COLOR_VALUES = {
  FOLLOW_THEME: "follow-theme",
  DARK_TEXT: "dark-text",
  WHITE_TEXT: "white-text",
} as const;

export const BUTTON_COLOR_VALUES = {
  DEFAULT: "default-color",
  CUSTOM: "choose-color",
} as const;

export const LOGO_TYPE = {
  TEXT: "text",
  PICTURE: "picture",
} as const satisfies Record<string, LogoType>;

export const LAYOUT_OPTIONS: {
  key: CreatorLayoutKey;
  label: string;
  description: string;
}[] = [
  {
    key: CREATOR_LAYOUT_KEY.LAYOUT1,
    label: "Layout 1",
    description: "Classic channel layout",
  },
  {
    key: CREATOR_LAYOUT_KEY.LAYOUT2,
    label: "Layout 2",
    description: "Centered cover layout",
  },
  {
    key: CREATOR_LAYOUT_KEY.LAYOUT3,
    label: "Layout 3",
    description: "Compact profile layout",
  },
];

export const TEXT_COLOR_OPTIONS = [
  { value: TEXT_COLOR_VALUES.FOLLOW_THEME, label: "Follow theme" },
  { value: TEXT_COLOR_VALUES.DARK_TEXT, label: "Dark text" },
  { value: TEXT_COLOR_VALUES.WHITE_TEXT, label: "White text" },
];

export const BUTTON_COLOR_OPTIONS = [
  { value: BUTTON_COLOR_VALUES.DEFAULT, label: "Default color" },
  { value: BUTTON_COLOR_VALUES.CUSTOM, label: "Choose color" },
];

export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_LOGO_NAME_LENGTH = 100;
export const MAX_RECEIPT_LENGTH = 200;

export function isCreatorLayoutKey(value: string): value is CreatorLayoutKey {
  return (
    value === CREATOR_LAYOUT_KEY.LAYOUT1 ||
    value === CREATOR_LAYOUT_KEY.LAYOUT2 ||
    value === CREATOR_LAYOUT_KEY.LAYOUT3
  );
}

export function getDefaultAppearanceFormValues(): AppearanceFormValues {
  return {
    textColor: TEXT_COLOR_VALUES.FOLLOW_THEME,
    buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
    buttonHex: FALLBACK_HEX,
    logoType: LOGO_TYPE.TEXT,
    logoName: "",
    logoUrl: null,
    description: "",
    receipt: "",
    supportEmail: "",
    desktopCoverImageUrl: null,
    mobileCoverImageUrl: null,
    layout: DEFAULT_CREATOR_LAYOUT,
  };
}

function mapTextColorFromApi(value?: string | null): string {
  if (!value || value === API_TEXT_COLOR) {
    return TEXT_COLOR_VALUES.FOLLOW_THEME;
  }

  if (
    value === TEXT_COLOR_VALUES.FOLLOW_THEME ||
    value === TEXT_COLOR_VALUES.DARK_TEXT ||
    value === TEXT_COLOR_VALUES.WHITE_TEXT
  ) {
    return value;
  }

  return TEXT_COLOR_VALUES.FOLLOW_THEME;
}

function mapTextColorToApi(value: string): string {
  if (value === TEXT_COLOR_VALUES.FOLLOW_THEME) {
    return API_TEXT_COLOR;
  }
  return value;
}

function mapButtonColorFromApi(value?: string | null): {
  buttonColor: string;
  buttonHex: string;
} {
  if (!value || value === API_BUTTON_COLOR) {
    return {
      buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
      buttonHex: FALLBACK_HEX,
    };
  }

  if (HEX_COLOR_RE.test(value)) {
    return {
      buttonColor: BUTTON_COLOR_VALUES.CUSTOM,
      buttonHex: value.toLowerCase(),
    };
  }

  return {
    buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
    buttonHex: FALLBACK_HEX,
  };
}

function mapButtonColorToApi(buttonColor: string, buttonHex: string): string {
  if (buttonColor === BUTTON_COLOR_VALUES.CUSTOM) {
    return buttonHex.toLowerCase();
  }
  return API_BUTTON_COLOR;
}

function mapLogoTypeFromApi(value?: string | null): LogoType {
  return value === LOGO_TYPE.PICTURE ? LOGO_TYPE.PICTURE : LOGO_TYPE.TEXT;
}

export function mapAppearanceFromApi(
  data: ContentAppearance | null | undefined,
  layoutFallback: CreatorLayoutKey = DEFAULT_CREATOR_LAYOUT,
): AppearanceFormValues {
  if (!data) {
    return { ...getDefaultAppearanceFormValues(), layout: layoutFallback };
  }

  const { buttonColor, buttonHex } = mapButtonColorFromApi(data.buttonColor);
  const layout =
    data.layout && isCreatorLayoutKey(data.layout)
      ? data.layout
      : layoutFallback;

  return {
    textColor: mapTextColorFromApi(data.textColor),
    buttonColor,
    buttonHex,
    logoType: mapLogoTypeFromApi(data.logoType),
    logoName: data.logoName ?? "",
    logoUrl: data.logoUrl ?? null,
    description: data.description ?? "",
    receipt: data.receipt ?? "",
    supportEmail: data.supportEmail ?? "",
    desktopCoverImageUrl: data.desktopCoverImageUrl ?? null,
    mobileCoverImageUrl: data.mobileCoverImageUrl ?? null,
    layout,
  };
}

export function mapAppearanceToApi(
  values: AppearanceFormValues,
): ContentAppearancePayload {
  return {
    textColor: mapTextColorToApi(values.textColor),
    buttonColor: mapButtonColorToApi(values.buttonColor, values.buttonHex),
    logoType: values.logoType,
    logoName: values.logoName,
    logoUrl: values.logoUrl,
    description: values.description,
    layout: values.layout,
    desktopCoverImageUrl: values.desktopCoverImageUrl,
    mobileCoverImageUrl: values.mobileCoverImageUrl,
    receipt: values.receipt,
    supportEmail: values.supportEmail,
  };
}

export function areAppearanceValuesEqual(
  a: AppearanceFormValues,
  b: AppearanceFormValues,
): boolean {
  return (
    a.textColor === b.textColor &&
    a.buttonColor === b.buttonColor &&
    a.buttonHex === b.buttonHex &&
    a.logoType === b.logoType &&
    a.logoName === b.logoName &&
    a.logoUrl === b.logoUrl &&
    a.description === b.description &&
    a.receipt === b.receipt &&
    a.supportEmail === b.supportEmail &&
    a.desktopCoverImageUrl === b.desktopCoverImageUrl &&
    a.mobileCoverImageUrl === b.mobileCoverImageUrl &&
    a.layout === b.layout
  );
}
