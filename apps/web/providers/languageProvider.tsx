"use client";

import React, { useEffect } from "react";
import i18n, { InitOptions } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "../locals/en.json";
import da from "../locals/da.json";
import {
  DA,
  EN,
  STORAGE_KEY,
  SUPPORTED_LANGS,
  RESOURCE_NAMESPACE,
  LANGUAGE_CHANGED_EVENT,
  UNDEFINED,
} from "@/utils/common";

type ResourceBundle = Record<string, Record<string, typeof en>>;

const resources: ResourceBundle = {
  [EN]: { [RESOURCE_NAMESPACE]: en },
  [DA]: { [RESOURCE_NAMESPACE]: da },
};

const syncResources = () => {
  Object.entries(resources).forEach(([language, bundle]) => {
    i18n.addResourceBundle(
      language,
      RESOURCE_NAMESPACE,
      bundle[RESOURCE_NAMESPACE],
      true,
      true,
    );
  });
};

const getInitialLanguage = (): string => {
  if (typeof window !== UNDEFINED) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  }
  return DA;
};

if (!i18n.isInitialized) {
  const opts: InitOptions & { initImmediate?: boolean } = {
    resources: resources as unknown as InitOptions["resources"],
    lng: getInitialLanguage(),
    fallbackLng: EN,
    interpolation: { escapeValue: false },
    initImmediate: false,
  };

  i18n.use(initReactI18next).init(opts);
} else {
  syncResources();
}

syncResources();

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncResources();
    document.documentElement.lang = i18n.language;

    const onLangChange = (lng: string) => {
      document.documentElement.lang = lng;
    };
    i18n.on(LANGUAGE_CHANGED_EVENT, onLangChange);
    return () => {
      i18n.off(LANGUAGE_CHANGED_EVENT, onLangChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
