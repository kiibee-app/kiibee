"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldPath,
  FieldValues,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { FORM_MESSAGE_TONE, FormMessageTone } from "@/utils/ui";

type SubmitResponse = { success?: boolean; message?: string };

type MutationHook<
  TResult extends SubmitResponse = SubmitResponse,
  TPayload = unknown,
> = () => {
  mutateAsync: (payload: TPayload) => Promise<TResult>;
  isPending: boolean;
};

export type PasswordVisibilityMode = false | "single" | "multi";

export type UseAuthFormConfig<
  TValues extends FieldValues,
  TMessages,
  TResult extends SubmitResponse = SubmitResponse,
  TPayload = TValues,
> = {
  defaultValues: DefaultValues<TValues>;
  createSchema: (messages: TMessages) => z.ZodType<TValues>;
  getSchemaMessages: (t: (key: string) => string) => TMessages;
  useMutation: MutationHook<TResult, TPayload>;
  mapValues?: (values: TValues) => TPayload;
  onSuccess: (
    response: TResult,
    helpers: {
      router: ReturnType<typeof useRouter>;
      reset: () => void;
      setSuccessFeedback: (message: string) => void;
    },
  ) => void | Promise<void>;
  failedMessageKey: string;
  passwordVisibility?: PasswordVisibilityMode;
  passwordFields?: readonly string[];
  clearFieldErrorsOnChange?: boolean;
  failedResponseAs?: "inline" | "throw";
  feedback?: "error" | "tone";
};

/** Shared auth form hook — use via `useLoginForm`, `useViewerSignUpForm`, or `useCreatorRequestForm`. */
export function useAuthForm<
  TValues extends FieldValues,
  TMessages,
  TResult extends SubmitResponse = SubmitResponse,
  TPayload = TValues,
>(config: UseAuthFormConfig<TValues, TMessages, TResult, TPayload>) {
  const { t } = useTranslation();
  const router = useRouter();
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();
  const { mutateAsync, isPending: isSubmitting } = config.useMutation();

  const useToneFeedback = config.feedback === "tone";
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [messageTone, setMessageTone] = useState<FormMessageTone>(
    FORM_MESSAGE_TONE.ERROR,
  );

  const passwordMode = config.passwordVisibility ?? false;
  const passwordFields = config.passwordFields ?? [];

  const [singlePasswordVisible, setSinglePasswordVisible] = useState(false);
  const [multiPasswordVisibility, setMultiPasswordVisibility] = useState<
    Record<string, boolean>
  >(() =>
    passwordFields.reduce(
      (acc, field) => ({ ...acc, [field]: false }),
      {} as Record<string, boolean>,
    ),
  );

  const schema = useMemo(
    () => config.createSchema(config.getSchemaMessages(t)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale is the only runtime input
    [t],
  );

  const methods = useForm<TValues>({
    resolver: zodResolver(schema as never) as Resolver<TValues>,
    mode: "onChange",
    defaultValues: config.defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { isValid, errors },
  } = methods;

  const clearFeedback = useCallback(() => {
    if (useToneFeedback) {
      setFormMessage("");
      return;
    }
    setFormError("");
  }, [useToneFeedback]);

  const setFeedbackError = useCallback(
    (message: string) => {
      if (useToneFeedback) {
        setMessageTone(FORM_MESSAGE_TONE.ERROR);
        setFormMessage(message);
        return;
      }
      setFormError(message);
    },
    [useToneFeedback],
  );

  const setSuccessFeedback = useCallback((message: string) => {
    setMessageTone(FORM_MESSAGE_TONE.SUCCESS);
    setFormMessage(message);
  }, []);

  const updateField = useCallback(
    (field: FieldPath<TValues>, value: string | boolean) => {
      setValue(field, value as never, {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (config.clearFieldErrorsOnChange) {
        clearErrors(field);
      }

      clearFeedback();
    },
    [setValue, clearErrors, config.clearFieldErrorsOnChange, clearFeedback],
  );

  const togglePassword = useCallback(
    (field?: string) => {
      if (passwordMode === "single") {
        setSinglePasswordVisible((prev) => !prev);
        return;
      }

      if (passwordMode === "multi" && field) {
        setMultiPasswordVisibility((prev) => ({
          ...prev,
          [field]: !prev[field],
        }));
      }
    },
    [passwordMode],
  );

  const onSubmit = async (values: TValues) => {
    clearFeedback();

    try {
      const payload = (
        config.mapValues ? config.mapValues(values) : values
      ) as TPayload;
      const response = await mutateAsync(payload);

      const failed =
        config.failedResponseAs === "throw"
          ? !response.success
          : response.success === false;

      if (failed) {
        const message = response.message || t(config.failedMessageKey);

        if (config.failedResponseAs === "throw") {
          throw new Error(message);
        }

        setFeedbackError(message);
        return;
      }

      await config.onSuccess(response, { router, reset, setSuccessFeedback });
    } catch (error) {
      applyFieldErrors(error, setError);
      setFeedbackError(getErrorMessage(error, config.failedMessageKey));
    }
  };

  const passwordVisibility =
    passwordMode === "single"
      ? singlePasswordVisible
      : passwordMode === "multi"
        ? multiPasswordVisibility
        : undefined;

  return {
    methods,
    isValid,
    errors,
    isSubmitting,
    formError,
    formMessage,
    messageTone,
    updateField,
    passwordVisibility,
    togglePassword,
    handleSubmit: handleSubmit(onSubmit as SubmitHandler<TValues>),
  };
}

export { useAuthForm as useBaseAuthForm };
