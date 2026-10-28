"use client";

import { useCallback, useState } from "react";
import type { AppearanceFormValues } from "@/utils/appearanceApi";
import type { AppearanceFormErrors } from "./appearanceFormTypes";

export function useAppearanceValidation() {
  const [errors, setErrors] = useState<AppearanceFormErrors>({});

  const validateValues = useCallback((_values: AppearanceFormValues) => {
    const nextErrors: AppearanceFormErrors = {};
    return nextErrors;
  }, []);

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
