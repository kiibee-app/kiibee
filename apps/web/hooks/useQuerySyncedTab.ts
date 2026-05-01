"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  const validTabSet = useMemo(() => new Set<T>(validTabs), [validTabs]);

  const tabFromQuery = useMemo(() => {
    const tabParam = searchParams?.get(queryKey);
    if (tabParam && validTabSet.has(tabParam as T)) {
      return tabParam as T;
    }
    return defaultTab;
  }, [defaultTab, queryKey, searchParams, validTabSet]);

  const [activeTab, setActiveTab] = useState<T>(tabFromQuery);

  useEffect(() => {
    setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    let hasChanges = false;

    cleanupQueryKeys.forEach((key) => {
      if (params.has(key)) {
        params.delete(key);
        hasChanges = true;
      }
    });

    const currentTabParam = searchParams?.get(queryKey);
    const expectedTabParam = tabFromQuery === defaultTab ? null : tabFromQuery;
    if (currentTabParam !== expectedTabParam) {
      if (expectedTabParam) {
        params.set(queryKey, expectedTabParam);
      } else {
        params.delete(queryKey);
      }
      hasChanges = true;
    }

    if (!hasChanges) return;

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [
    cleanupQueryKeys,
    defaultTab,
    pathname,
    queryKey,
    router,
    searchParams,
    tabFromQuery,
  ]);

  const setActiveTabAndQuery = useCallback(
    (tabKey: T) => {
      setActiveTab(tabKey);

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      cleanupQueryKeys.forEach((key) => {
        params.delete(key);
      });
      if (tabKey === defaultTab) {
        params.delete(queryKey);
      } else {
        params.set(queryKey, tabKey);
      }

      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [cleanupQueryKeys, defaultTab, pathname, queryKey, router, searchParams],
  );

  return {
    activeTab,
    setActiveTabAndQuery,
  };
}
