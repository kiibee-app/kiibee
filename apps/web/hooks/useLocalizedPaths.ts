"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { normalizeAppLanguage } from "@/utils/language";
import { localizeHref, localizePathname } from "@/utils/localizedRoutes";
import { PATHS } from "@/utils/path";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function useAppLanguage() {
  const { i18n } = useTranslation();
  return normalizeAppLanguage(i18n.resolvedLanguage || i18n.language);
}

export function useLocalizedHref() {
  const language = useAppLanguage();
  const isClient = useIsClient();

  return useCallback(
    (href: string) => (isClient ? localizeHref(href, language) : href),
    [isClient, language],
  );
}

export function useLocalizedPaths() {
  const language = useAppLanguage();
  const isClient = useIsClient();

  return useMemo(() => {
    const localized = {} as {
      -readonly [K in keyof typeof PATHS]: string;
    };

    for (const key of Object.keys(PATHS) as (keyof typeof PATHS)[]) {
      localized[key] = isClient
        ? localizeHref(PATHS[key], language)
        : PATHS[key];
    }

    return localized;
  }, [isClient, language]);
}

export function useLocalizedPathname() {
  const language = useAppLanguage();
  const isClient = useIsClient();

  return useCallback(
    (pathname: string) =>
      isClient ? localizePathname(pathname, language) : pathname,
    [isClient, language],
  );
}
