import type { InputHTMLAttributes } from "react";
export const INPUT_TYPE = {
  TEXT: "text",
  EMAIL: "email",
  NUMBER: "number",
  TEL: "tel",
  TEXTAREA: "textarea",
  PASSWORD: "password",
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
export const KEYBOARD = {
  ESCAPE: "Escape",
} as const;
export const EVENT = {
  KEYDOWN: "keydown",
} as const;
export const CSS_VALUE = {
  HIDDEN: "hidden",
  OVERFLOW: "overflow",
} as const;
export const LOADER_VARIANT = {
  OVERLAY: "overlay",
  INLINE: "inline",
  FULLPAGE: "fullpage",
} as const;
export const LOADER_SIZE = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;
export const DEFAULT_LOADER_SIZE = LOADER_SIZE.MD;
export const Directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;
export type Direction = (typeof Directions)[keyof typeof Directions];
export const SORT_DIRECTIONS = {
  NONE: "none",
  ASC: "asc",
  DESC: "desc",
} as const;
export type SortDirection = Exclude<
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS],
  "none"
>;
export type SortDirectionWithNone =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];
export const TABLE_ALIGN = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type TableAlign = (typeof TABLE_ALIGN)[keyof typeof TABLE_ALIGN];
export const KEYBOARD_KEYS = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
} as const;

export const BROWSER_API = {
  INTERSECTION_OBSERVER: "IntersectionObserver",
} as const;

export const INTERSECTION_OBSERVER_FALLBACK_DELAY_MS = 250;

export const MODAL_ALIGN = {
  CENTER: "center",
  START: "flex-start",
  END: "flex-end",
} as const;
export type ModalAlign = (typeof MODAL_ALIGN)[keyof typeof MODAL_ALIGN];

export const WEEK_DAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;
export const NOTIFICATION_MODAL = {
  SUCCESS: "success",
  DISCARD: "discard",
} as const;

export type NotificationModalType =
  | (typeof NOTIFICATION_MODAL)[keyof typeof NOTIFICATION_MODAL]
  | null;

export const FORM_MESSAGE_TONE = {
  ERROR: "error",
  SUCCESS: "success",
} as const;

export type FormMessageTone =
  (typeof FORM_MESSAGE_TONE)[keyof typeof FORM_MESSAGE_TONE];

export const LOGO_MODE = {
  TEXT: "text",
  PICTURE: "picture",
} as const;

export type Mode = (typeof LOGO_MODE)[keyof typeof LOGO_MODE];

export const IMAGE_MODAL = {
  UPLOAD: "upload",
  EDIT: "edit",
} as const;

export type ImageModalStep = (typeof IMAGE_MODAL)[keyof typeof IMAGE_MODAL];

export const isBrowser = typeof window !== "undefined";
export const canUseDOM = typeof document !== "undefined";
