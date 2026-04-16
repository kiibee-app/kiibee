import { INPUT_TYPE, InputType } from "./ui";

export type ViewerFormValues = {
  fullName: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreed: boolean;
};

export type ViewerFieldKey = Exclude<keyof ViewerFormValues, "agreed">;

export type ViewerFieldConfig = {
  key: ViewerFieldKey;
  labelKey: string;
  placeholderKey: string;
  type?: InputType;
  autoComplete?: string;
};

export type PasswordVisibility = {
  password: boolean;
  repeatPassword: boolean;
};

export const PASSWORD_FIELD_KEYS = ["password", "repeatPassword"] as const;

export const INITIAL_VIEWER_FORM: ViewerFormValues = {
  fullName: "",
  email: "",
  password: "",
  repeatPassword: "",
  agreed: false,
};

export const VIEWER_FIELDS: ViewerFieldConfig[] = [
  {
    key: "fullName",
    labelKey: "viewerSignup.form.fullName",
    placeholderKey: "viewerSignup.form.fullNamePlaceholder",
    autoComplete: "name",
  },
  {
    key: "email",
    labelKey: "viewerSignup.form.email",
    placeholderKey: "viewerSignup.form.emailPlaceholder",
    type: INPUT_TYPE.EMAIL,
    autoComplete: "email",
  },
  {
    key: "password",
    labelKey: "viewerSignup.form.password",
    placeholderKey: "viewerSignup.form.passwordPlaceholder",
    type: INPUT_TYPE.PASSWORD,
    autoComplete: "new-password",
  },
  {
    key: "repeatPassword",
    labelKey: "viewerSignup.form.repeatPassword",
    placeholderKey: "viewerSignup.form.repeatPasswordPlaceholder",
    type: INPUT_TYPE.PASSWORD,
    autoComplete: "new-password",
  },
];
