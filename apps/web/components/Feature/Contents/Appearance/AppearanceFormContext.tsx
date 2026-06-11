"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import type { ContentAppearanceResponse } from "@/types/contentAppearanceType";
import {
  mapAppearanceFromApi,
  mapAppearanceToApi,
} from "@/utils/appearanceApi";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
import { writeSavedCreatorLayout } from "@/utils/creatorChannel";
import { CONTENTS } from "@/utils/translationKeys";
import type { AppearanceFormContextValue } from "./appearanceFormTypes";
import { useAppearanceDraft } from "./useAppearanceDraft";
import { useAppearanceValidation } from "./useAppearanceValidation";

const AppearanceFormContext = createContext<AppearanceFormContextValue | null>(
  null,
);

export function AppearanceFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setSelectedLayout } = useCreatorChannelLayout();
  const queryClient = useQueryClient();

  const { data: appearanceResponse, isLoading } =
    useGetAPI<ContentAppearanceResponse>(API.content.appearance);

  const serverValues = useMemo(
    () => mapAppearanceFromApi(appearanceResponse?.data ?? null),
    [appearanceResponse],
  );
  const {
    errors,
    clearFieldError,
    validateField: validateFieldState,
    validateAll,
    syncErrors,
    resetErrors,
  } = useAppearanceValidation();
  const { values, hasUnsavedChanges, updateField, setLayout, resetDraft } =
    useAppearanceDraft({
      serverValues,
      setSelectedLayout,
      syncErrors,
    });

  const validateField = useCallback(
    (key: keyof typeof values) => {
      validateFieldState(key, values);
    },
    [validateFieldState, values],
  );

  const saveAppearance = useCallback(async () => {
    const nextErrors = validateAll(values);
    if (Object.keys(nextErrors).length > 0) {
      throw new Error(CONTENTS.appearance.validation.fixErrors);
    }

    const payload = mapAppearanceToApi(values);
    await axiosClient.put(API.content.appearance, payload);

    writeSavedCreatorLayout(values.layout);
    setSelectedLayout(values.layout);
    resetDraft();
    resetErrors();
    await queryClient.invalidateQueries({
      queryKey: [API.content.appearance],
    });
  }, [
    queryClient,
    resetDraft,
    resetErrors,
    setSelectedLayout,
    validateAll,
    values,
  ]);

  const cancelAppearance = useCallback(() => {
    resetDraft();
    resetErrors();
    setSelectedLayout(serverValues.layout);
  }, [resetDraft, resetErrors, serverValues.layout, setSelectedLayout]);

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
