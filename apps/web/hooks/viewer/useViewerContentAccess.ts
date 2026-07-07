"use client";

import { useCallback, useMemo } from "react";
import { API, useGetAPI } from "@/lib/http/api";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { ACCESS_TYPE_PURCHASED, ACCESS_TYPE_RENTED } from "@/utils/Constants";

type ViewerMediaItem = {
  id: string;
};

type ViewerDataPayload = {
  videos?: ViewerMediaItem[];
  audios?: ViewerMediaItem[];
  pdfs?: ViewerMediaItem[];
  webs?: ViewerMediaItem[];
};

type ViewerDataResponse = {
  success?: boolean;
  data?: ViewerDataPayload;
};

export type ViewerContentAccessType =
  | typeof ACCESS_TYPE_PURCHASED
  | typeof ACCESS_TYPE_RENTED;

function collectMediaIds(
  data: ViewerDataPayload | undefined,
  accessType: ViewerContentAccessType,
  map: Map<string, ViewerContentAccessType>,
) {
  if (!data) return;

  const sections = [data.videos, data.audios, data.pdfs, data.webs] as const;

  for (const items of sections) {
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      if (!item?.id || map.has(item.id)) continue;
      map.set(item.id, accessType);
    }
  }
}

export function useViewerContentAccess() {
  const user = useStoredLoginUser();
  const isLoggedIn = Boolean(user?.id);

  const purchasedQuery = useGetAPI<ViewerDataResponse>(
    API.viewer.purchasedData,
    undefined,
    { enabled: isLoggedIn },
  );
  const rentedQuery = useGetAPI<ViewerDataResponse>(
    API.viewer.rentedData,
    undefined,
    { enabled: isLoggedIn },
  );

  const accessMap = useMemo(() => {
    const map = new Map<string, ViewerContentAccessType>();

    if (!isLoggedIn) return map;

    collectMediaIds(purchasedQuery.data?.data, ACCESS_TYPE_PURCHASED, map);
    collectMediaIds(rentedQuery.data?.data, ACCESS_TYPE_RENTED, map);

    return map;
  }, [isLoggedIn, purchasedQuery.data, rentedQuery.data]);

  const getAccessType = useCallback(
    (contentId: string): ViewerContentAccessType | null =>
      accessMap.get(contentId) ?? null,
    [accessMap],
  );

  return {
    getAccessType,
    isLoggedIn,
    isLoading:
      isLoggedIn && (purchasedQuery.isLoading || rentedQuery.isLoading),
  };
}
