"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ADD_CONTENT_TABS,
  APPEARANCE,
  COLLECTIONS,
  COUPON_DISCOUNT_TYPE,
  CONTENT_TABS,
  COUPONS,
  ContentTab,
  SETTINGS,
} from "@/utils/common";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import AppearanceContent from "./Appearance";
import AdmissionRequirements from "./AdmissionRequirements";
import CouponTable from "./coupon";
import CollectionTable from "./Collections";
import { COLLECTION_TABLE_TYPE, CollectionTableType } from "@/utils/collection";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import { CouponFormState } from "@/types/collectionsType";
import {
  EmptyCollectionCard,
  EmptyCollectionText,
  EmptyCollectionTitle,
  PlaceholderLine,
} from "./styles";
import {
  MOVE_DIRECTION_DOWN,
  MOVE_DIRECTION_UP,
  moveItemInArray,
} from "@/utils/sortOptions";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { formatDateUSShort } from "@/utils/formatDate";
import {
  COUPON_STATUS,
  COUPON_STATUS_LABEL_MAP,
  type CouponEntity,
  type CouponListResponse,
  type CouponRow,
} from "@/types/couponType";

import COLORS from "@repo/ui/colors";
import { FolderIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import GeneralContent from "./General";
import DeleteModals from "./CollectionDeleteModal";
import {
  COUPON_ACTION_DELETE,
  COUPON_ACTION_EDIT,
  COUPON_ACTION_STATUS,
  CouponAction,
} from "@/utils/Constants";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { pathPublishedContent } from "@/utils/path";
import MetaData from "./MetaData";
import { useRouter } from "next/navigation";
import { pathPublishedContent } from "@/utils/path";

type Props = {
  activeTab: ContentTab;
  selectedCollection: CollectionRow | null;
  collectionContents: CollectionContentRow[];
  collections: CollectionRow[];
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>;
  setSelectedCollection: (collection: CollectionRow) => void;
  onDelete: (id: string, type: CollectionTableType) => void;
  onEditCollection: (id: string) => void;
  onEditContent: (id: string) => void;
  onEditCoupon: (couponId: string, formState: CouponFormState) => void;
  setContentsMap: Dispatch<
    SetStateAction<Record<string, CollectionContentRow[]>>
  >;
  setActiveTab: (tab: ContentTab) => void;
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
};

export default function ContentTabPanel({
  activeTab,
  selectedCollection,
  collectionContents,
  collections,
  setCollections,
  setSelectedCollection,
  onDelete,
  onEditCollection,
  onEditContent,
  onEditCoupon,
  setContentsMap,
  setActiveTab,
  uploadedFile,
  uploadedPreview,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCouponDeleteConfirm, setShowCouponDeleteConfirm] = useState(false);
  const [showCouponDeleteSuccess, setShowCouponDeleteSuccess] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  const handleCouponDeleteConfirm = async () => {
    if (!selectedCouponId) return;
    await axiosClient.delete(API.coupon.delete(selectedCouponId));
    await queryClient.invalidateQueries({ queryKey: [API.coupon.getAll] });
    setShowCouponDeleteConfirm(false);
    setSelectedCouponId(null);
    setShowCouponDeleteSuccess(true);
  };
  const { data: couponResponse } = useGetAPI<CouponListResponse>(
    API.coupon.getAll,
    undefined,
    {
      enabled: activeTab === COUPONS,
    },
  );

  const getCouponStatusLabel = (status: CouponEntity["status"]) =>
    COUPON_STATUS_LABEL_MAP[status];

  const couponRows: CouponRow[] = (couponResponse?.data ?? []).map((item) => ({
    title: item.title,
    codes: item.codes ?? [],
    status: getCouponStatusLabel(item.status),
    createdAt: formatDateUSShort(item.createdAt),
    action: item.id,
  }));

  const handleCouponAction = async (action: CouponAction, row: CouponRow) => {
    const couponId = row.action;
    if (!couponId) return;

    const coupons = couponResponse?.data ?? [];
    const selectedCoupon = coupons.find((item) => item.id === couponId);

    const openEdit = () => {
      if (!selectedCoupon) return;

      onEditCoupon(selectedCoupon.id, {
        title: selectedCoupon.title ?? "",
        discountType:
          selectedCoupon.discountType ?? COUPON_DISCOUNT_TYPE.FIXED_AMOUNT,
        discountValue: selectedCoupon.discountValue ?? "",
        codes: (selectedCoupon.codes ?? []).join(", "),
        collection: selectedCoupon.applicableProducts?.collectionId ?? "",
        content: selectedCoupon.applicableProducts?.contentId ?? "",
      });
    };

    const openDelete = () => {
      setSelectedCouponId(couponId);
      setShowCouponDeleteConfirm(true);
    };

    const toggleStatus = async () => {
      const nextStatus =
        row.status === COUPON_STATUS.ACTIVE
          ? COUPON_STATUS.INACTIVE.toLowerCase()
          : COUPON_STATUS.ACTIVE.toLowerCase();

      await axiosClient.patch(API.coupon.update(couponId), {
        status: nextStatus,
      });

      await queryClient.invalidateQueries({
        queryKey: [API.coupon.getAll],
      });
    };

    const actionMap: Record<CouponAction, () => Promise<void> | void> = {
      [COUPON_ACTION_EDIT]: openEdit,
      [COUPON_ACTION_DELETE]: openDelete,
      [COUPON_ACTION_STATUS]: toggleStatus,
    };

    return actionMap[action]?.();
  };

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

  const renderCollectionsContent = () => {
    if (selectedCollection) {
      const data = collectionContents;

      if (!data || data.length === 0) {
        return (
          <EmptyCollectionCard>
            <FolderIcon
              width={54}
              height={42}
              color={COLORS.neutral.GRAY_400}
            />
            <EmptyCollectionText>
              <EmptyCollectionTitle>
                {t("contents.emptyCollection.title")}
              </EmptyCollectionTitle>
              <MonoText $use="Body_Medium">
                {t("contents.emptyCollection.description")}
              </MonoText>
            </EmptyCollectionText>
          </EmptyCollectionCard>
        );
      }

      return (
        <CollectionTable
          type={COLLECTION_TABLE_TYPE.CONTENTS}
          data={data}
          onRowClick={(row) => router.push(pathPublishedContent(row.id))}
          onEdit={onEditContent}
          onDelete={(id) => onDelete(id, COLLECTION_TABLE_TYPE.CONTENTS)}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      );
    }

    return (
      <CollectionTable
        type={COLLECTION_TABLE_TYPE.COLLECTIONS}
        data={collections}
        onRowClick={setSelectedCollection}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onDelete={(id) => onDelete(id, COLLECTION_TABLE_TYPE.COLLECTIONS)}
        onEdit={onEditCollection}
        onSettings={() => setActiveTab(SETTINGS)}
      />
    );
  };

  const renderPlaceholder = () => {
    const activeItem = CONTENT_TABS.find((tab) => tab.key === activeTab);
    if (activeItem?.descriptionKey) return t(activeItem.descriptionKey);
    return activeItem?.description ?? t(CONTENTS_KEYS.placeholders.collections);
  };

  if (activeTab === APPEARANCE) return <AppearanceContent />;
  if (activeTab === SETTINGS) return <AdmissionRequirements />;
  if (activeTab === COUPONS)
    return (
      <>
        <CouponTable data={couponRows} onActionSelect={handleCouponAction} />
        <DeleteModals
          showDeleteConfirm={showCouponDeleteConfirm}
          setShowDeleteConfirm={setShowCouponDeleteConfirm}
          showDeleteSuccess={showCouponDeleteSuccess}
          setShowDeleteSuccess={setShowCouponDeleteSuccess}
          onConfirmDelete={handleCouponDeleteConfirm}
          title={t("contents.couponDeleteModal.title")}
          message={t("contents.couponDeleteModal.message")}
          onConfirmClose={() => setSelectedCouponId(null)}
        />
      </>
    );
  if (activeTab === COLLECTIONS) return renderCollectionsContent();
  if (activeTab === ADD_CONTENT_TABS.GENERAL) {
    return (
      <GeneralContent
        uploadedFile={uploadedFile}
        uploadedPreview={uploadedPreview}
      />
    );
  }
  if (activeTab === ADD_CONTENT_TABS.METADATA) return <MetaData />;
  return <PlaceholderLine>{renderPlaceholder()}</PlaceholderLine>;
}
