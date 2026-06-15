"use client";

import { useSearchParams } from "next/navigation";
import type { AccessGateType } from "@/components/Feature/AccessGate";

import {
  GATE_QUERY_PARAM,
  TYPE_CODE,
  TYPE_EMAIL,
  ID_QUERY_PARAM,
  ACCESS_TYPE_PASSWORD,
  ACCESS_TYPE_EMAIL_GATED,
} from "@/utils/Constants";

import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import {
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";

export function useCollectionAccessGate(customCollectionId?: string | null): {
  gateType: AccessGateType | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);
  const queryId = searchParams.get(ID_QUERY_PARAM);
  const id = customCollectionId !== undefined ? customCollectionId : queryId;

  const { isPublicView } = useCreatorChannelProfile();

  const collectionsQuery = useGetAPI<CollectionsApiResponse>(
    API.collection.getAll,
    undefined,
    {
      enabled: Boolean(id),
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const storageKey = id ? `kiibee:gate:unlocked:collection:${id}` : "";
  const isUnlocked =
    typeof window !== "undefined" && storageKey
      ? window.localStorage.getItem(storageKey) === "true"
      : false;

  if (isUnlocked) {
    return { gateType: null, isLoading: false };
  }

  if (gateParam === TYPE_CODE || gateParam === TYPE_EMAIL) {
    return { gateType: gateParam, isLoading: false };
  }

  const isLoading = collectionsQuery.isLoading;

  if (isLoading) {
    return { gateType: null, isLoading: true };
  }

  let accessType: string | null = null;
  const isOwner = !isPublicView;

  if (collectionsQuery.data) {
    const collections = getCollectionRows(collectionsQuery.data);
    const matched = collections.find((col) => col.id === id);
    if (matched) {
      accessType = matched.accessType ?? null;
    }
  }

  if (isOwner) {
    return { gateType: null, isLoading: false };
  }

  const gateType: AccessGateType | null =
    accessType === ACCESS_TYPE_PASSWORD
      ? TYPE_CODE
      : accessType === ACCESS_TYPE_EMAIL_GATED
        ? TYPE_EMAIL
        : null;

  return { gateType, isLoading: false };
}
