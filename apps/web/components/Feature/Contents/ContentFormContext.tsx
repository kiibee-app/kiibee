"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getFileNameWithoutExtension } from "@/utils/content";
import type {
  ContentFormState,
  ContentFormContextType,
  ContentFormErrors,
  ContentFormErrorKey,
} from "@/types/contentTypes";
import { defaultState } from "@/types/contentTypes";

const ContentFormContext = createContext<ContentFormContextType | undefined>(
  undefined,
);

export const ContentFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formState, setFormState] = useState<ContentFormState>(defaultState);
  const [savedFormState, setSavedFormState] =
    useState<ContentFormState>(defaultState);
  const [formErrors, setFormErrors] = useState<ContentFormErrors>({});

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
    setSavedFormState(defaultState);
    setFormErrors({});
  }, []);

  const markFormAsSaved = useCallback(
    (nextState?: ContentFormState) => {
      setSavedFormState(nextState ?? formState);
    },
    [formState],
  );

  const setFieldError = useCallback(
    (field: ContentFormErrorKey, message: string) => {
      setFormErrors((prev) => ({ ...prev, [field]: message }));
    },
    [],
  );

  const clearFieldError = useCallback((field: ContentFormErrorKey) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearFormErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  const prefillForm = useCallback(
    (file: File | null) => {
      if (!file) {
        resetForm();
        return;
      }
      setFormState({
        ...defaultState,
        title: getFileNameWithoutExtension(file.name),
      });
      setSavedFormState({
        ...defaultState,
        title: getFileNameWithoutExtension(file.name),
      });
    },
    [resetForm],
  );

  return (
    <ContentFormContext.Provider
      value={{
        formState,
        savedFormState,
        formErrors,
        setFormState,
        setSavedFormState,
        setFormErrors,
        updateField,
        setFieldError,
        clearFieldError,
        clearFormErrors,
        markFormAsSaved,
        prefillForm,
        resetForm,
      }}
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
