"use client";

import { useChannelCodeVisit } from "./useChannelCodeVisit";
import { useChannelOwnerAccess } from "@/hooks/useChannelOwnerAccess";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";

import { useMemo } from "react";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import { useViewerRentedData } from "@/hooks/useViewerRented";
import { API, useGetAPI } from "@/lib/http/api";
import { RENTED_MODES, type RentedContentSources } from "@/utils/viewerRented";
import {
  getContentUnlockStorageKey,
  getCollectionUnlockStorageKey,
  getCreatorUnlockStorageKey,
} from "@/utils/accessGate";
import { STRING_TRUE } from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";

type OwnershipItem = {
  id: string;
};

type AccessibleContentIdsResponse = {
  success?: boolean;
  data?: {
    contentIds?: string[];
  };
};

const hasItem = (data: RentedContentSources | undefined, id: string) => {
  if (!data) return false;

  return (
    data.videos?.some((item: OwnershipItem) => item.id === id) ||
    data.audios?.some((item: OwnershipItem) => item.id === id) ||
    data.pdfs?.some((item: OwnershipItem) => item.id === id) ||
    data.webs?.some((item: OwnershipItem) => item.id === id) ||
    false
  );
};

const hasCollection = (
  data: RentedContentSources | undefined,
  collectionId?: string | null,
) => {
  if (!data || !collectionId) return false;
  return data.collections?.some((item) => item.id === collectionId) ?? false;
};

const hasLocalContentUnlock = (contentId: string) => {
  if (!isBrowser || !contentId) return false;
  return (
    window.localStorage.getItem(getContentUnlockStorageKey(contentId)) ===
    STRING_TRUE
  );
};

const hasLocalCollectionUnlock = (collectionId?: string | null) => {
  if (!isBrowser || !collectionId) return false;
  return (
    window.localStorage.getItem(getCollectionUnlockStorageKey(collectionId)) ===
    STRING_TRUE
  );
};

const hasLocalCreatorUnlock = (
  creatorId?: string | null,
  userId?: string | null,
) => {
  if (!isBrowser || !creatorId) return false;
  const keyWithUser = getCreatorUnlockStorageKey(creatorId, userId);
  const keyWithoutUser = getCreatorUnlockStorageKey(creatorId, null);
  return Boolean(
    (keyWithUser &&
      window.localStorage.getItem(`${keyWithUser}:email`) === STRING_TRUE) ||
    (keyWithoutUser &&
      window.localStorage.getItem(`${keyWithoutUser}:email`) === STRING_TRUE),
  );
};

function useProfileEntitlement(creatorId?: string | null, userId?: string) {
  const hasCodeVisit = useChannelCodeVisit(creatorId, userId);
  const { data } = useQuery({
    queryKey: ["profile-payment", creatorId, userId],
    enabled: Boolean(creatorId && userId && creatorId !== userId),
    staleTime: 0,
    refetchInterval: 30_000,
    queryFn: async () =>
      (
        await axiosClient.get(
          `/content/profile-entitlement/${encodeURIComponent(creatorId!)}`,
        )
      ).data.data as {
        required: boolean;
        codeRequired?: boolean;
        hasAccess: boolean;
      },
  });
  return Boolean(
    creatorId !== userId &&
    (data?.required || (data?.codeRequired && hasCodeVisit)) &&
    data.hasAccess,
  );
}

export function useViewerContentAccess(
  contentId: string,
  creatorId?: string | null,
  collectionId?: string | null,
) {
  const user = useStoredLoginUser();
  const isLoggedIn = Boolean(user?.id);
  const hasProfileAccess = useProfileEntitlement(creatorId, user?.id);
  const isOwner = useChannelOwnerAccess(
    Boolean(creatorId && user?.id === creatorId),
  );
  const { data: purchasedData } = useViewerPurchased(isLoggedIn);
  const { sources: rentedData } = useViewerRentedData(
    RENTED_MODES.CURRENTLY,
    isLoggedIn,
  );
  const { data: accessibleResponse } = useGetAPI<AccessibleContentIdsResponse>(
    API.viewer.accessibleContentIds,
    undefined,
    { enabled: isLoggedIn },
  );

  const accessibleContentIds = useMemo(() => {
    const ids = accessibleResponse?.data?.contentIds;
    return new Set(Array.isArray(ids) ? ids : []);
  }, [accessibleResponse]);

  const rentedItem = useMemo(() => {
    if (!isLoggedIn) return undefined;

    return [
      ...(rentedData?.videos ?? []),
      ...(rentedData?.audios ?? []),
      ...(rentedData?.pdfs ?? []),
      ...(rentedData?.webs ?? []),
    ].find((item) => item.id === contentId);
  }, [contentId, isLoggedIn, rentedData]);

  const hasCollectionAccess = useMemo(() => {
    return (
      hasProfileAccess ||
      hasLocalCollectionUnlock(collectionId) ||
      (isLoggedIn &&
        (hasCollection(purchasedData, collectionId) ||
          hasCollection(rentedData, collectionId)))
    );
  }, [collectionId, isLoggedIn, purchasedData, rentedData, hasProfileAccess]);

  const hasAccess = useMemo(() => {
    if (
      hasLocalContentUnlock(contentId) ||
      hasCollectionAccess ||
      hasLocalCreatorUnlock(creatorId, user?.id)
    ) {
      return true;
    }

    if (!isLoggedIn) return false;

    return (
      isOwner ||
      hasItem(purchasedData, contentId) ||
      Boolean(rentedItem) ||
      accessibleContentIds.has(contentId)
    );
  }, [
    accessibleContentIds,
    contentId,
    creatorId,
    hasCollectionAccess,
    isLoggedIn,
    isOwner,
    purchasedData,
    rentedItem,
    user?.id,
  ]);

  return {
    isLoggedIn,
    hasAccess,
    hasCollectionAccess,
    isOwner,
    rentedItem,
    user,
  };
}

export function useViewerCollectionAccess(
  collectionId?: string | null,
  creatorId?: string | null,
) {
  const user = useStoredLoginUser();
  const isLoggedIn = Boolean(user?.id);
  const hasProfileAccess = useProfileEntitlement(creatorId, user?.id);
  const { data: purchasedData } = useViewerPurchased(isLoggedIn);
  const { sources: rentedData } = useViewerRentedData(
    RENTED_MODES.CURRENTLY,
    isLoggedIn,
  );

  const isPurchased = useMemo(() => {
    if (!isLoggedIn || !collectionId) return false;
    return hasCollection(purchasedData, collectionId);
  }, [collectionId, isLoggedIn, purchasedData]);

  const isRented = useMemo(() => {
    if (!isLoggedIn || !collectionId) return false;
    return hasCollection(rentedData, collectionId);
  }, [collectionId, isLoggedIn, rentedData]);

  const hasAccess =
    hasProfileAccess ||
    isPurchased ||
    isRented ||
    hasLocalCollectionUnlock(collectionId) ||
    hasLocalCreatorUnlock(creatorId, user?.id);

  return {
    isLoggedIn,
    hasAccess,
    isPurchased,
    isRented,
  };
}
