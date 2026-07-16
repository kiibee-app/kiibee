"use client";

import { useCallback, useState } from "react";
import type { AppearanceFormValues } from "@/utils/appearanceApi";
import type { AppearanceFormErrors } from "./appearanceFormTypes";

export function useAppearanceValidation() {
  const [errors, setErrors] = useState<AppearanceFormErrors>({});

  const syncErrors = useCallback((_values: AppearanceFormValues) => {}, []);

  const clearFieldError = useCallback((key: keyof AppearanceFormValues) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateField = useCallback(
    (_key: keyof AppearanceFormValues, _values: AppearanceFormValues) => {},
    [],
  );

  const validateAll = useCallback((_values: AppearanceFormValues) => {
    setErrors({});
    return {} as AppearanceFormErrors;
  }, []);

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
