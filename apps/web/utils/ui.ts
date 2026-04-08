import type { InputHTMLAttributes } from "react";

export const INPUT_TYPE = {
  TEXT: "text",
  EMAIL: "email",
  NUMBER: "number",
  TEL: "tel",
  TEXTAREA: "textarea",
} as const;

export type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

export const INPUT_FIELD_CONTAINER_TAGS = {
  FIELDSET: "fieldset",
  DIV: "div",
} as const;

export const INPUT_FIELD_LABEL_TAGS = {
  LEGEND: "legend",
  LABEL: "label",
} as const;

export const INPUT_FIELD_ROLES = {
  GROUP: "group",
} as const;

export const INPUT_FIELD_ARIA_INVALID_VALUES = [
  "false",
  "true",
  "grammar",
  "spelling",
] as const;

export type InputFieldContainerTag =
  (typeof INPUT_FIELD_CONTAINER_TAGS)[keyof typeof INPUT_FIELD_CONTAINER_TAGS];

export type InputFieldLabelTag =
  (typeof INPUT_FIELD_LABEL_TAGS)[keyof typeof INPUT_FIELD_LABEL_TAGS];

export type InputFieldRole =
  (typeof INPUT_FIELD_ROLES)[keyof typeof INPUT_FIELD_ROLES];

export type AriaInvalidStringValue =
  (typeof INPUT_FIELD_ARIA_INVALID_VALUES)[number];

export type AriaInvalidValue = boolean | AriaInvalidStringValue;

export type InputModeValue = InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
>["inputMode"];

export type AutoCompleteValue = InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
>["autoComplete"];

export const Directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;

export type Direction = (typeof Directions)[keyof typeof Directions];
