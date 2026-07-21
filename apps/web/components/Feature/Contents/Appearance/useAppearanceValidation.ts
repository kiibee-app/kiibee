"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORM_FIELDS } from "@/utils/appearance";
import { maxDescriptionCharacters } from "@/utils/Constants";
import type { AppearanceFormValues } from "@/utils/appearanceApi";
import type { AppearanceFormErrors } from "./appearanceFormTypes";

export function useAppearanceValidation() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<AppearanceFormErrors>({});

  const getDescriptionMaxMessage = useCallback(
    () =>
      t("contents.appearance.validation.descriptionMax", {
        max: maxDescriptionCharacters,
      }),
    [t],
  );

  const validateValues = useCallback(
    (values: AppearanceFormValues) => {
      const nextErrors: AppearanceFormErrors = {};

      if (values.description.length > maxDescriptionCharacters) {
        nextErrors[FORM_FIELDS.DESCRIPTION] = getDescriptionMaxMessage();
      }

      return nextErrors;
    },
    [getDescriptionMaxMessage],
  );

  const syncErrors = useCallback(
    (values: AppearanceFormValues) => {
      setErrors(validateValues(values));
    },
    [validateValues],
  );

  const clearFieldError = useCallback((key: keyof AppearanceFormValues) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateField = useCallback(
    (key: keyof AppearanceFormValues, values: AppearanceFormValues) => {
      const nextErrors = validateValues(values);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        if (nextErrors[key]) {
          next[key] = nextErrors[key];
        }
        return next;
      });
    },
    [validateValues],
  );

  const validateAll = useCallback(
    (values: AppearanceFormValues) => {
      const nextErrors = validateValues(values);
      setErrors(nextErrors);
      return nextErrors;
    },
    [validateValues],
  );

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    clearFieldError,
    validateField,
    validateAll,
    syncErrors,
    resetErrors,
  };
}
