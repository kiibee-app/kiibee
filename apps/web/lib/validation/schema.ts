import { z } from "zod";

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
