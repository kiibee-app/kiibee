import { INPUT_TYPE, InputModeValue } from "@/utils/ui";

export type ContactFormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  message: string;
};

export type ContactFormField = keyof ContactFormState;

export type ContactFieldConfig = {
  key: ContactFormField;
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  type?: (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];
  inputMode?: InputModeValue;
  full?: boolean;
  max?: number;
};

export const getSupportContactFields = (
  t: (key: string) => string,
): ContactFieldConfig[] => [
  {
    key: "firstName",
    label: t("supportPage.form.firstName"),
    placeholder: t("supportPage.form.placeholders.firstName"),
    required: true,
    autoComplete: "given-name",
  },
  {
    key: "lastName",
    label: t("supportPage.form.lastName"),
    placeholder: t("supportPage.form.placeholders.lastName"),
    autoComplete: "family-name",
  },
  {
    key: "companyName",
    label: t("supportPage.form.companyName"),
    placeholder: t("supportPage.form.placeholders.companyName"),
    autoComplete: "organization",
  },
  {
    key: "phoneNumber",
    label: t("supportPage.form.phoneNumber"),
    placeholder: t("supportPage.form.placeholders.phoneNumber"),
    type: INPUT_TYPE.TEXT,
    inputMode: "tel",
    autoComplete: "tel",
  },
  {
    key: "email",
    label: t("supportPage.form.email"),
    placeholder: t("supportPage.form.placeholders.email"),
    type: INPUT_TYPE.EMAIL,
    required: true,
    autoComplete: "email",
    full: true,
  },
  {
    key: "message",
    label: t("supportPage.form.message"),
    placeholder: t("supportPage.form.placeholders.message"),
    type: INPUT_TYPE.TEXTAREA,
    required: true,
    full: true,
    max: 500,
  },
];
