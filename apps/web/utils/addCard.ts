import { z } from "zod";

export type AddCardErrors = {
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
};

export const CARD_FIELDS = {
  CARD_NUMBER: "cardNumber",
  EXPIRY_DATE: "expiryDate",
  SECURITY_CODE: "securityCode",
} as const;

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiryDate = (value: string) => {
  let formatted = value.replace(/\D/g, "");
  if (formatted.length > 2) {
    formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
  }

  return formatted;
};

export const formatCVV = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4);

export const AddCardSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine((val) => /^\d{16}$/.test(val), {
      message: "Card number must be 16 digits",
    }),

  expiryDate: z.string().superRefine((val, ctx) => {
    const match = val.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid format (MM/YY)",
      });
      return;
    }

    const month = Number(match[1]);
    const year = Number("20" + match[2]);
    if (month < 1 || month > 12) {
      ctx.addIssue({ code: "custom", message: "Invalid month" });
      return;
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      ctx.addIssue({ code: "custom", message: "Card expired" });
    }
  }),

  securityCode: z.string().refine((val) => /^\d{3,4}$/.test(val), {
    message: "CVV must be 3 or 4 digits",
  }),
});
