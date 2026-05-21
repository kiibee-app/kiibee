import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  COLLECTION_TABLE_TYPE,
  type CollectionTableType,
} from "@/utils/collection";
import type {
  CollectionContentRow,
  CollectionRow,
} from "@/types/collectionsType";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";

type SetState<T> = Dispatch<SetStateAction<T>>;

export const useDeleteHandler = (
  setCollections: SetState<CollectionRow[]>,
  setContentsMap: SetState<Record<string, CollectionContentRow[]>>,
  selectedCollection: CollectionRow | null,
  selectedCollectionContents: CollectionContentRow[] = [],
) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<CollectionTableType | null>(
    null,
  );

  const openDelete = (id: string, type: CollectionTableType) => {
    setDeleteId(id);
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    if (deleteType === COLLECTION_TABLE_TYPE.COLLECTIONS) {
      await axiosClient.delete(API.collection.delete(deleteId));
      setCollections((prev) => prev.filter((item) => item.id !== deleteId));
    }

    if (deleteType === COLLECTION_TABLE_TYPE.CONTENTS && selectedCollection) {
      setContentsMap((prev) => ({
        ...prev,
        [selectedCollection.id]: (
          prev[selectedCollection.id] ?? selectedCollectionContents
        ).filter((item) => item.id !== deleteId),
      }));
    }

    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
  };

  return {
    showDeleteConfirm,
    setShowDeleteConfirm,
    showDeleteSuccess,
    setShowDeleteSuccess,
    openDelete,
    handleConfirmDelete,
  };
};
