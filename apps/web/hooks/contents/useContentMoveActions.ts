import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import {
  MOVE_DIRECTION_DOWN,
  MOVE_DIRECTION_UP,
  moveItemInArray,
} from "@/utils/sortOptions";

type UseContentMoveActionsParams = {
  selectedCollection: CollectionRow | null;
  collectionContents: CollectionContentRow[];
  setContentsMap: Dispatch<
    SetStateAction<Record<string, CollectionContentRow[]>>
  >;
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>;
};

export const useContentMoveActions = ({
  selectedCollection,
  collectionContents,
  setContentsMap,
  setCollections,
}: UseContentMoveActionsParams) => {
  const queryClient = useQueryClient();
  const [showMoveContentModal, setShowMoveContentModal] = useState(false);
  const [showMoveSuccessModal, setShowMoveSuccessModal] = useState(false);
  const [contentToMoveId, setContentToMoveId] = useState<string | null>(null);

  const handleMoveUp = (id: string) => {
    if (selectedCollection) {
      setContentsMap((current) => ({
        ...current,
        [selectedCollection.id]: moveItemInArray(
          current[selectedCollection.id] ?? collectionContents,
          id,
          MOVE_DIRECTION_UP,
        ),
      }));
      return;
    }

    setCollections((current) =>
      moveItemInArray(current, id, MOVE_DIRECTION_UP),
    );
  };

  const handleMoveDown = (id: string) => {
    if (selectedCollection) {
      setContentsMap((current) => ({
        ...current,
        [selectedCollection.id]: moveItemInArray(
          current[selectedCollection.id] ?? collectionContents,
          id,
          MOVE_DIRECTION_DOWN,
        ),
      }));
      return;
    }

    setCollections((current) =>
      moveItemInArray(current, id, MOVE_DIRECTION_DOWN),
    );
  };

  const openMoveModal = (contentId: string) => {
    setContentToMoveId(contentId);
    setShowMoveContentModal(true);
  };

  const resetMoveSelection = () => {
    setContentToMoveId(null);
  };

  const handleConfirmMoveContent = useCallback(
    async (targetCollectionId: string) => {
      if (!selectedCollection || !contentToMoveId) return;

      const sourceCollectionId = selectedCollection.id;
      const closeWithSuccess = () => {
        setShowMoveContentModal(false);
        setShowMoveSuccessModal(true);
      };

      if (sourceCollectionId === targetCollectionId) return closeWithSuccess();

      await axiosClient.put(API.content.update(contentToMoveId), {
        collectionId: targetCollectionId,
        sourceCollectionId,
      });

      setContentsMap((current) => {
        const sourceItems = current[sourceCollectionId] ?? collectionContents;
        const movedItem = sourceItems.find(
          (item) => item.id === contentToMoveId,
        );
        if (!movedItem) return current;

        const nextSourceItems = sourceItems.filter(
          (item) => item.id !== contentToMoveId,
        );
        const targetItems = current[targetCollectionId];
        const nextMap: Record<string, CollectionContentRow[]> = {
          ...current,
          [sourceCollectionId]: nextSourceItems,
        };

        return targetItems
          ? {
              ...nextMap,
              [targetCollectionId]: [...targetItems, movedItem],
            }
          : nextMap;
      });

      setCollections((current) =>
        current.map((collection) => {
          if (collection.id === sourceCollectionId) {
            return {
              ...collection,
              contentsCount: Math.max(0, collection.contentsCount - 1),
            };
          }
          if (collection.id === targetCollectionId) {
            return {
              ...collection,
              contentsCount: Math.max(0, collection.contentsCount + 1),
            };
          }
          return collection;
        }),
      );

      closeWithSuccess();

      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: [API.content.collection(sourceCollectionId)],
        }),
        queryClient.invalidateQueries({
          queryKey: [API.content.collection(targetCollectionId)],
        }),
        queryClient.invalidateQueries({ queryKey: [API.collection.getAll] }),
      ]);
    },
    [
      collectionContents,
      contentToMoveId,
      queryClient,
      selectedCollection,
      setCollections,
      setContentsMap,
    ],
  );

  return {
    handleMoveUp,
    handleMoveDown,
    handleConfirmMoveContent,
    openMoveModal,
    resetMoveSelection,
    showMoveContentModal,
    setShowMoveContentModal,
    showMoveSuccessModal,
    setShowMoveSuccessModal,
  };
};
