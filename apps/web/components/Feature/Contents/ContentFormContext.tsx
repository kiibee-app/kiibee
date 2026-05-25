"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getFileNameWithoutExtension } from "@/utils/content";
import type {
  ContentFormState,
  ContentFormContextType,
} from "@/types/contentTypes";
import { defaultState } from "@/types/contentTypes";

const ContentFormContext = createContext<ContentFormContextType | undefined>(
  undefined,
);

export const ContentFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formState, setFormState] = useState<ContentFormState>(defaultState);

  const updateField = useCallback(
    <K extends keyof ContentFormState>(
      field: K,
      value: ContentFormState[K],
    ) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormState(defaultState);
  }, []);

  const prefillForm = useCallback(
    (file: File | null) => {
      if (file) {
        setFormState({
          ...defaultState,
          title: getFileNameWithoutExtension(file.name),
        });
      } else {
        resetForm();
      }
    },
    [resetForm],
  );

  return (
    <ContentFormContext.Provider
      value={{ formState, setFormState, updateField, prefillForm, resetForm }}
    >
      {children}
    </ContentFormContext.Provider>
  );
};

export const useContentForm = () => {
  const { t } = useTranslation();
  const context = useContext(ContentFormContext);
  if (!context) {
    throw new Error(t("errors.missingContentFormProvider"));
  }
  return context;
};
