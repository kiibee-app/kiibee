"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import COLORS from "@repo/ui/colors";
import {
  ContentPanel,
  HeaderRow,
  PageHeader,
  PageShell,
  Title,
} from "./styles";
import { SuccessArcIcon } from "@/assets/icons";
import ContentsHeaderAction from "./ContentsHeaderAction";
import GenericTabs from "@/components/UI/GenericTabs";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import AuthBackButton from "../Auth/AuthBackButton";
import DeleteModals from "./CollectionDeleteMobal";
import CreateCollectionModal from "./Collections/CreateCollectionModal";
import ContentTabPanel from "./ContentTabPanel";
import CouponFlowModals from "./coupon/CouponFlowModals";
import ContentTypeModal from "./ContentTypeModal";
import ContentUploadModal from "./ContentUploadModal";
import { useContentsViewState } from "@/hooks/contents/useContentsViewState";
import { useContentsDataState } from "@/hooks/contents/useContentsDataState";
import { useContentsModalFlows } from "@/hooks/contents/useContentsModalFlows";

export default function CreatorsContents() {
  const { t } = useTranslation();

  const {
    activeTab,
    visibleTabs,
    getTabLabelKey,
    selectedCollection,
    setSelectedCollection,
    isCollectionContentMode,
    searchValue,
    setSearchValue,
    openSearch,
    setOpenSearch,
    handleTabChange,
  } = useContentsViewState();
  const {
    collections,
    setCollections,
    collectionContents,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showDeleteSuccess,
    setShowDeleteSuccess,
    openDelete,
    handleConfirmDelete,
  } = useContentsDataState(selectedCollection);
  const {
    createCollectionFlow,
    contentTypeFlow,
    couponForm,
    setCouponForm,
    isCouponSuccess,
    couponFlow,
    closeCouponFlow,
    handleBackFromCouponPreview,
    handleCouponSubmit,
    showDiscardModal,
    openDiscardModal,
    closeDiscardModal,
    handleCreateClick,
    handleEditCollection,
  } = useContentsModalFlows(activeTab, collections, isCollectionContentMode);

  return (
    <PageShell>
      <PageHeader>
        <HeaderRow>
          {selectedCollection && (
            <AuthBackButton
              marginBottom="0px"
              onClick={() => setSelectedCollection(null)}
            />
          )}
          <Title>
            {selectedCollection
              ? selectedCollection.name
              : t(CONTENTS_KEYS.title)}
          </Title>
        </HeaderRow>

        <ContentsHeaderAction
          activeTab={activeTab}
          onCreate={handleCreateClick}
          onCancel={openDiscardModal}
          onCreateCoupon={couponFlow.open}
          onSave={createCollectionFlow.openSuccess}
          isCollectionContentMode={isCollectionContentMode}
        />
      </PageHeader>

      <GenericTabs
        tabs={visibleTabs.map((tab) => ({
          key: tab.key,
          label: t(getTabLabelKey(tab)),
        }))}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={{
          open: openSearch,
          value: searchValue,
          placeholder: t(CONTENTS_KEYS.actions.search),
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: setSearchValue,
          ariaLabel: t(CONTENTS_KEYS.actions.search),
        }}
      />

      <ContentPanel>
        <ContentTabPanel
          activeTab={activeTab}
          selectedCollection={selectedCollection}
          collectionContents={collectionContents}
          collections={collections}
          setCollections={setCollections}
          setSelectedCollection={setSelectedCollection}
          onDelete={openDelete}
          onEditCollection={handleEditCollection}
        />
      </ContentPanel>

      <CreateCollectionModal
        visible={createCollectionFlow.showCreateModal}
        collectionName={createCollectionFlow.collectionName}
        onChangeCollectionName={createCollectionFlow.setCollectionName}
        onClose={createCollectionFlow.closeCreate}
        onConfirm={createCollectionFlow.completeCreate}
      />

      <ContentTypeModal
        visible={contentTypeFlow.showContentTypeModal}
        onClose={contentTypeFlow.close}
        onBack={contentTypeFlow.close}
        onContinue={contentTypeFlow.continueWithType}
      />

      <ContentUploadModal
        visible={contentTypeFlow.showContentUploadModal}
        contentType={contentTypeFlow.selectedContentType}
        onClose={contentTypeFlow.close}
        onBack={contentTypeFlow.backToTypeSelect}
      />

      <GenericModal
        visible={createCollectionFlow.showSuccessModal}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        iconMargin="0 auto 8px"
        title={t("contents.createCollectionSuccessModal.title")}
        message={t("contents.createCollectionSuccessModal.message")}
        confirmLabel={t("contents.createCollectionSuccessModal.done")}
        onClose={createCollectionFlow.closeSuccess}
        onConfirm={createCollectionFlow.closeSuccess}
        size="sm"
        spacing="xs"
        showCloseButton={false}
      />

      <GenericModal
        visible={showDiscardModal}
        title={t("settings.notifications.discardModal.title")}
        message={t("settings.notifications.discardModal.message")}
        cancelLabel={t("settings.notifications.discardModal.goBack")}
        confirmLabel={t("settings.notifications.discardModal.discard")}
        onCancel={closeDiscardModal}
        onClose={closeDiscardModal}
        onConfirm={closeDiscardModal}
        size="sm"
        spacing="md"
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />

      <CouponFlowModals
        couponFlow={couponFlow}
        couponForm={couponForm}
        setCouponForm={setCouponForm}
        closeCouponFlow={closeCouponFlow}
        handleBackFromCouponPreview={handleBackFromCouponPreview}
        handleCouponSubmit={handleCouponSubmit}
        isCouponSuccess={isCouponSuccess}
      />

      <DeleteModals
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        showDeleteSuccess={showDeleteSuccess}
        setShowDeleteSuccess={setShowDeleteSuccess}
        onConfirmDelete={handleConfirmDelete}
      />
    </PageShell>
  );
}
