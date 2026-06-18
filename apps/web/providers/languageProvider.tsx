"use client";

import React, { useEffect } from "react";
import i18n, { InitOptions } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "../locals/en.json";
import da from "../locals/da.json";
import {
  COOKIE_KEY,
  DA,
  EN,
  STORAGE_KEY,
  SUPPORTED_LANGS,
  RESOURCE_NAMESPACE,
  LANGUAGE_CHANGED_EVENT,
  UNDEFINED,
} from "@/utils/common";

const COOKIE_MAX_AGE = 31536000; // 1 year

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

const getInitialLanguage = (serverLang?: string): string => {
  if (serverLang && SUPPORTED_LANGS.includes(serverLang)) return serverLang;
  if (typeof window !== UNDEFINED) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  }
  return DA;
};

const setLanguageCookie = (lng: string) => {
  if (typeof window === UNDEFINED) return;
  const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString();
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(lng)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; Expires=${expires}; SameSite=Lax`;
};

if (!i18n.isInitialized) {
  const initialLang = getInitialLanguage();
  setLanguageCookie(initialLang);

  const opts: InitOptions & { initImmediate?: boolean } = {
    resources: resources as unknown as InitOptions["resources"],
    lng: initialLang,
    fallbackLng: EN,
    interpolation: { escapeValue: false },
    initImmediate: false,
  };

  i18n.use(initReactI18next).init(opts);
} else {
  syncResources();
}

syncResources();

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: string;
}) {
  useEffect(() => {
    syncResources();
    document.documentElement.lang = i18n.language;

    if (initialLang && i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang);
      localStorage.setItem(STORAGE_KEY, initialLang);
      setLanguageCookie(initialLang);
    }

    const onLangChange = (lng: string) => {
      document.documentElement.lang = lng;
      if (typeof window !== UNDEFINED) {
        localStorage.setItem(STORAGE_KEY, lng);
      }
      setLanguageCookie(lng);
    };
    i18n.on(LANGUAGE_CHANGED_EVENT, onLangChange);
    return () => {
      i18n.off(LANGUAGE_CHANGED_EVENT, onLangChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
