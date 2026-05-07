import { COLLECTION_TABLE_TYPE } from "@/utils/collection";

export type CollectionRow = {
  id: string;
  name: string;
  contentsCount: number;
  createdAt: string;
  actions: string;
};

export type CollectionContentType = "pdf" | "video" | "epub" | "web";

export type CollectionContentRow = {
  id: string;
  name: string;
  visibility: "Hidden" | "Public";
  createdAt: string;
  contentType: CollectionContentType;
  actions: string;
};

export type CollectionTableProps =
  | {
      type: typeof COLLECTION_TABLE_TYPE.COLLECTIONS;
      data: CollectionRow[];
      onRowClick?: (row: CollectionRow) => void;
      onEdit?: (id: string) => void;
      onDelete?: (id: string) => void;
      onMore?: (id: string) => void;
      onMoveUp?: (id: string) => void;
      onMoveDown?: (id: string) => void;
      onSettings?: (id: string) => void;
    }
  | {
      type: typeof COLLECTION_TABLE_TYPE.CONTENTS;
      data: CollectionContentRow[];
      onEdit?: (id: string) => void;
      onDelete?: (id: string) => void;
      onMore?: (id: string) => void;
      onMoveUp?: (id: string) => void;
      onMoveDown?: (id: string) => void;
      onSettings?: (id: string) => void;
    };

export function isCollectionContentRow(
  row: CollectionRow | CollectionContentRow,
): row is CollectionContentRow {
  return "contentType" in row;
}
