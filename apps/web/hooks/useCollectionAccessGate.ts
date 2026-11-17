"use client";

import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { getCollectionUnlockStorageKey } from "@/utils/accessGate";
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

export function useCollectionAccessGate(
  customCollectionId?: string | null,
  customCreatorId?: string | null,
): {
  gateType: AccessGateType | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);
  const queryId = searchParams.get(ID_QUERY_PARAM);
  const id = customCollectionId !== undefined ? customCollectionId : queryId;

  const { isPublicView: routeIsPublic, publicCreatorId: routeCreatorId } =
    useCreatorChannelProfile(!customCreatorId);
  const user = useStoredLoginUser();
  const publicCreatorId = customCreatorId ?? routeCreatorId;
  const isPublicView = customCreatorId
    ? customCreatorId !== user?.id
    : routeIsPublic;
  const canReadCollections =
    Boolean(id) &&
    (isPublicView ? Boolean(publicCreatorId) : Boolean(user?.id));

  const collectionsQuery = useGetAPI<CollectionsApiResponse>(
    isPublicView && publicCreatorId
      ? API.collection.getPublicByCreator(publicCreatorId)
      : API.collection.getAll,
    undefined,
    {
      enabled: canReadCollections,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  if (gateParam === TYPE_CODE || gateParam === TYPE_EMAIL) {
    return { gateType: gateParam, isLoading: false };
  }

  const isLoading = canReadCollections && collectionsQuery.isLoading;

  if (isLoading) {
    return { gateType: null, isLoading: true };
  }

  let accessType: string | null = null;
  const isOwner = !isPublicView;

  if (collectionsQuery.data) {
    const collections = getCollectionRows(collectionsQuery.data);
    const matched = collections.find((col) => col.id === id || col.slug === id);
    if (matched) {
      accessType = matched.accessType ?? null;
    }
  }

  if (isOwner) {
    return { gateType: null, isLoading: false };
  }

  const isUnlocked = Boolean(
    id &&
    typeof window !== "undefined" &&
    window.localStorage.getItem(getCollectionUnlockStorageKey(id)) === "true",
  );

  const gateType: AccessGateType | null =
    accessType === ACCESS_TYPE_PASSWORD
      ? TYPE_CODE
      : accessType === ACCESS_TYPE_EMAIL_GATED
        ? TYPE_EMAIL
        : null;

  return { gateType: isUnlocked ? null : gateType, isLoading: false };
}
