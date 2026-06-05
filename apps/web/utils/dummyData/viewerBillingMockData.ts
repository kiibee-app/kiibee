import masterCardLogo from "@/assets/icons/masterCard.svg";
import visaLogo from "@/assets/icons/visa.svg";
import design1 from "@/assets/images/design1.webp";
import design2 from "@/assets/images/design2.webp";
import design3 from "@/assets/images/design.webp";
import discover1 from "@/assets/images/discover-content/4ccc137164285071261595311fa290373bc45c72.webp";
import discover2 from "@/assets/images/discover-content/52c1c126e76296e3c8e39b9ac60f6d9a34156583.webp";
import discover3 from "@/assets/images/discover-content/3545227dd1e7a9cd6faf3b14586708d85137ed35.webp";
import discover4 from "@/assets/images/discover-content/c9051991a79ffc5a50dd15afe7b8c86e09f7faad.webp";

import { type CardBrand, CARD_BRANDS } from "../Constants";

export type ViewerPaymentMethod = {
  id: string;
  brand: CardBrand;
  label: string;
  cardNumber: string;
  expiresAt: string;
  securityCode?: string;
  isDefault?: boolean;
};

export type ViewerBillingHistoryItem = {
  id: string;
  contentTitle: string;
  contentImage: string;
  creatorName: string;
  type: string;
  paymentDate: string;
  amount: string;
  paymentMethod: {
    brand: CardBrand;
    last4: string;
  };
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
    cardNumber: "7654 3578 9854",
    expiresAt: "11/2030",
    securityCode: "346",
    isDefault: true,
  },
  {
    id: "pm-2",
    brand: CARD_BRANDS.MASTERCARD,
    label: "Mastercard **** 123",
    cardNumber: "3210 4567 8912",
    expiresAt: "11/2030",
    securityCode: "284",
  },
  {
    id: "pm-3",
    brand: CARD_BRANDS.VISA,
    label: "Visa **** 123",
    cardNumber: "6543 2198 7654",
    expiresAt: "11/2030",
    securityCode: "175",
  },
];

export const MOCK_VIEWER_BILLING_HISTORY: ViewerBillingHistoryItem[] = [
  {
    id: "bh-1",
    contentTitle: "Colorful sweater",
    contentImage: design1.src,
    creatorName: "Ashley Byrd",
    type: "Purchased",
    paymentDate: "17 Oct 2025",
    amount: "23 kr",
    paymentMethod: { brand: CARD_BRANDS.MASTERCARD, last4: "123" },
  },
  {
    id: "bh-2",
    contentTitle: "Mittens and beanie",
    contentImage: design2.src,
    creatorName: "Ashley Byrd",
    type: "Rented",
    paymentDate: "17 Oct 2025",
    amount: "50 kr",
    paymentMethod: { brand: CARD_BRANDS.VISA, last4: "456" },
  },
  {
    id: "bh-3",
    contentTitle: "Knitting pattern",
    contentImage: discover1.src,
    creatorName: "Helle Hansen",
    type: "Purchased",
    paymentDate: "17 Oct 2025",
    amount: "300 kr",
    paymentMethod: { brand: CARD_BRANDS.MASTERCARD, last4: "789" },
  },
  {
    id: "bh-4",
    contentTitle: "Poncho",
    contentImage: design3.src,
    creatorName: "Ashley Byrd",
    type: "Purchased",
    paymentDate: "19 Oct 2025",
    amount: "700 kr",
    paymentMethod: { brand: CARD_BRANDS.VISA, last4: "101" },
  },
  {
    id: "bh-5",
    contentTitle: "Greatest Book Cover",
    contentImage: discover2.src,
    creatorName: "Tom Wilson",
    type: "Rented",
    paymentDate: "21 Oct 2025",
    amount: "450 kr",
    paymentMethod: { brand: CARD_BRANDS.MASTERCARD, last4: "112" },
  },
  {
    id: "bh-6",
    contentTitle: "Sculpture",
    contentImage: discover3.src,
    creatorName: "Emma Smith",
    type: "Purchased",
    paymentDate: "21 Oct 2025",
    amount: "600 kr",
    paymentMethod: { brand: CARD_BRANDS.VISA, last4: "131" },
  },
  {
    id: "bh-7",
    contentTitle: "Deer",
    contentImage: discover1.src,
    creatorName: "James White",
    type: "Rented",
    paymentDate: "21 Oct 2025",
    amount: "350 kr",
    paymentMethod: { brand: CARD_BRANDS.MASTERCARD, last4: "415" },
  },
  {
    id: "bh-8",
    contentTitle: "Floating flowers",
    contentImage: discover4.src,
    creatorName: "Lily Green",
    type: "Purchased",
    paymentDate: "23 Oct 2025",
    amount: "800 kr",
    paymentMethod: { brand: CARD_BRANDS.VISA, last4: "718" },
  },
  {
    id: "bh-9",
    contentTitle: "Cactus",
    contentImage: design2.src,
    creatorName: "Rachel Adams",
    type: "Rented",
    paymentDate: "25 Oct 2025",
    amount: "550 kr",
    paymentMethod: { brand: CARD_BRANDS.MASTERCARD, last4: "919" },
  },
  {
    id: "bh-10",
    contentTitle: "Sculpture",
    contentImage: discover3.src,
    creatorName: "David Johnson",
    type: "Rented",
    paymentDate: "25 Oct 2025",
    amount: "400 kr",
    paymentMethod: { brand: CARD_BRANDS.VISA, last4: "202" },
  },
];
