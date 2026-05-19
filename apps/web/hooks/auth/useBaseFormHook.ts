"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  Path,
  UseFormReturn,
  useForm,
  FieldValues,
  Resolver,
  SubmitHandler,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";

type BaseFormOptions<TValues extends FieldValues> = {
  createSchema: (t: (key: string) => string) => z.ZodType<TValues>;
  defaultValues: DefaultValues<TValues>;
  fallbackErrorKey: string;
  submit: (
    values: TValues,
    methods: UseFormReturn<TValues, unknown, TValues>,
  ) => Promise<void>;
};

export function useBaseFormHook<TValues extends FieldValues>(
  options: BaseFormOptions<TValues>,
) {
  const { createSchema, defaultValues, fallbackErrorKey, submit } = options;
  const { t } = useTranslation();
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();
  const [formError, setFormError] = useState("");

  const schema = useMemo(() => createSchema(t), [createSchema, t]);
  const methods = useForm<TValues>({
    resolver: zodResolver(schema as never) as unknown as Resolver<TValues>,
    mode: "onChange",
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { isValid, errors },
  } = methods;

  const updateField = (field: Path<TValues>, value: unknown) => {
    setValue(field, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(field);
    if (formError) setFormError("");
  };

  const onSubmit = async (values: TValues) => {
    setFormError("");
    try {
      await submit(
        values,
        methods as unknown as UseFormReturn<TValues, unknown, TValues>,
      );
    } catch (error) {
      applyFieldErrors(error, setError);
      setFormError(getErrorMessage(error, fallbackErrorKey));
    }
  };

  const handleFormSubmit = handleSubmit(
    onSubmit as unknown as SubmitHandler<TValues>,
  );

  return {
    methods,
    isValid,
    errors,
    formError,
    setFormError,
    updateField,
    handleSubmit: handleFormSubmit,
  };
}
