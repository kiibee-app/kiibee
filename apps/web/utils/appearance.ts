import { CONTENTS } from "@/utils/translationKeys";

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
