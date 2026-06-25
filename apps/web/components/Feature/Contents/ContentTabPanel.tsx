"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ADD_CONTENT_TABS,
  APPEARANCE,
  COLLECTIONS,
  CONTENT_TABS,
  COUPONS,
  ContentTab,
  SETTINGS,
  AccessDurationValue,
} from "@/utils/common";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import { AdmissionRequirementValue } from "@/utils/admissionRequirements";
import AppearanceContent from "./Appearance";
import AdmissionRequirements from "./AdmissionRequirements";
import CouponTable from "./coupon";
import CollectionTable from "./Collections";
import { COLLECTION_TABLE_TYPE, CollectionTableType } from "@/utils/collection";
import { CollectionContentRow, CollectionRow } from "@/types/collectionsType";
import { PlaceholderLine } from "./styles";
import GenericEmptyState from "@/components/UI/GenericEmptyState";
import { MonoText } from "@/components/UI/Monotext";
import GeneralContent from "./General";
import DeleteModals from "./CollectionDeleteModal";
import AuthBackButton from "../Auth/AuthBackButton";
import { useRouter } from "next/navigation";
import { pathPublishedContent } from "@/utils/path";
import MetaData from "./MetaData";
import MoveContentModal from "./Collections/MoveContentModal";
import { useCouponActions } from "@/hooks/contents/useCouponActions";
import { useContentMoveActions } from "@/hooks/contents/useContentMoveActions";
import Payment from "./Payment";
import { CouponEntity, CreateCouponPayload } from "@/types/couponType";
import CouponPreviewModal from "./coupon/CouponPreviewModal";
import { COUPON_MODE } from "@/utils/content";

type Props = {
  activeTab: ContentTab;
  selectedCollection: CollectionRow | null;
  collectionContents: CollectionContentRow[];
  collections: CollectionRow[];
  editingContentId?: string | null;
  setCollections: Dispatch<SetStateAction<CollectionRow[]>>;
  setSelectedCollection: (collection: CollectionRow) => void;
  onDelete: (id: string, type: CollectionTableType) => void;
  onEditCollection: (id: string) => void;
  onEditContent: (id: string) => void;
  onEditCoupon: (couponId: string, formState: CreateCouponPayload) => void;
  setContentsMap: Dispatch<
    SetStateAction<Record<string, CollectionContentRow[]>>
  >;
  setActiveTab: (tab: ContentTab) => void;
  searchValue?: string;
  uploadedFile?: File | null;
  uploadedPreview?: string | null;
  collectionAccessType?: AdmissionRequirementValue;
  setCollectionAccessType?: (value: AdmissionRequirementValue) => void;
  collectionPasswords?: string;
  setCollectionPasswords?: (value: string) => void;
  collectionDescription?: string;
  setCollectionDescription?: (value: string) => void;
  collectionRentalAmount?: string;
  setCollectionRentalAmount?: (value: string) => void;
  collectionPurchaseAmount?: string;
  setCollectionPurchaseAmount?: (value: string) => void;
  collectionAccessDuration?: AccessDurationValue;
  setCollectionAccessDuration?: (value: AccessDurationValue) => void;
  onPasswordValidationChange?: (hasError: boolean) => void;
  onBack?: () => void;
};

export default function ContentTabPanel({
  activeTab,
  selectedCollection,
  collectionContents,
  collections,
  editingContentId,
  setCollections,
  setSelectedCollection,
  onDelete,
  onEditCollection,
  onEditContent,
  onEditCoupon,
  setContentsMap,
  setActiveTab,
  searchValue,
  uploadedFile,
  uploadedPreview,
  collectionAccessType,
  setCollectionAccessType,
  collectionPasswords,
  setCollectionPasswords,
  collectionDescription,
  setCollectionDescription,
  collectionRentalAmount,
  setCollectionRentalAmount,
  collectionPurchaseAmount,
  setCollectionPurchaseAmount,
  collectionAccessDuration,
  setCollectionAccessDuration,
  onPasswordValidationChange,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedCoupon, setSelectedCoupon] = useState<CouponEntity | null>(
    null,
  );

  const [showCouponModal, setShowCouponModal] = useState(false);
  const {
    couponRows,
    couponList,
    handleCouponAction,
    handleCouponDeleteConfirm,
    handleCouponDeleteModalClose,
    showCouponDeleteConfirm,
    setShowCouponDeleteConfirm,
    showCouponDeleteSuccess,
    setShowCouponDeleteSuccess,
    openEditCoupon,
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

  const filteredCollectionContents = useMemo(() => {
    const query = searchValue?.trim().toLowerCase();

    if (!selectedCollection || !query) {
      return collectionContents;
    }

    return collectionContents.filter((row) =>
      (row.name ?? "").toLowerCase().includes(query),
    );
  }, [collectionContents, searchValue, selectedCollection]);

  const renderCollectionsContent = () => {
    if (selectedCollection) {
      const data = filteredCollectionContents;

      if (!data || data.length === 0) {
        return (
          <>
            {onBack && <AuthBackButton marginBottom="0px" onClick={onBack} />}
            <GenericEmptyState
              title={t("contents.emptyCollection.title")}
              description={t("contents.emptyCollection.description")}
            />
          </>
        );
      }

      return (
        <>
          <CollectionTable
            type={COLLECTION_TABLE_TYPE.CONTENTS}
            data={data}
            searchValue={searchValue}
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

    if (collections.length === 0) {
      return (
        <GenericEmptyState
          title={t("contents.emptyCollection.title")}
          description={t("contents.emptyCollection.description")}
        />
      );
    }

    return (
      <CollectionTable
        type={COLLECTION_TABLE_TYPE.COLLECTIONS}
        data={collections}
        searchValue={searchValue}
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
  if (activeTab === SETTINGS) {
    return (
      <AdmissionRequirements
        accessType={collectionAccessType}
        onChangeAccessType={setCollectionAccessType}
        passwords={collectionPasswords}
        onChangePasswords={setCollectionPasswords}
        description={collectionDescription}
        onChangeDescription={setCollectionDescription}
        rentalAmount={collectionRentalAmount}
        onChangeRentalAmount={setCollectionRentalAmount}
        purchaseAmount={collectionPurchaseAmount}
        onChangePurchaseAmount={setCollectionPurchaseAmount}
        accessDuration={collectionAccessDuration}
        onChangeAccessDuration={setCollectionAccessDuration}
        showDescription={Boolean(selectedCollection)}
        showPaymentOption={Boolean(selectedCollection)}
        onValidationChange={onPasswordValidationChange}
      />
    );
  }
  if (activeTab === COUPONS)
    return (
      <>
        <CouponTable
          data={couponRows}
          searchValue={searchValue}
          onActionSelect={handleCouponAction}
          onRowClick={(row) => {
            const fullCoupon = couponList.find((c) => c.id === row.action);
            if (!fullCoupon) return;
            setSelectedCoupon(fullCoupon);
            setShowCouponModal(true);
          }}
        />
        {showCouponModal && selectedCoupon && (
          <CouponPreviewModal
            visible={showCouponModal}
            data={selectedCoupon}
            collections={collections}
            mode={COUPON_MODE.DETAILS}
            onClose={() => {
              setShowCouponModal(false);
              setSelectedCoupon(null);
            }}
            onEdit={() => {
              if (!selectedCoupon) return;
              setShowCouponModal(false);
              openEditCoupon(selectedCoupon);
              setSelectedCoupon(null);
            }}
          />
        )}

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
        id={editingContentId ?? ""}
        uploadedFile={uploadedFile}
        uploadedPreview={uploadedPreview}
        onDelete={(id) => onDelete(id, COLLECTION_TABLE_TYPE.CONTENTS)}
      />
    );
  }
  if (activeTab === ADD_CONTENT_TABS.METADATA) return <MetaData />;
  if (activeTab === ADD_CONTENT_TABS.PAYMENT) return <Payment />;
  return <PlaceholderLine>{renderPlaceholder()}</PlaceholderLine>;
}
