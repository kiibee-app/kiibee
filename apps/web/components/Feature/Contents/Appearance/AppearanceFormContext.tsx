"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
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

type AppearanceFormContextValue = {
  values: AppearanceFormValues;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  updateField: <K extends keyof AppearanceFormValues>(
    key: K,
    value: AppearanceFormValues[K],
  ) => void;
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
  const { setSelectedLayout } = useCreatorChannelLayout();
  const queryClient = useQueryClient();

  const { data: appearanceResponse, isLoading } =
    useGetAPI<ContentAppearanceResponse>(API.content.appearance);

  const serverValues = useMemo(
    () => mapAppearanceFromApi(appearanceResponse?.data ?? null),
    [appearanceResponse],
  );

  const [draft, setDraft] = useState<AppearanceFormValues | null>(null);

  const values = draft ?? serverValues;

  const hasUnsavedChanges = useMemo(
    () => draft !== null && !areAppearanceValuesEqual(draft, serverValues),
    [draft, serverValues],
  );

  const updateField = useCallback(
    <K extends keyof AppearanceFormValues>(
      key: K,
      value: AppearanceFormValues[K],
    ) => {
      setDraft((prev) => ({
        ...(prev ?? serverValues),
        [key]: value,
      }));
    },
    [serverValues],
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
    const payload = mapAppearanceToApi(values);
    await axiosClient.put(API.content.appearance, payload);

    writeSavedCreatorLayout(values.layout);
    setSelectedLayout(values.layout);
    setDraft(null);
    await queryClient.invalidateQueries({
      queryKey: [API.content.appearance],
    });
  }, [values, queryClient, setSelectedLayout]);

  const cancelAppearance = useCallback(() => {
    setDraft(null);
    setSelectedLayout(serverValues.layout);
  }, [serverValues.layout, setSelectedLayout]);

  const contextValue = useMemo(
    () => ({
      values,
      isLoading,
      hasUnsavedChanges,
      updateField,
      setLayout,
      saveAppearance,
      cancelAppearance,
    }),
    [
      values,
      isLoading,
      hasUnsavedChanges,
      updateField,
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
