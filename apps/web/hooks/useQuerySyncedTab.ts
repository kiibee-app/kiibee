"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isBrowser } from "@/utils/ui";
import { useAppLanguage } from "@/hooks/useLocalizedPaths";
import {
  formatSearch,
  localizeSearchParams,
  toCanonicalSearchParams,
} from "@/utils/localizedQueryParams";

type UseQuerySyncedTabParams<T extends string> = {
  queryKey: string;
  defaultTab: T;
  validTabs: readonly T[];
  cleanupQueryKeys?: readonly string[];
};

export function useQuerySyncedTab<T extends string>({
  queryKey,
  defaultTab,
  validTabs,
  cleanupQueryKeys = [],
}: UseQuerySyncedTabParams<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const language = useAppLanguage();
  const validTabSet = useMemo(() => new Set<T>(validTabs), [validTabs]);
  const searchParamsString = searchParams?.toString() ?? "";

  const activeTab = useMemo(() => {
    const params = toCanonicalSearchParams(searchParamsString);
    const tabParam = params.get(queryKey);

    if (tabParam && validTabSet.has(tabParam as T)) {
      return tabParam as T;
    }
    return defaultTab;
  }, [defaultTab, queryKey, searchParamsString, validTabSet]);

  const buildUrl = useCallback(
    (tab: T) => {
      const liveParams = isBrowser
        ? window.location.search
        : `?${searchParamsString}`;
      const params = toCanonicalSearchParams(liveParams);

      cleanupQueryKeys.forEach((key) => params.delete(key));

      if (tab === defaultTab) {
        params.delete(queryKey);
      } else {
        params.set(queryKey, tab);
      }

      const localized = localizeSearchParams(params, language);
      return `${pathname}${formatSearch(localized)}`;
    },
    [
      searchParamsString,
      cleanupQueryKeys,
      defaultTab,
      queryKey,
      pathname,
      language,
    ],
  );

  const setActiveTabAndQuery = useCallback(
    (tab: T) => {
      router.replace(buildUrl(tab), { scroll: false });
    },
    [router, buildUrl],
  );

  return {
    activeTab,
    setActiveTabAndQuery,
  };
}
