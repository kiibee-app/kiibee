import masterCardLogo from "@/assets/icons/masterCard.svg";
import visaLogo from "@/assets/icons/visa.svg";

export const CARD_BRANDS = {
  VISA: "visa",
  MASTERCARD: "mastercard",
} as const;

export type CardBrand = (typeof CARD_BRANDS)[keyof typeof CARD_BRANDS];

export type ViewerPaymentMethod = {
  id: string;
  brand: CardBrand;
  label: string;
  expiresAt: string;
  isDefault?: boolean;
};

export type ViewerBillingHistoryItem = {
  id: string;
  item: string;
  amount: string;
  date: string;
};

export const CARD_BRAND_LOGOS: Record<CardBrand, string> = {
  [CARD_BRANDS.VISA]: visaLogo,
  [CARD_BRANDS.MASTERCARD]: masterCardLogo,
};

export const MOCK_VIEWER_PAYMENT_METHODS: ViewerPaymentMethod[] = [
  {
    id: "pm-1",
    brand: CARD_BRANDS.VISA,
    label: "Visa **** 123",
    expiresAt: "11/2030",
    isDefault: true,
  },
  {
    id: "pm-2",
    brand: CARD_BRANDS.MASTERCARD,
    label: "Mastercard **** 123",
    expiresAt: "11/2030",
  },
  {
    id: "pm-3",
    brand: CARD_BRANDS.VISA,
    label: "Visa **** 123",
    expiresAt: "11/2030",
  },
];

export const MOCK_VIEWER_BILLING_HISTORY: ViewerBillingHistoryItem[] = [];
