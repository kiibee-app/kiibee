import type {
  ContentAppearanceEntity,
  ContentAppearancePayload,
} from "@/types/contentAppearanceType";
import { BUTTON_COLOR_VALUES, TEXT_COLOR_VALUES } from "@/utils/appearance";
import type { CreatorLayoutKey } from "@/utils/creatorChannel";
import {
  DEFAULT_CREATOR_LAYOUT,
  isCreatorLayoutKey,
} from "@/utils/creatorChannel";
import { LOGO_MODE, type Mode } from "@/utils/ui";

export type AppearanceFormValues = {
  textColor: string;
  buttonColor: string;
  buttonHex: string;
  logoType: Mode;
  logoName: string;
  logoUrl: string | null;
  description: string;
  receipt: string;
  supportEmail: string;
  desktopCoverImageUrl: string | null;
  mobileCoverImageUrl: string | null;
  layout: CreatorLayoutKey;
};

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

const API_TEXT_COLOR_DEFAULT = "default";
const API_BUTTON_COLOR_DEFAULT = "default";

export function getDefaultAppearanceFormValues(): AppearanceFormValues {
  return {
    textColor: TEXT_COLOR_VALUES.FOLLOW_THEME,
    buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
    buttonHex: "#000000",
    logoType: LOGO_MODE.TEXT,
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
  if (!value || value === API_TEXT_COLOR_DEFAULT) {
    return TEXT_COLOR_VALUES.FOLLOW_THEME;
  }

  if (value === TEXT_COLOR_VALUES.FOLLOW_THEME) {
    return TEXT_COLOR_VALUES.FOLLOW_THEME;
  }

  if (
    value === TEXT_COLOR_VALUES.DARK_TEXT ||
    value === TEXT_COLOR_VALUES.WHITE_TEXT
  ) {
    return value;
  }

  return TEXT_COLOR_VALUES.FOLLOW_THEME;
}

function mapTextColorToApi(value: string): string {
  if (value === TEXT_COLOR_VALUES.FOLLOW_THEME) {
    return API_TEXT_COLOR_DEFAULT;
  }

  return value;
}

function mapButtonColorFromApi(value?: string | null): {
  buttonColor: string;
  buttonHex: string;
} {
  if (!value || value === API_BUTTON_COLOR_DEFAULT) {
    return {
      buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
      buttonHex: "#000000",
    };
  }

  if (HEX_COLOR_RE.test(value)) {
    return {
      buttonColor: BUTTON_COLOR_VALUES.CUSTOM,
      buttonHex: value.toLowerCase(),
    };
  }

  if (value === BUTTON_COLOR_VALUES.DEFAULT || value === "default-color") {
    return {
      buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
      buttonHex: "#000000",
    };
  }

  return {
    buttonColor: BUTTON_COLOR_VALUES.DEFAULT,
    buttonHex: "#000000",
  };
}

function mapButtonColorToApi(buttonColor: string, buttonHex: string): string {
  if (buttonColor === BUTTON_COLOR_VALUES.CUSTOM) {
    return buttonHex.toLowerCase();
  }

  return API_BUTTON_COLOR_DEFAULT;
}

function mapLogoTypeFromApi(value?: string | null): Mode {
  return value === LOGO_MODE.PICTURE ? LOGO_MODE.PICTURE : LOGO_MODE.TEXT;
}

export function mapAppearanceFromApi(
  data: ContentAppearanceEntity | null | undefined,
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
