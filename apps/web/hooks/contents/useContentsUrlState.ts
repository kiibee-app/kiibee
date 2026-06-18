"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CollectionRow } from "@/types/collectionsType";
import {
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
  CONTENT_LAST_EDITED_STORAGE_KEY,
  CONTENT_TAB,
} from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";
import { storage } from "@/utils/storage";
import { ADD_CONTENT_TABS, type AddContentTab } from "@/utils/common";

type Params = {
  collections: CollectionRow[];
  selectedCollection: CollectionRow | null;
  setSelectedCollection: (collection: CollectionRow | null) => void;
  onEditContent: (id: string) => void;
  onBackStateOnly: () => void;
  activeTab?: string;
};

const getLiveSearch = (fallback: string) =>
  isBrowser ? window.location.search : `?${fallback}`;

export function useContentsUrlState({
  collections,
  selectedCollection,
  setSelectedCollection,
  onEditContent,
  onBackStateOnly,
  activeTab,
}: Params) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";

  const queryCollectionId = searchParams?.get(CONTENT_COLLECTION_QUERY_KEY);
  const queryContentId = searchParams?.get(CONTENT_ITEM_QUERY_KEY);

  const isClearingParamsRef = useRef(false);
  const hasRestoredCollectionRef = useRef(false);
  const hasRestoredContentRef = useRef(false);

  const effectiveContentId = queryContentId;

  const replaceQuery = useCallback(
    (updates: {
      tab?: string | null;
      collectionId?: string | null;
      contentId?: string | null;
    }) => {
      const params = new URLSearchParams(getLiveSearch(searchParamsString));

      const apply = (key: string, value: string | null | undefined) =>
        value === undefined
          ? undefined
          : value
            ? params.set(key, value)
            : params.delete(key);

      apply(CONTENT_TAB, updates.tab);
      apply(CONTENT_COLLECTION_QUERY_KEY, updates.collectionId);
      apply(CONTENT_ITEM_QUERY_KEY, updates.contentId);

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParamsString],
  );

  useEffect(() => {
    if (
      hasRestoredCollectionRef.current ||
      isClearingParamsRef.current ||
      !queryCollectionId ||
      !collections.length
    ) {
      return;
    }

    const match = collections.find((c) => c.id === queryCollectionId);

    if (!match) {
      replaceQuery({ collectionId: null, contentId: null });
      hasRestoredCollectionRef.current = true;
      return;
    }

    setSelectedCollection(match);
  }, [collections, queryCollectionId, replaceQuery, setSelectedCollection]);

  useEffect(() => {
    const canEditContent =
      !hasRestoredContentRef.current &&
      !isClearingParamsRef.current &&
      !!effectiveContentId &&
      !!selectedCollection?.id;

    if (canEditContent) {
      onEditContent(effectiveContentId);
      hasRestoredContentRef.current = true;
    }
  }, [
    queryCollectionId,
    selectedCollection,
    effectiveContentId,
    onEditContent,
  ]);

  const handleSelectCollection = useCallback(
    (collection: CollectionRow) => {
      setSelectedCollection(collection);
      replaceQuery({ collectionId: collection.id, contentId: null });
    },
    [replaceQuery, setSelectedCollection],
  );

  const syncContentIdToUrl = useCallback(
    (id: string, tab?: string | null) => {
      storage.set(CONTENT_LAST_EDITED_STORAGE_KEY, id);
      replaceQuery({
        collectionId: selectedCollection?.id ?? queryCollectionId ?? null,
        contentId: id,
        tab: tab,
      });
    },
    [queryCollectionId, replaceQuery, selectedCollection?.id],
  );

  const handleEditContent = useCallback(
    (id: string) => {
      const nextUploadTab = Object.values(ADD_CONTENT_TABS).includes(
        activeTab as AddContentTab,
      )
        ? (activeTab as AddContentTab)
        : ADD_CONTENT_TABS.GENERAL;
      syncContentIdToUrl(id, nextUploadTab);
      onEditContent(id);
    },
    [onEditContent, syncContentIdToUrl, activeTab],
  );

  const handleBack = useCallback(() => {
    isClearingParamsRef.current = true;
    storage.remove(CONTENT_LAST_EDITED_STORAGE_KEY);
    replaceQuery({
      tab: null,
      collectionId: selectedCollection?.id ?? null,
      contentId: null,
    });
    onBackStateOnly();
    hasRestoredContentRef.current = false;
    isClearingParamsRef.current = false;
  }, [onBackStateOnly, replaceQuery, selectedCollection?.id]);

  const handleBackToCollection = useCallback(() => {
    isClearingParamsRef.current = true;
    storage.remove(CONTENT_LAST_EDITED_STORAGE_KEY);
    replaceQuery({
      tab: null,
      contentId: null,
      collectionId: null,
    });

    setSelectedCollection(null);
    onBackStateOnly();
    hasRestoredContentRef.current = false;
  }, [onBackStateOnly, replaceQuery, setSelectedCollection]);

  return {
    handleBack,
    handleBackToCollection,
    handleEditContent,
    handleSelectCollection,
    syncContentIdToUrl,
  };
}
