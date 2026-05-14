import { CONTENTS } from "@/utils/translationKeys";
import { INPUT_TYPE } from "./ui";
import { maxReceiptCharacters } from "./Constants";

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
    key: "receiptMessage" as const,
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
