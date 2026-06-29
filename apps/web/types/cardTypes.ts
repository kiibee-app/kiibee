import masterCardLogo from "@/assets/icons/masterCard.svg";
import visaLogo from "@/assets/icons/visa.svg";
import { type CardBrand, CARD_BRANDS } from "@/utils/Constants";

export const CARD_FORM_MODE = {
  ADD: "add",
  EDIT: "edit",
} as const;

export type CardFormMode = (typeof CARD_FORM_MODE)[keyof typeof CARD_FORM_MODE];

export type CardFormErrors = {
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
};

export type PaymentMethodPayload = {
  cardNumber?: string;
  expiryDate: string;
  securityCode: string;
};

export type ViewerPaymentMethod = {
  id: string;
  brand: CardBrand;
  label: string;
  cardNumber: string;
  expiresAt: string;
  isDefault?: boolean;
};

export type BackendPaymentMethod = {
  id: string;
  brand: string;
  label: string;
  lastFour: string;
  cardNumber: string;
  expiresAt: string;
  isDefault: boolean;
};

export type PaymentMethodsResponse = {
  data: BackendPaymentMethod[];
  message: string;
  statusCode: number;
};

export const CARD_BRAND_LOGOS: Record<CardBrand, string> = {
  [CARD_BRANDS.VISA]: visaLogo,
  [CARD_BRANDS.MASTERCARD]: masterCardLogo,
};

export type CardFormPayload = PaymentMethodPayload;
export type AddCardErrors = CardFormErrors;
