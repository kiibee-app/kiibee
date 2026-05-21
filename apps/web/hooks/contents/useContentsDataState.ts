import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  CollectionContentRow,
  CollectionRow,
} from "@/types/collectionsType";
import { useDeleteHandler } from "@/hooks/useCollectionDelete";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionContentRows,
  getCollectionRows,
  resolveCollectionsUpdate,
} from "@/hooks/contents/collectionApi";

export const useContentsDataState = (
  selectedCollection: CollectionRow | null,
) => {
  const [localCollections, setLocalCollections] = useState<CollectionRow[]>([]);
  const [hasLocalOverride, setHasLocalOverride] = useState(false);
  const [contentsMap, setContentsMap] = useState<
    Record<string, CollectionContentRow[]>
  >({});
  const { data: collectionsResponse } = useGetAPI<CollectionsApiResponse>(
    API.collection.getAll,
  );
  const selectedCollectionId = selectedCollection?.id ?? "";
  const { data: collectionContentsResponse } =
    useGetAPI<CollectionContentsApiResponse>(
      API.content.collection(selectedCollectionId),
      undefined,
      {
        enabled: Boolean(selectedCollectionId),
      },
    );

  const apiCollections = useMemo(() => {
    if (!collectionsResponse) return [];
    return getCollectionRows(collectionsResponse);
  }, [collectionsResponse]);

  const mergedCollections = useMemo(() => {
    const incomingIds = new Set(apiCollections.map((item) => item.id));
    const optimisticOnly = localCollections.filter(
      (item) => !incomingIds.has(item.id),
    );
    return [...apiCollections, ...optimisticOnly];
  }, [apiCollections, localCollections]);

  const collections = hasLocalOverride ? localCollections : mergedCollections;

  const setCollections: Dispatch<SetStateAction<CollectionRow[]>> = (
    updater,
  ) => {
    setHasLocalOverride(true);
    setLocalCollections((prev) => {
      const base = hasLocalOverride ? prev : mergedCollections;
      return resolveCollectionsUpdate(updater, base);
    });
  };

  const apiCollectionContents = useMemo(() => {
    if (!collectionContentsResponse) return [];
    return getCollectionContentRows(collectionContentsResponse);
  }, [collectionContentsResponse]);

  const collectionContents = selectedCollection
    ? (contentsMap[selectedCollection.id] ?? apiCollectionContents)
    : [];

  const deleteState = useDeleteHandler(
    setCollections,
    setContentsMap,
    selectedCollection,
    collectionContents,
  );

  return {
    collections,
    setCollections,
    collectionContents,
    setContentsMap,
    ...deleteState,
  };
};
