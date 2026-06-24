"use client";

import React, { useEffect, useMemo } from "react";
import {
  createInstance,
  type i18n as I18nInstance,
  InitOptions,
} from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "../locals/en.json";
import da from "../locals/da.json";
import {
  DA,
  EN,
  SUPPORTED_LANGS,
  RESOURCE_NAMESPACE,
  LANGUAGE_CHANGED_EVENT,
} from "@/utils/common";
import {
  normalizeAppLanguage,
  persistAppLanguage,
  syncDocumentLanguage,
  type AppLanguage,
} from "@/utils/language";

type ResourceBundle = Record<string, Record<string, typeof en>>;

const resources: ResourceBundle = {
  [EN]: { [RESOURCE_NAMESPACE]: en },
  [DA]: { [RESOURCE_NAMESPACE]: da },
};

function createI18nInstance(lng: AppLanguage): I18nInstance {
  const instance = createInstance();

  const opts: InitOptions & { initImmediate?: boolean } = {
    resources: resources as unknown as InitOptions["resources"],
    lng,
    fallbackLng: DA,
    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  };

  instance.use(initReactI18next).init(opts);
  return instance;
}

type LanguageProviderProps = {
  children: React.ReactNode;
  initialLang?: AppLanguage;
};

export function LanguageProvider({
  children,
  initialLang = DA,
}: LanguageProviderProps) {
  const lang = normalizeAppLanguage(initialLang);
  const i18nInstance = useMemo(() => createI18nInstance(lang), [lang]);

  useEffect(() => {
    const active = normalizeAppLanguage(
      i18nInstance.resolvedLanguage || i18nInstance.language,
    );
    persistAppLanguage(active);
    syncDocumentLanguage(active);

    const onLangChange = (nextLang: string) => {
      syncDocumentLanguage(nextLang);
    };

    i18nInstance.on(LANGUAGE_CHANGED_EVENT, onLangChange);
    return () => {
      i18nInstance.off(LANGUAGE_CHANGED_EVENT, onLangChange);
    };
  }, [i18nInstance]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
