"use client";

import { useMemo } from "react";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import { useViewerRentedData } from "@/hooks/useViewerRented";
import { API, useGetAPI } from "@/lib/http/api";
import { RENTED_MODES, type RentedContentSources } from "@/utils/viewerRented";
import {
  getContentUnlockStorageKey,
  getCollectionUnlockStorageKey,
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

export function useViewerContentAccess(
  contentId: string,
  creatorId?: string | null,
  collectionId?: string | null,
) {
  const user = useStoredLoginUser();
  const isLoggedIn = Boolean(user?.id);
  const isOwner = Boolean(creatorId && user?.id === creatorId);
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
      hasLocalCollectionUnlock(collectionId) ||
      (isLoggedIn &&
        (hasCollection(purchasedData, collectionId) ||
          hasCollection(rentedData, collectionId)))
    );
  }, [collectionId, isLoggedIn, purchasedData, rentedData]);

  const hasAccess = useMemo(() => {
    if (hasLocalContentUnlock(contentId) || hasCollectionAccess) {
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
    hasCollectionAccess,
    isLoggedIn,
    isOwner,
    purchasedData,
    rentedItem,
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

export function useViewerCollectionAccess(collectionId?: string | null) {
  const user = useStoredLoginUser();
  const isLoggedIn = Boolean(user?.id);
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
    isPurchased || isRented || hasLocalCollectionUnlock(collectionId);

  return {
    isLoggedIn,
    hasAccess,
    isPurchased,
    isRented,
  };
}
