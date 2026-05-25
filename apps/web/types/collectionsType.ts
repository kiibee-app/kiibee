import { COLLECTION_TABLE_TYPE } from "@/utils/collection";
import {
  COUPON_DISCOUNT_FIXED_AMOUNT,
  CouponDiscountType,
} from "@/utils/common";
import type { ContentType } from "@/utils/content";
import type {
  CollectionAccessType,
  CollectionVisibility,
  CollectionContentVisibilityType,
} from "@/utils/Constants";

export type CollectionRow = {
  id: string;
  name: string;
  contentsCount: number;
  createdAt: string;
  actions: string;
  accessType?: CollectionAccessType;
  description?: string;
  coverImageUrl?: string;
  visibility?: CollectionVisibility;
  isPublished?: boolean;
};

export type CollectionContentType = ContentType;

export type CollectionContentRow = {
  id: string;
  name: string;
  description?: string;
  visibility: CollectionContentVisibilityType;
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
      onRowClick?: (row: CollectionContentRow) => void;
      onEdit?: (id: string) => void;
      onDelete?: (id: string) => void;
      onMore?: (id: string) => void;
      onMoveUp?: (id: string) => void;
      onMoveDown?: (id: string) => void;
      onOther?: (id: string) => void;
    };

export function isCollectionContentRow(
  row: CollectionRow | CollectionContentRow,
): row is CollectionContentRow {
  return "contentType" in row;
}

export type CouponFormState = {
  title: string;
  discountType: CouponDiscountType;
  discountValue: string;
  codes: string;
  collection: string;
  content: string;
};

export const INITIAL_COUPON_FORM: CouponFormState = {
  title: "",
  discountType: COUPON_DISCOUNT_FIXED_AMOUNT,
  discountValue: "",
  codes: "",
  collection: "",
  content: "",
};
