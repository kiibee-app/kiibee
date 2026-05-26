import { DropdownOption } from "@/components/UI/SortDropdown";
import { TFunction } from "i18next";
import {
  PAYMENT_UNLIMITED_DOWNLOAD_LIMIT,
  PaymentDownloadLimitValue,
} from "./common";

export type TextConfig = {
  title?: string;
  description?: string;
  placeholder?: string;
  showVisibility?: boolean;
  linkField?: TrailerFieldKey;
};

export const TRAILER_FIELD_MAP = {
  TRAILER: "trailerLink",
  PHYSICAL_PRODUCT: "physicalProductLink",
} as const;

export type TrailerFieldKey =
  (typeof TRAILER_FIELD_MAP)[keyof typeof TRAILER_FIELD_MAP];

export const getAdmissionOptions = (
  t: TFunction,
): DropdownOption<AdmissionValue>[] => [
  {
    label: t("contents.payment.admission.options.free"),
    value: ADMISSION_TYPE.FREE,
  },
  {
    label: t("contents.payment.admission.options.payment"),
    value: ADMISSION_TYPE.PAYMENT,
  },
  {
    label: t("contents.payment.admission.options.setPassword"),
    value: ADMISSION_TYPE.SET_PASSWORD,
  },
  {
    label: t("contents.payment.admission.options.requestEmail"),
    value: ADMISSION_TYPE.REQUEST_EMAIL,
  },
];

export const ADMISSION_TYPE = {
  FREE: "free",
  PAYMENT: "payment",
  SET_PASSWORD: "set_password",
  REQUEST_EMAIL: "request_email",
} as const;

export type AdmissionValue =
  (typeof ADMISSION_TYPE)[keyof typeof ADMISSION_TYPE];

export const toText = (value: string | string[]) =>
  Array.isArray(value) ? value.join("") : value;

export const getPhysicalProductConfig = (t: TFunction) => ({
  title: t("contents.payment.physicalProduct.title"),
  description: t("contents.payment.physicalProduct.description"),
  placeholder: t("contents.payment.physicalProduct.placeholder"),
  showVisibility: false,
  linkField: TRAILER_FIELD_MAP.PHYSICAL_PRODUCT,
});

export const getDownloadLimitOptions = (
  t: TFunction,
  values: readonly PaymentDownloadLimitValue[],
): DropdownOption<PaymentDownloadLimitValue>[] =>
  values.map((value) => ({
    value,
    label:
      value === PAYMENT_UNLIMITED_DOWNLOAD_LIMIT
        ? t("contents.payment.downloadLimit.options.unlimited")
        : value,
  }));

export const PAYMENTS_FORM_FIELDS = {
  ADMISSION_REQUIREMENT: "admissionRequirement",
  RENTAL_AMOUNT: "rentalAmount",
  PURCHASE_AMOUNT: "purchaseAmount",
  MAX_DOWNLOAD_LIMIT: "maxDownloadLimit",
  TRAILER_LINK: "trailerLink",
  PHYSICAL_PRODUCT_LINK: "physicalProductLink",
  VISIBILITY: "visibility",
} as const;
export type PaymentFormField =
  (typeof PAYMENTS_FORM_FIELDS)[keyof typeof PAYMENTS_FORM_FIELDS];
