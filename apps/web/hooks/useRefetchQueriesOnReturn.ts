"use client";

import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { FOCUS, PAGESHOW, VISIBILITY_CHANGE, VISIBLE } from "@/utils/common";

export function useRefetchQueriesOnReturn(
  queryKeys: readonly (readonly unknown[])[],
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetchQueries = () => {
      queryKeys.forEach((queryKey) => {
        void queryClient.refetchQueries({ queryKey: queryKey as QueryKey });
      });
    };

    const refetchOnVisible = () => {
      if (document.visibilityState === VISIBLE) {
        refetchQueries();
      }
    };

    window.addEventListener(PAGESHOW, refetchQueries);
    window.addEventListener(FOCUS, refetchQueries);
    document.addEventListener(VISIBILITY_CHANGE, refetchOnVisible);

    return () => {
      window.removeEventListener(PAGESHOW, refetchQueries);
      window.removeEventListener(FOCUS, refetchQueries);
      document.removeEventListener(VISIBILITY_CHANGE, refetchOnVisible);
    };
    // queryKeys are stable module-level constants from each page.
  }, [queryClient, queryKeys]);
}
