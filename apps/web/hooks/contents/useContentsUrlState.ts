"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CollectionRow } from "@/types/collectionsType";
import {
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
  CONTENT_TAB,
} from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";

const CONTENT_LAST_EDITED_STORAGE_KEY = "contents:lastEditedContentId";

type Params = {
  collections: CollectionRow[];
  selectedCollection: CollectionRow | null;
  setSelectedCollection: (collection: CollectionRow | null) => void;
  onEditContent: (id: string) => void;
  onBackStateOnly: () => void;
};

const getLiveSearch = (fallback: string) =>
  isBrowser ? window.location.search : `?${fallback}`;

export function useContentsUrlState({
  collections,
  selectedCollection,
  setSelectedCollection,
  onEditContent,
  onBackStateOnly,
}: Params) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";

  const queryCollectionId = searchParams?.get(CONTENT_COLLECTION_QUERY_KEY);
  const queryContentId = searchParams?.get(CONTENT_ITEM_QUERY_KEY);

  // Prevent restore effects from immediately rehydrating state while we are clearing URL params.
  const isClearingParamsRef = useRef(false);
  useEffect(() => {
    if (!queryCollectionId && !queryContentId) {
      isClearingParamsRef.current = false;
    }
  }, [queryCollectionId, queryContentId]);

  const storedContentId = useMemo(() => {
    if (!isBrowser) return null;
    return window.localStorage.getItem(CONTENT_LAST_EDITED_STORAGE_KEY);
  }, []);

  const effectiveContentId = queryContentId ?? storedContentId;

  const replaceQuery = useCallback(
    (updates: {
      tab?: string | null;
      collectionId?: string | null;
      contentId?: string | null;
    }) => {
      const params = new URLSearchParams(getLiveSearch(searchParamsString));

      const apply = (key: string, value: string | null | undefined) => {
        if (value === undefined) return;
        if (value) params.set(key, value);
        else params.delete(key);
      };

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

  const hasRestoredCollectionRef = useRef(false);
  useEffect(() => {
    if (hasRestoredCollectionRef.current) return;
    if (isClearingParamsRef.current) return;
    if (!queryCollectionId) {
      hasRestoredCollectionRef.current = true;
      return;
    }
    if (!collections.length) return;

    const match = collections.find((c) => c.id === queryCollectionId) ?? null;
    if (match) {
      setSelectedCollection(match);
      return;
    }

    replaceQuery({ collectionId: null, contentId: null });
    hasRestoredCollectionRef.current = true;
  }, [collections, queryCollectionId, replaceQuery, setSelectedCollection]);

  useEffect(() => {
    if (!queryCollectionId || !selectedCollection) return;
    if (selectedCollection.id === queryCollectionId) {
      hasRestoredCollectionRef.current = true;
    }
  }, [queryCollectionId, selectedCollection]);

  const hasRestoredContentRef = useRef(false);
  useEffect(() => {
    if (hasRestoredContentRef.current) return;
    if (isClearingParamsRef.current) return;
    if (!effectiveContentId) {
      hasRestoredContentRef.current = true;
      return;
    }
    if (!selectedCollection?.id) return;

    onEditContent(effectiveContentId);
    hasRestoredContentRef.current = true;
  }, [effectiveContentId, onEditContent, selectedCollection?.id]);

  const handleSelectCollection = useCallback(
    (collection: CollectionRow) => {
      setSelectedCollection(collection);
      replaceQuery({ collectionId: collection.id, contentId: null });
      hasRestoredContentRef.current = false;
    },
    [replaceQuery, setSelectedCollection],
  );

  const handleEditContent = useCallback(
    (id: string) => {
      if (isBrowser) {
        window.localStorage.setItem(CONTENT_LAST_EDITED_STORAGE_KEY, id);
      }
      replaceQuery({
        collectionId: selectedCollection?.id ?? null,
        contentId: id,
      });
      onEditContent(id);
    },
    [onEditContent, replaceQuery, selectedCollection?.id],
  );

  const handleBack = useCallback(() => {
    isClearingParamsRef.current = true;
    if (isBrowser) {
      window.localStorage.removeItem(CONTENT_LAST_EDITED_STORAGE_KEY);
    }
    replaceQuery({
      tab: null,
      collectionId: selectedCollection?.id ?? null,
      contentId: null,
    });
    onBackStateOnly();
    hasRestoredContentRef.current = false;
  }, [onBackStateOnly, replaceQuery, selectedCollection?.id]);

  const handleBackToCollection = useCallback(() => {
    isClearingParamsRef.current = true;

    if (isBrowser) {
      window.localStorage.removeItem(CONTENT_LAST_EDITED_STORAGE_KEY);
    }
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
  };
}
