import type { TFunction } from "i18next";
import { INPUT_TYPE } from "@/utils/ui";

export type ContactFormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  message: string;
};

export type ContactFormField = keyof ContactFormState;

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export type ContactFieldConfig = {
  key: ContactFormField;
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  type?: (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];
  full?: boolean;
  max?: number;
};

export const INITIAL_FORM: ContactFormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  phoneNumber: "",
  email: "",
  message: "",
};

export const validateField = (
  field: ContactFormField,
  value: string,
  t: TFunction,
) => {
  const trimmedValue = value.trim();

  if (field === "firstName" && !trimmedValue) {
    return t("supportPage.form.errors.firstNameRequired");
  }

  if (field === "email") {
    if (!trimmedValue) {
      return t("supportPage.form.errors.emailRequired");
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
    if (!isValidEmail) {
      return t("supportPage.form.errors.emailInvalid");
    }
  }

  if (field === "phoneNumber" && trimmedValue) {
    const isValidPhone = /^\d{6,20}$/.test(trimmedValue);
    if (!isValidPhone) {
      return t("supportPage.form.errors.phoneInvalid");
    }
  }

  if (field === "message" && !trimmedValue) {
    return t("supportPage.form.errors.messageRequired");
  }

  return "";
};

export const validateForm = (values: ContactFormState, t: TFunction) => {
  const nextErrors: ContactFormErrors = {};

  (Object.keys(values) as ContactFormField[]).forEach((field) => {
    const error = validateField(field, values[field], t);
    if (error) {
      nextErrors[field] = error;
    }
  });

  return nextErrors;
};

export const getSupportContactFields = (t: TFunction): ContactFieldConfig[] => [
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
    type: INPUT_TYPE.NUMBER,
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
