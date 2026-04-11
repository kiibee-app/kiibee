"use client";

import React, { useEffect } from "react";
import i18n from "i18next";
import type { InitOptions } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "../locals/en.json";
import da from "../locals/da.json";

const resources = {
  en: { translation: en },
  da: { translation: da },
  dn: { translation: da },
};

const syncResources = () => {
  Object.entries(resources).forEach(([language, bundle]) => {
    i18n.addResourceBundle(
      language,
      "translation",
      bundle.translation,
      true,
      true,
    );
  });
};

if (!i18n.isInitialized) {
  const opts: InitOptions & { initImmediate?: boolean } = {
    resources: resources as unknown as InitOptions["resources"],
    lng: "en",
    fallbackLng: "en",
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

    const currentLang = i18n.resolvedLanguage || i18n.language || "en";
    document.documentElement.lang = currentLang;
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
