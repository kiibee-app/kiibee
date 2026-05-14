import { useState } from "react";
import { CollectionRow } from "@/types/collectionsType";
import {
  collectionsData,
  collectionContentsData,
} from "@/utils/dummyData/collectionData";
import { useDeleteHandler } from "@/hooks/useCollectionDelete";

export const useContentsDataState = (
  selectedCollection: CollectionRow | null,
) => {
  const [collections, setCollections] = useState(collectionsData);
  const [contentsMap, setContentsMap] = useState(collectionContentsData);

  const collectionContents = selectedCollection
    ? (contentsMap[selectedCollection.id] ?? [])
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
    ...deleteState,
  };
};
