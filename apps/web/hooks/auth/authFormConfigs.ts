import {
  createCreatorRequestSchema,
  createLoginSchema,
  createViewerSignupSchema,
} from "@/lib/validation/schema";
import { PASSWORD_FIELD_KEYS } from "@/utils/signup";
export type CreatorRequestValues = {
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

export const loginFormBase = {
  defaultValues: { email: "", password: "" },
  createSchema: createLoginSchema,
  getSchemaMessages: (translate: (key: string) => string) => ({
    emailRequired: translate("authForm.errors.emailRequired"),
    emailInvalid: translate("authForm.errors.emailInvalid"),
    passwordRequired: translate("authForm.errors.passwordRequired"),
  }),
  failedMessageKey: "authForm.errors.submitFailed",
  passwordVisibility: "single" as const,
  clearFieldErrorsOnChange: true,
};

export const viewerSignUpFormBase = {
  defaultValues: {
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreed: false,
  },
  createSchema: createViewerSignupSchema,
  getSchemaMessages: (translate: (key: string) => string) => ({
    fullNameRequired: translate("viewerSignup.form.fixHighlightedFields"),
    emailRequired: translate("authForm.errors.emailRequired"),
    emailInvalid: translate("authForm.errors.emailInvalid"),
    passwordRequired: translate("authForm.errors.passwordRequired"),
    repeatPasswordRequired: translate("viewerSignup.form.fixHighlightedFields"),
    passwordMismatch: translate("viewerSignup.form.passwordMismatch"),
    consentRequired: translate("viewerSignup.form.fixHighlightedFields"),
  }),
  mapValues: (values: {
    fullName: string;
    email: string;
    password: string;
    repeatPassword: string;
  }) => ({
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    password: values.password,
    confirmPassword: values.repeatPassword,
  }),
  failedMessageKey: "viewerSignup.form.signupFailed",
  passwordVisibility: "multi" as const,
  passwordFields: PASSWORD_FIELD_KEYS,
};

export const creatorRequestFormBase = {
  defaultValues: {
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
  },
  createSchema: createCreatorRequestSchema,
  getSchemaMessages: (translate: (key: string) => string) => ({
    firstNameRequired: translate("authCreator.form.firstName"),
    lastNameRequired: translate("authCreator.form.lastName"),
    emailRequired: translate("authForm.errors.emailRequired"),
    emailInvalid: translate("authForm.errors.emailInvalid"),
    addressRequired: translate("authCreator.form.address"),
    cityRequired: translate("authCreator.form.city"),
    postalCodeRequired: translate("authCreator.form.postalCode"),
    workLinkRequired: translate("authCreator.form.workLink"),
    workLinkInvalid: translate("authCreator.form.workLinkInvalid"),
    contentDescriptionRequired: translate("authCreator.form.contentLabel"),
    consentRequired: translate("authCreator.form.consentPrefix"),
  }),
  mapValues: (values: CreatorRequestValues) => ({
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim() || undefined,
    cvr: values.cvr.trim() || undefined,
    address: values.address.trim(),
    city: values.city.trim(),
    postalCode: values.postalCode.trim(),
    exampleWorkLink: values.workLink.trim(),
    contentDescription: values.contentDescription.trim(),
  }),
  failedMessageKey: "authForm.errors.submitFailed",
  failedResponseAs: "throw" as const,
  feedback: "tone" as const,
};
