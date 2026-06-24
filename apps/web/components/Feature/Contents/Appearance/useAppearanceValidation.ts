"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createAppearanceSchema } from "@/lib/validation/schema";
import { CONTENTS } from "@/utils/translationKeys";
import type { AppearanceFormValues } from "@/utils/appearanceApi";
import type { AppearanceFormErrors } from "./appearanceFormTypes";

export function useAppearanceValidation() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<AppearanceFormErrors>({});

  const schema = useMemo(
    () =>
      createAppearanceSchema({
        invalidHex: t(CONTENTS.appearance.validation.invalidHex),
        invalidSupportEmail: t(
          CONTENTS.appearance.validation.invalidSupportEmail,
        ),
        descriptionRequired: t(
          CONTENTS.appearance.validation.descriptionRequired,
        ),
        logoNameRequired: t(CONTENTS.appearance.validation.logoNameRequired),
        logoImageRequired: t(CONTENTS.appearance.validation.logoImageRequired),
        desktopCoverRequired: t(
          CONTENTS.appearance.validation.desktopCoverRequired,
        ),
        mobileCoverRequired: t(
          CONTENTS.appearance.validation.mobileCoverRequired,
        ),
        layoutRequired: t(CONTENTS.appearance.validation.layoutRequired),
      }),
    [t],
  );

  const getValidationErrors = useCallback(
    (values: AppearanceFormValues): AppearanceFormErrors => {
      const result = schema.safeParse(values);

      if (result.success) return {};

      const nextErrors: AppearanceFormErrors = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof AppearanceFormValues | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }

      return nextErrors;
    },
    [schema],
  );

  const syncErrors = useCallback(
    (values: AppearanceFormValues) => {
      setErrors((prev) =>
        Object.keys(prev).length > 0 ? getValidationErrors(values) : prev,
      );
    },
    [getValidationErrors],
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
      setErrors((prev) => {
        const nextErrors = getValidationErrors(values);
        const next = { ...prev };
        const fieldError = nextErrors[key];

        if (fieldError) {
          next[key] = fieldError;
        } else {
          delete next[key];
        }

        return next;
      });
    },
    [getValidationErrors],
  );

  const validateAll = useCallback(
    (values: AppearanceFormValues) => {
      const nextErrors = getValidationErrors(values);
      setErrors(nextErrors);
      return nextErrors;
    },
    [getValidationErrors],
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
