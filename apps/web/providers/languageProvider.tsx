"use client";

import React, { useEffect } from "react";
import i18n, { InitOptions } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "../locals/en.json";
import da from "../locals/da.json";
import {
  DA,
  EN,
  SUPPORTED_LANGS,
  RESOURCE_NAMESPACE,
  LANGUAGE_CHANGED_EVENT,
  UNDEFINED,
} from "@/utils/common";
import {
  getStoredAppLanguage,
  normalizeAppLanguage,
  syncDocumentLanguage,
  type AppLanguage,
} from "@/utils/language";

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

if (!i18n.isInitialized) {
  const lng = typeof window !== UNDEFINED ? getStoredAppLanguage() : DA;

  const opts: InitOptions = {
    resources: resources as unknown as InitOptions["resources"],
    lng,
    fallbackLng: EN,
    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: false,
    interpolation: { escapeValue: false },
  };

  i18n.use(initReactI18next).init(opts);
} else {
  syncResources();
}

syncResources();

type LanguageProviderProps = {
  children: React.ReactNode;
  initialLang?: AppLanguage;
};

export function LanguageProvider({
  children,
  initialLang = DA,
}: LanguageProviderProps) {
  useEffect(() => {
    syncResources();

    const stored = getStoredAppLanguage();
    const active = normalizeAppLanguage(i18n.resolvedLanguage || i18n.language);

    const onLangChange = (lng: string) => {
      syncDocumentLanguage(lng);
    };

    if (active !== stored) {
      void i18n.changeLanguage(stored);
    } else {
      syncDocumentLanguage(active);
    }

    if (normalizeAppLanguage(initialLang) !== stored) {
      syncDocumentLanguage(stored);
    }

    i18n.on(LANGUAGE_CHANGED_EVENT, onLangChange);
    return () => {
      i18n.off(LANGUAGE_CHANGED_EVENT, onLangChange);
    };
  }, [initialLang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
