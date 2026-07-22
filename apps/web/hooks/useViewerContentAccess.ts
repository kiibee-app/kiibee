"use client";

import { useMemo } from "react";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import { useViewerRentedData } from "@/hooks/useViewerRented";
import { RENTED_MODES, type RentedContentSources } from "@/utils/viewerRented";

type OwnershipItem = {
  id: string;
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
    if (!isLoggedIn || !collectionId) return false;
    return (
      hasCollection(purchasedData, collectionId) ||
      hasCollection(rentedData, collectionId)
    );
  }, [collectionId, isLoggedIn, purchasedData, rentedData]);

  const hasAccess = useMemo(() => {
    if (!isLoggedIn) return false;

    return (
      isOwner ||
      hasItem(purchasedData, contentId) ||
      Boolean(rentedItem) ||
      hasCollectionAccess
    );
  }, [
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

  const hasAccess = isPurchased || isRented;

  return {
    isLoggedIn,
    hasAccess,
    isPurchased,
    isRented,
  };
}
