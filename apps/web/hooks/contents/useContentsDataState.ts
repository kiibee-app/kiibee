import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { CollectionRow } from "@/types/collectionsType";
import { collectionContentsData } from "@/utils/dummyData/collectionData";
import { useDeleteHandler } from "@/hooks/useCollectionDelete";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { formatDateUSShort } from "@/utils/formatDate";
import {
  CollectionsApiResponse,
  getCollectionList,
  resolveCollectionsUpdate,
} from "@/hooks/contents/collectionApi";

export const useContentsDataState = (
  selectedCollection: CollectionRow | null,
) => {
  const [localCollections, setLocalCollections] = useState<CollectionRow[]>([]);
  const [hasLocalOverride, setHasLocalOverride] = useState(false);
  const [contentsMap, setContentsMap] = useState(collectionContentsData);
  const { data: collectionsResponse } = useGetAPI<CollectionsApiResponse>(
    API.collection.getAll,
  );

  const apiCollections = useMemo(() => {
    if (!collectionsResponse) return [];
    const list = getCollectionList(collectionsResponse);
    return list
      .filter((item) => item?.id != null && item?.name)
      .map((item) => ({
        id: String(item.id),
        name: item.name as string,
        contentsCount: Number(item.contentsCount ?? 0),
        createdAt: formatDateUSShort(item.createdAt),
        actions: "",
      }));
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

  const contents = Object.values(contentsMap)[0] ?? [];

  const collectionContents = selectedCollection
    ? (contentsMap[selectedCollection.id] ?? contents)
    : [];

  const deleteState = useDeleteHandler(
    setCollections,
    setContentsMap,
    selectedCollection,
  );

  return {
    collections,
    setCollections,
    collectionContents,
    setContentsMap,
    ...deleteState,
  };
};
