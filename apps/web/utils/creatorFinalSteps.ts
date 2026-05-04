export type PaymentMethod = "card" | "mobilepay";

export const PAYMENT_METHODS = {
  CARD: "card" as PaymentMethod,
  MOBILEPAY: "mobilepay" as PaymentMethod,
};

export const FORM_FIELDS = {
  CARD_NUMBER: "cardNumber",
  CARDHOLDER_NAME: "cardholderName",
  EXPIRY_DATE: "expiryDate",
  CVC: "cvc",
} as const;

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = PAYMENT_METHODS.CARD;
