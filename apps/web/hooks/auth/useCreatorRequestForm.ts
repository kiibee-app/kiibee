"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { createCreatorRequestSchema } from "@/lib/validation/schema";
import { PATHS } from "@/utils/path";
import { useCreatorRequest } from "./useCreatorRequest";
import { FORM_MESSAGE_TONE, FormMessageTone } from "@/utils/ui";

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
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();

  const schema = useMemo(
    () =>
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
    [t],
  );

  const methods = useForm<CreatorRequestValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
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
  });

  const {
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { isValid, errors },
  } = methods;

  const updateField = (
    field: keyof CreatorRequestValues,
    value: string | boolean,
  ) => {
    setValue(field, value as CreatorRequestValues[typeof field], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setFormMessage("");
  };

  const onSubmit = async (values: CreatorRequestValues) => {
    try {
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
        throw new Error(response.message || t("authForm.errors.submitFailed"));
      }

      const successMessage =
        response.message || t("authCreator.form.submitSuccess");

      toast.success(successMessage);
      setMessageTone(FORM_MESSAGE_TONE.SUCCESS);
      setFormMessage(successMessage);

      reset();
      router.push(PATHS.AUTH_CREATOR_REQUEST_SENT);
    } catch (error) {
      applyFieldErrors(error, setError);
      setMessageTone(FORM_MESSAGE_TONE.ERROR);
      setFormMessage(getErrorMessage(error, "authForm.errors.submitFailed"));
    }
  };

  return {
    methods,
    formMessage,
    messageTone,
    isValid,
    errors,
    isSubmitting: creatorRequest.isPending,
    updateField,
    handleFormSubmit: handleSubmit(onSubmit),
  };
}
