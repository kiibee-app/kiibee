"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ContentFormState = {
  title: string;
  description: string;
  trailerLink: string;
  visibility: string;
  publishedYear: string;
  duration: string;
  category: string;
  productionCompany: string;
  manufacturerLink: string;
  tags: string;
  mediaCardThumbnail: string | null;
  portraitThumbnail: string | null;
  admissionRequirement: string;
  rentalAmount: string;
  purchaseAmount: string;
  maxDownloadLimit: string;
  physicalProductLink: string;
};

const defaultState: ContentFormState = {
  title: "",
  description: "",
  trailerLink: "",
  visibility: "Public",
  publishedYear: "",
  duration: "",
  category: "education",
  productionCompany: "",
  manufacturerLink: "",
  tags: "",
  mediaCardThumbnail: null,
  portraitThumbnail: null,
  admissionRequirement: "Payment",
  rentalAmount: "",
  purchaseAmount: "",
  maxDownloadLimit: "5",
  physicalProductLink: "",
};

type ContentFormContextType = {
  formState: ContentFormState;
  setFormState: React.Dispatch<React.SetStateAction<ContentFormState>>;
  updateField: <K extends keyof ContentFormState>(
    field: K,
    value: ContentFormState[K],
  ) => void;
  prefillForm: (file: File | null) => void;
  resetForm: () => void;
};

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

  const prefillForm = useCallback((file: File | null) => {
    if (file) {
      setFormState({
        ...defaultState,
        title: file.name.replace(/\.[^/.]+$/, ""),
      });
    } else {
      setFormState(defaultState);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormState(defaultState);
  }, []);

  return (
    <ContentFormContext.Provider
      value={{ formState, setFormState, updateField, prefillForm, resetForm }}
    >
      {children}
    </ContentFormContext.Provider>
  );
};

export const useContentForm = () => {
  const context = useContext(ContentFormContext);
  if (!context) {
    throw new Error("useContentForm must be used within a ContentFormProvider");
  }
  return context;
};
