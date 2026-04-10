import { INPUT_TYPE, InputType } from "@/utils/ui";

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
  { key: "phone", labelKey: "authCreator.form.phone", type: INPUT_TYPE.TEL },
  { key: "cvr", labelKey: "authCreator.form.cvr" },
];

export const ADDRESS_FIELDS: CreatorFieldConfig[] = [
  { key: "address", labelKey: "authCreator.form.address", required: true },
  { key: "city", labelKey: "authCreator.form.city", required: true },
  {
    key: "postalCode",
    labelKey: "authCreator.form.postalCode",
    required: true,
  },
];

export const WORK_LINK_FIELD: CreatorFieldConfig = {
  key: "workLink",
  labelKey: "authCreator.form.workLink",
};

export const CONTENT_FIELD: CreatorFieldConfig = {
  key: "contentDescription",
  labelKey: "authCreator.form.contentLabel",
  type: INPUT_TYPE.TEXTAREA,
  placeholderKey: "authCreator.form.contentPlaceholder",
  required: true,
};
