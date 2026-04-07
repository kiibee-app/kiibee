export const INPUT_TYPE = {
  TEXT: "text",
  NUMBER: "number",
  TEL: "tel",
  TEXTAREA: "textarea",
} as const;

export type InputType = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];
