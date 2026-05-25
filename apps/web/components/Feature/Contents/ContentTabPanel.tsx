"use client";

import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  ADD_CONTENT_TABS,
  APPEARANCE,
  COLLECTIONS,
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

import COLORS from "@repo/ui/colors";
import { FolderIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import GeneralContent from "./General";
import DeleteModals from "./CollectionDeleteModal";
import { useRouter } from "next/navigation";
import { pathPublishedContent } from "@/utils/path";
import MetaData from "./MetaData";
import MoveContentModal from "./Collections/MoveContentModal";
import { useCouponActions } from "@/hooks/contents/useCouponActions";
import { useContentMoveActions } from "@/hooks/contents/useContentMoveActions";
import Payment from "./Payment";

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
  uploadedFileSnapshot?: {
    name: string;
    size: number;
    type: string;
  } | null;
  generalContentId?: string | null;
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
  uploadedFileSnapshot,
  generalContentId,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    couponRows,
    handleCouponAction,
    handleCouponDeleteConfirm,
    handleCouponDeleteModalClose,
    showCouponDeleteConfirm,
    setShowCouponDeleteConfirm,
    showCouponDeleteSuccess,
    setShowCouponDeleteSuccess,
  } = useCouponActions({
    activeTab,
    onEditCoupon,
  });

  const {
    handleMoveUp,
    handleMoveDown,
    handleConfirmMoveContent,
    openMoveModal,
    resetMoveSelection,
    showMoveContentModal,
    setShowMoveContentModal,
    showMoveSuccessModal,
    setShowMoveSuccessModal,
  } = useContentMoveActions({
    selectedCollection,
    collectionContents,
    setContentsMap,
    setCollections,
  });

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
        <>
          <CollectionTable
            type={COLLECTION_TABLE_TYPE.CONTENTS}
            data={data}
            onRowClick={(row) => router.push(pathPublishedContent(row.id))}
            onEdit={onEditContent}
            onDelete={(id) => onDelete(id, COLLECTION_TABLE_TYPE.CONTENTS)}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onMore={openMoveModal}
          />
          <MoveContentModal
            showMoveModal={showMoveContentModal}
            setShowMoveModal={setShowMoveContentModal}
            showSuccessModal={showMoveSuccessModal}
            setShowSuccessModal={setShowMoveSuccessModal}
            collections={collections}
            onConfirmMove={handleConfirmMoveContent}
            onConfirmClose={resetMoveSelection}
            onSuccessClose={resetMoveSelection}
          />
        </>
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
          onConfirmClose={handleCouponDeleteModalClose}
        />
      </>
    );
  if (activeTab === COLLECTIONS) return renderCollectionsContent();
  if (activeTab === ADD_CONTENT_TABS.GENERAL) {
    return (
      <GeneralContent
        uploadedFile={uploadedFile}
        uploadedPreview={uploadedPreview}
        uploadedFileSnapshot={uploadedFileSnapshot}
        contentId={generalContentId}
      />
    );
  }
  if (activeTab === ADD_CONTENT_TABS.METADATA) return <MetaData />;
  if (activeTab === ADD_CONTENT_TABS.PAYMENT) return <Payment />;
  return <PlaceholderLine>{renderPlaceholder()}</PlaceholderLine>;
}
