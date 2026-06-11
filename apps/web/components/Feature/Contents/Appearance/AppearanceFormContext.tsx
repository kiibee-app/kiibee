"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { createAppearanceSchema } from "@/lib/validation/schema";
import type { ContentAppearanceResponse } from "@/types/contentAppearanceType";
import { FORM_FIELDS } from "@/utils/appearance";
import {
  areAppearanceValuesEqual,
  mapAppearanceFromApi,
  mapAppearanceToApi,
  type AppearanceFormValues,
} from "@/utils/appearanceApi";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
import type { CreatorLayoutKey } from "@/utils/creatorChannel";
import { writeSavedCreatorLayout } from "@/utils/creatorChannel";
import { CONTENTS } from "@/utils/translationKeys";

type AppearanceFormErrors = Partial<Record<keyof AppearanceFormValues, string>>;

type AppearanceFormContextValue = {
  values: AppearanceFormValues;
  errors: AppearanceFormErrors;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  updateField: <K extends keyof AppearanceFormValues>(
    key: K,
    value: AppearanceFormValues[K],
  ) => void;
  clearFieldError: (key: keyof AppearanceFormValues) => void;
  validateField: (key: keyof AppearanceFormValues) => void;
  setLayout: (layout: CreatorLayoutKey) => void;
  saveAppearance: () => Promise<void>;
  cancelAppearance: () => void;
};

const AppearanceFormContext = createContext<AppearanceFormContextValue | null>(
  null,
);

export function AppearanceFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { setSelectedLayout } = useCreatorChannelLayout();
  const queryClient = useQueryClient();

  const { data: appearanceResponse, isLoading } =
    useGetAPI<ContentAppearanceResponse>(API.content.appearance);

  const serverValues = useMemo(
    () => mapAppearanceFromApi(appearanceResponse?.data ?? null),
    [appearanceResponse],
  );

  const [draft, setDraft] = useState<AppearanceFormValues | null>(null);
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

  const values = draft ?? serverValues;

  const hasUnsavedChanges = useMemo(
    () => draft !== null && !areAppearanceValuesEqual(draft, serverValues),
    [draft, serverValues],
  );

  const getValidationErrors = useCallback(
    (nextValues: AppearanceFormValues): AppearanceFormErrors => {
      const result = schema.safeParse({
        buttonColor: nextValues.buttonColor,
        buttonHex: nextValues.buttonHex,
        textColor: nextValues.textColor,
        logoType: nextValues.logoType,
        logoName: nextValues.logoName,
        logoUrl: nextValues.logoUrl,
        description: nextValues.description,
        desktopCoverImageUrl: nextValues.desktopCoverImageUrl,
        mobileCoverImageUrl: nextValues.mobileCoverImageUrl,
        layout: nextValues.layout,
        supportEmail: nextValues.supportEmail,
      });

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

  const updateField = useCallback(
    <K extends keyof AppearanceFormValues>(
      key: K,
      value: AppearanceFormValues[K],
    ) => {
      setDraft((prev) => {
        const nextValues = {
          ...(prev ?? serverValues),
          [key]: value,
        };

        setErrors((prevErrors) =>
          Object.keys(prevErrors).length > 0
            ? getValidationErrors(nextValues)
            : prevErrors,
        );

        return nextValues;
      });
    },
    [getValidationErrors, serverValues],
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
    (key: keyof AppearanceFormValues) => {
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
    [getValidationErrors, values],
  );

  const setLayout = useCallback(
    (layout: CreatorLayoutKey) => {
      setSelectedLayout(layout);
      setDraft((prev) => ({
        ...(prev ?? serverValues),
        [FORM_FIELDS.LAYOUT]: layout,
      }));
    },
    [setSelectedLayout, serverValues],
  );

  const saveAppearance = useCallback(async () => {
    const nextErrors = getValidationErrors(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      throw new Error(CONTENTS.appearance.validation.fixErrors);
    }

    const payload = mapAppearanceToApi(values);
    await axiosClient.put(API.content.appearance, payload);

    writeSavedCreatorLayout(values.layout);
    setSelectedLayout(values.layout);
    setDraft(null);
    setErrors({});
    await queryClient.invalidateQueries({
      queryKey: [API.content.appearance],
    });
  }, [getValidationErrors, queryClient, setSelectedLayout, values]);

  const cancelAppearance = useCallback(() => {
    setDraft(null);
    setErrors({});
    setSelectedLayout(serverValues.layout);
  }, [serverValues.layout, setSelectedLayout]);

  const contextValue = useMemo(
    () => ({
      values,
      errors,
      isLoading,
      hasUnsavedChanges,
      updateField,
      clearFieldError,
      validateField,
      setLayout,
      saveAppearance,
      cancelAppearance,
    }),
    [
      values,
      errors,
      isLoading,
      hasUnsavedChanges,
      updateField,
      clearFieldError,
      validateField,
      setLayout,
      saveAppearance,
      cancelAppearance,
    ],
  );

  return (
    <AppearanceFormContext.Provider value={contextValue}>
      {children}
    </AppearanceFormContext.Provider>
  );
}

export function useAppearanceForm() {
  const context = useContext(AppearanceFormContext);

  if (!context) {
    throw new Error(
      "useAppearanceForm must be used within AppearanceFormProvider",
    );
  }

  return context;
}
