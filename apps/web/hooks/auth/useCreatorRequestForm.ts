"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createCreatorRequestSchema } from "@/lib/validation/schema";
import { PATHS } from "@/utils/path";
import { useCreatorRequest } from "./useCreatorRequest";
import { FORM_MESSAGE_TONE, FormMessageTone } from "@/utils/ui";
import { useBaseFormHook } from "./useBaseFormHook";

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

export function useCreatorRequestForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formMessage, setFormMessage] = useState("");
  const [messageTone, setMessageTone] = useState<FormMessageTone>(
    FORM_MESSAGE_TONE.ERROR,
  );
  const creatorRequest = useCreatorRequest();

  const {
    methods,
    isValid,
    errors,
    formError,
    setFormError,
    updateField,
    handleSubmit,
  } = useBaseFormHook<CreatorRequestValues>({
    createSchema: (t) =>
      createCreatorRequestSchema({
        firstNameRequired: t("authCreator.form.firstName"),
        lastNameRequired: t("authCreator.form.lastName"),
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        addressRequired: t("authCreator.form.address"),
        cityRequired: t("authCreator.form.city"),
        postalCodeRequired: t("authCreator.form.postalCode"),
        workLinkRequired: t("authCreator.form.workLink"),
        workLinkInvalid: t("authCreator.form.workLinkInvalid"),
        contentDescriptionRequired: t("authCreator.form.contentLabel"),
        consentRequired: t("authCreator.form.consentPrefix"),
      }),
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
    fallbackErrorKey: "authForm.errors.submitFailed",
    submit: async (values, baseMethods) => {
      const response = await creatorRequest.mutateAsync({
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
      });

      if (!response.success) {
        throw new Error(response.message || "");
      }

      const successMessage =
        response.message || t("authCreator.form.submitSuccess");
      toast.success(successMessage);
      setMessageTone(FORM_MESSAGE_TONE.SUCCESS);
      setFormMessage(successMessage);
      baseMethods.reset();
      router.push(PATHS.AUTH_CREATOR_REQUEST_SENT);
    },
  });

  const updateCreatorField = (
    field: keyof CreatorRequestValues,
    value: string | boolean,
  ) => {
    updateField(field, value as CreatorRequestValues[typeof field]);
    setFormMessage("");
    if (formError) setFormError("");
  };

  return {
    methods,
    formMessage: formMessage || formError,
    messageTone: formError ? FORM_MESSAGE_TONE.ERROR : messageTone,
    isValid,
    errors,
    isSubmitting: creatorRequest.isPending,
    updateField: updateCreatorField,
    handleFormSubmit: handleSubmit,
  };
}
