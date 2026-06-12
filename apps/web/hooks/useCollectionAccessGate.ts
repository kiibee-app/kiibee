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

export function useCollectionAccessGate(): {
  gateType: AccessGateType | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const gateParam = searchParams.get(GATE_QUERY_PARAM);
  const id = searchParams.get(ID_QUERY_PARAM);

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

  if (gateParam === TYPE_CODE || gateParam === TYPE_EMAIL) {
    return { gateType: gateParam, isLoading: false };
  }

  const isLoading = collectionsQuery.isLoading;

  if (isLoading) {
    return { gateType: null, isLoading: true };
  }

  let accessType: string | null = null;
  let isOwner = !isPublicView;

  if (collectionsQuery.data) {
    const collections = getCollectionRows(collectionsQuery.data);
    const matched = collections.find((col) => col.id === id);
    if (matched) {
      accessType = matched.accessType ?? null;
      isOwner = true;
    }
  }

  if (isOwner) {
    return { gateType: null, isLoading: false };
  }

  let gateType: AccessGateType | null = null;
  if (accessType === ACCESS_TYPE_PASSWORD) {
    gateType = TYPE_CODE;
  } else if (accessType === ACCESS_TYPE_EMAIL_GATED) {
    gateType = TYPE_EMAIL;
  }

  return { gateType, isLoading: false };
}
