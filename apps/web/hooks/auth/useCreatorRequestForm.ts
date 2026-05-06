"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  CreatorFormValues,
  INITIAL_CREATOR_FORM,
  REQUIRED_CREATOR_FIELD_KEYS,
} from "@/utils/authCreatorForm";
import { PATHS } from "@/utils/path";
import { useCreatorRequest } from "./useCreatorRequest";
import { FORM_MESSAGE_TONE, FormMessageTone } from "@/utils/ui";

export function useCreatorRequestForm(t: (key: string) => string) {
  const router = useRouter();
  const creatorRequest = useCreatorRequest();

  const [formValues, setFormValues] =
    useState<CreatorFormValues>(INITIAL_CREATOR_FORM);

  const [formMessage, setFormMessage] = useState("");
  const [messageTone, setMessageTone] = useState<FormMessageTone>(
    FORM_MESSAGE_TONE.ERROR,
  );
  const isSubmitEnabled = useMemo(() => {
    const hasRequiredValues = REQUIRED_CREATOR_FIELD_KEYS.every((key) =>
      Boolean(formValues[key].trim()),
    );

    return hasRequiredValues && formValues.agreed && !creatorRequest.isPending;
  }, [creatorRequest.isPending, formValues]);

  const updateField = (
    field: keyof CreatorFormValues,
    value: string | boolean,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormMessage("");
  };

  const validateWorkLink = (): boolean => {
    const workLink = formValues.workLink.trim();

    try {
      new URL(workLink);
      return true;
    } catch {
      setMessageTone(FORM_MESSAGE_TONE.ERROR);
      setFormMessage(t("authCreator.form.workLinkInvalid"));
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSubmitEnabled) return;

    if (!validateWorkLink()) return;

    try {
      const response = await creatorRequest.mutateAsync({
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim().toLowerCase(),
        phone: formValues.phone.trim() || undefined,
        cvr: formValues.cvr.trim() || undefined,
        address: formValues.address.trim(),
        city: formValues.city.trim(),
        postalCode: formValues.postalCode.trim(),
        exampleWorkLink: formValues.workLink.trim(),
        contentDescription: formValues.contentDescription.trim(),
      });

      if (!response.success) {
        throw new Error(response.message || t("authCreator.form.submitError"));
      }

      toast.success(response.message || t("authCreator.form.submitSuccess"));

      setMessageTone(FORM_MESSAGE_TONE.SUCCESS);
      setFormMessage(response.message || t("authCreator.form.submitSuccess"));

      setFormValues(INITIAL_CREATOR_FORM);
      router.push(PATHS.AUTH_CREATOR_REQUEST_SENT);
    } catch (error) {
      setMessageTone(FORM_MESSAGE_TONE.ERROR);
      setFormMessage(
        error instanceof Error
          ? error.message
          : t("authCreator.form.submitError"),
      );
    }
  };

  return {
    formValues,
    setFormValues,
    formMessage,
    messageTone,
    isSubmitEnabled,
    isPending: creatorRequest.isPending,
    updateField,
    handleSubmit,
  };
}
