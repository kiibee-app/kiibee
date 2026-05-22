import {
  CREATOR_SIGNUP_FIELD,
  NUMERIC_INPUT_MODE,
} from "@/utils/numericFields";
import { INPUT_TYPE, InputModeValue, InputType } from "@/utils/ui";

export type CreatorFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cvr: string;
  address: string;
  city: string;
  postalCode: string;
  workLink: string;
  contentDescription: string;
  agreed: boolean;
};

export type CreatorFieldKey = Exclude<keyof CreatorFormValues, "agreed">;

export type CreatorFieldConfig = {
  key: CreatorFieldKey;
  labelKey: string;
  required?: boolean;
  type?: InputType;
  inputMode?: InputModeValue;
  placeholderKey?: string;
};

export const INITIAL_CREATOR_FORM: CreatorFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  cvr: "",
  address: "",
  city: "",
  postalCode: "",
  workLink: "",
  contentDescription: "",
  agreed: false,
};

export const REQUIRED_CREATOR_FIELD_KEYS: CreatorFieldKey[] = [
  "firstName",
  "lastName",
  "email",
  "address",
  "city",
  "postalCode",
  "workLink",
  "contentDescription",
];

export const NAME_FIELDS: CreatorFieldConfig[] = [
  { key: "firstName", labelKey: "authCreator.form.firstName", required: true },
  { key: "lastName", labelKey: "authCreator.form.lastName", required: true },
];

export const EMAIL_FIELD: CreatorFieldConfig = {
  key: "email",
  labelKey: "authCreator.form.email",
  type: INPUT_TYPE.EMAIL,
  required: true,
};

export const CONTACT_FIELDS: CreatorFieldConfig[] = [
  {
    key: CREATOR_SIGNUP_FIELD.PHONE,
    labelKey: "authCreator.form.phone",
    inputMode: NUMERIC_INPUT_MODE,
  },
  {
    key: CREATOR_SIGNUP_FIELD.CVR,
    labelKey: "authCreator.form.cvr",
    inputMode: NUMERIC_INPUT_MODE,
  },
];

export const ADDRESS_FIELDS: CreatorFieldConfig[] = [
  { key: "address", labelKey: "authCreator.form.address", required: true },
  { key: "city", labelKey: "authCreator.form.city", required: true },
  {
    key: CREATOR_SIGNUP_FIELD.POSTAL_CODE,
    labelKey: "authCreator.form.postalCode",
    required: true,
    inputMode: NUMERIC_INPUT_MODE,
  },
];

export const WORK_LINK_FIELD: CreatorFieldConfig = {
  key: "workLink",
  labelKey: "authCreator.form.workLink",
  required: true,
};

export const CONTENT_FIELD: CreatorFieldConfig = {
  key: "contentDescription",
  labelKey: "authCreator.form.contentLabel",
  type: INPUT_TYPE.TEXTAREA,
  placeholderKey: "authCreator.form.contentPlaceholder",
  required: true,
};
