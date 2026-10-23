import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { QUERY_KEYS } from "@/utils/Constants";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import {
  MOVE_DIRECTION_DOWN,
  MOVE_DIRECTION_UP,
  moveItemInArray,
} from "@/utils/sortOptions";

type UseContentMoveActionsParams = {
  collections: CollectionRow[];
  selectedCollection: CollectionRow | null;
  collectionContents: CollectionContentRow[];
  setContentsMap: Dispatch<
    SetStateAction<Record<string, CollectionContentRow[]>>
  >;
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>;
};

export const useContentMoveActions = ({
  collections,
  selectedCollection,
  collectionContents,
  setContentsMap,
  setCollections,
}: UseContentMoveActionsParams) => {
  const queryClient = useQueryClient();
  const [showMoveContentModal, setShowMoveContentModal] = useState(false);
  const [showMoveSuccessModal, setShowMoveSuccessModal] = useState(false);
  const [contentToMoveId, setContentToMoveId] = useState<string | null>(null);

  const moveRow = <T extends { id: string }>(
    items: T[],
    sourceId: string,
    targetId: string,
  ) => {
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
      return items;
    }

    const next = [...items];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    return next;
  };

  const saveCollectionOrder = useCallback(
    async (nextCollections: CollectionRow[]) => {
      const previousCollections = collections;
      setCollections(nextCollections);

      try {
        await axiosClient.patch(API.collection.reorder, {
          collectionIds: nextCollections.map((item) => item.id),
        });
        await queryClient.invalidateQueries({
          queryKey: [API.collection.getAll],
        });
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROFILE_LATEST_UPLOAD],
        });
      } catch (error) {
        setCollections(previousCollections);
        console.error("Failed to save collection order:", error);
        toast.error("Failed to save the new order. Please try again.");
      }
    },
    [collections, queryClient, setCollections],
  );

  const saveContentOrder = useCallback(
    async (nextContents: CollectionContentRow[]) => {
      if (!selectedCollection) return;
      const collectionId = selectedCollection.id;
      const previousContents = collectionContents;
      setContentsMap((current) => ({
        ...current,
        [collectionId]: nextContents,
      }));

      try {
        await axiosClient.put(API.content.reorderCollection(collectionId), {
          contentIds: nextContents.map((item) => item.id),
        });
        await queryClient.invalidateQueries({
          queryKey: [API.content.collection(collectionId)],
        });
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROFILE_LATEST_UPLOAD],
        });
      } catch (error) {
        setContentsMap((current) => ({
          ...current,
          [collectionId]: previousContents,
        }));
        console.error("Failed to save content order:", error);
        toast.error("Failed to save the new order. Please try again.");
      }
    },
    [collectionContents, queryClient, selectedCollection, setContentsMap],
  );

  const reorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    if (selectedCollection) {
      void saveContentOrder(moveRow(collectionContents, sourceId, targetId));
      return;
    }

    void saveCollectionOrder(moveRow(collections, sourceId, targetId));
  };

  const handleMoveUp = (id: string) => {
    if (selectedCollection) {
      void saveContentOrder(
        moveItemInArray(collectionContents, id, MOVE_DIRECTION_UP),
      );
      return;
    }

    void saveCollectionOrder(
      moveItemInArray(collections, id, MOVE_DIRECTION_UP),
    );
  };

  const handleMoveDown = (id: string) => {
    if (selectedCollection) {
      void saveContentOrder(
        moveItemInArray(collectionContents, id, MOVE_DIRECTION_DOWN),
      );
      return;
    }

    void saveCollectionOrder(
      moveItemInArray(collections, id, MOVE_DIRECTION_DOWN),
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
    reorder,
    handleConfirmMoveContent,
    openMoveModal,
    resetMoveSelection,
    showMoveContentModal,
    setShowMoveContentModal,
    showMoveSuccessModal,
    setShowMoveSuccessModal,
  };
};
