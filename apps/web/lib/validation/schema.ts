import { z } from "zod";
import {
  BUTTON_COLOR_VALUES,
  HEX_COLOR_INPUT_RE,
  TEXT_COLOR_VALUES,
} from "@/utils/appearance";
import { LOGO_MODE } from "@/utils/ui";

export const createLoginSchema = (messages: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z.string().trim().min(1, messages.passwordRequired),
  });

export const createViewerSignupSchema = (messages: {
  fullNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  repeatPasswordRequired: string;
  passwordMismatch: string;
  consentRequired: string;
}) =>
  z
    .object({
      fullName: z.string().trim().min(1, messages.fullNameRequired),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      password: z.string().trim().min(1, messages.passwordRequired),
      repeatPassword: z.string().trim().min(1, messages.repeatPasswordRequired),
      agreed: z.boolean(),
    })
    .refine((values) => values.password === values.repeatPassword, {
      message: messages.passwordMismatch,
      path: ["repeatPassword"],
    })
    .refine((values) => values.agreed, {
      message: messages.consentRequired,
      path: ["agreed"],
    });

export const createCreatorRequestSchema = (messages: {
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  addressRequired: string;
  cityRequired: string;
  postalCodeRequired: string;
  workLinkRequired: string;
  workLinkInvalid: string;
  contentDescriptionRequired: string;
  consentRequired: string;
}) =>
  z
    .object({
      firstName: z.string().trim().min(1, messages.firstNameRequired),
      lastName: z.string().trim().min(1, messages.lastNameRequired),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      phone: z.string(),
      cvr: z.string(),
      address: z.string().trim().min(1, messages.addressRequired),
      city: z.string().trim().min(1, messages.cityRequired),
      postalCode: z.string().trim().min(1, messages.postalCodeRequired),
      workLink: z
        .string()
        .trim()
        .min(1, messages.workLinkRequired)
        .url(messages.workLinkInvalid),
      contentDescription: z
        .string()
        .trim()
        .min(1, messages.contentDescriptionRequired),
      agreed: z.boolean(),
    })
    .refine((values) => values.agreed, {
      message: messages.consentRequired,
      path: ["agreed"],
    });

export const createCreatorProfileSchema = (messages: {
  firstNameRequired: string;
  lastNameRequired: string;
  cvrInvalid: string;
}) =>
  z
    .object({
      firstName: z.string().trim().min(2, messages.firstNameRequired),
      lastName: z.string().trim().min(2, messages.lastNameRequired),
      cvr: z
        .string()
        .trim()
        .refine((val) => val.length === 0 || val.length >= 8, {
          message: messages.cvrInvalid,
        }),
    })
    .passthrough();

export const createSupportContactSchema = (messages: {
  firstNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneInvalid: string;
  messageRequired: string;
}) =>
  z.object({
    firstName: z.string().trim().min(1, messages.firstNameRequired),
    lastName: z.string(),
    companyName: z.string(),
    phoneNumber: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || /^\d{6,20}$/.test(value), {
        message: messages.phoneInvalid,
      }),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    message: z.string().trim().min(1, messages.messageRequired),
  });

export const createPaymentSchema = (messages: {
  cardNumberRequired: string;
  cardholderNameRequired: string;
  expiryDateRequired: string;
  cvcRequired: string;
}) =>
  z.object({
    cardNumber: z.string().trim().min(1, messages.cardNumberRequired),
    cardholderName: z.string().trim().min(1, messages.cardholderNameRequired),
    expiryDate: z.string().trim().min(1, messages.expiryDateRequired),
    cvc: z.string().trim().min(1, messages.cvcRequired),
  });

export const createResetPasswordSchema = (
  messages: {
    currentRequired: string;
    nextRequired: string;
    confirmRequired: string;
    confirmMismatch: string;
    newMustDifferFromCurrent: string;
  },
  options?: {
    nextMinLength?: { min: number; message: string };
  },
) => {
  const nextField = options?.nextMinLength
    ? z
        .string()
        .trim()
        .min(1, messages.nextRequired)
        .min(options.nextMinLength.min, options.nextMinLength.message)
    : z.string().trim().min(1, messages.nextRequired);

  return z
    .object({
      current: z.string().trim().min(1, messages.currentRequired),
      next: nextField,
      confirm: z.string().trim().min(1, messages.confirmRequired),
    })
    .refine((values) => values.current.trim() !== values.next.trim(), {
      message: messages.newMustDifferFromCurrent,
      path: ["next"],
    })
    .refine((values) => values.next === values.confirm, {
      message: messages.confirmMismatch,
      path: ["confirm"],
    });
};

export const createAppearanceSchema = (messages: {
  invalidHex: string;
  invalidSupportEmail: string;
  descriptionRequired: string;
  logoNameRequired: string;
  logoImageRequired: string;
  desktopCoverRequired: string;
  mobileCoverRequired: string;
  layoutRequired: string;
}) =>
  z
    .object({
      buttonColor: z.string(),
      buttonHex: z.string().trim(),
      textColor: z.string(),
      logoType: z.string(),
      logoName: z.string().trim(),
      logoUrl: z.string().nullable(),
      description: z.string().trim(),
      desktopCoverImageUrl: z.string().nullable(),
      mobileCoverImageUrl: z.string().nullable(),
      layout: z.string().trim(),
      supportEmail: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (
        !Object.values(TEXT_COLOR_VALUES).includes(values.textColor as never)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["textColor"],
          message: messages.layoutRequired,
        });
      }

      if (!values.description) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["description"],
          message: messages.descriptionRequired,
        });
      }

      if (
        values.buttonColor === BUTTON_COLOR_VALUES.CUSTOM &&
        !HEX_COLOR_INPUT_RE.test(values.buttonHex)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["buttonHex"],
          message: messages.invalidHex,
        });
      }

      if (
        values.buttonColor !== BUTTON_COLOR_VALUES.DEFAULT &&
        values.buttonColor !== BUTTON_COLOR_VALUES.CUSTOM
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["buttonColor"],
          message: messages.layoutRequired,
        });
      }

      if (
        values.logoType !== LOGO_MODE.TEXT &&
        values.logoType !== LOGO_MODE.PICTURE
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["logoType"],
          message: messages.layoutRequired,
        });
      }

      if (values.logoType === LOGO_MODE.TEXT && !values.logoName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["logoName"],
          message: messages.logoNameRequired,
        });
      }

      if (values.logoType === LOGO_MODE.PICTURE && !values.logoUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["logoUrl"],
          message: messages.logoImageRequired,
        });
      }

      if (!values.desktopCoverImageUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["desktopCoverImageUrl"],
          message: messages.desktopCoverRequired,
        });
      }

      if (!values.mobileCoverImageUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mobileCoverImageUrl"],
          message: messages.mobileCoverRequired,
        });
      }

      if (!values.layout) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["layout"],
          message: messages.layoutRequired,
        });
      }

      if (
        values.supportEmail.length > 0 &&
        !z.email().safeParse(values.supportEmail).success
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["supportEmail"],
          message: messages.invalidSupportEmail,
        });
      }
    });
