"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import {
  ContentPanel,
  ContentsScrollArea,
  ContentsTabsSlot,
  HeaderRow,
  PageHeader,
  PageShell,
  Title,
} from "./styles";
import ContentsHeaderAction from "./ContentsHeaderAction";
import GenericTabs from "@/components/UI/GenericTabs";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import AuthBackButton from "../Auth/AuthBackButton";
import CreateCollectionModal from "./Collections/CreateCollectionModal";
import ContentTabPanel from "./ContentTabPanel";
import CouponFlowModals from "./coupon/CouponFlowModals";
import ContentTypeModal from "./ContentTypeModal";
import ContentUploadModal from "./ContentUploadModal";
import { useContentsViewState } from "@/hooks/contents/useContentsViewState";
import { useContentsDataState } from "@/hooks/contents/useContentsDataState";
import { useContentsModalFlows } from "@/hooks/contents/useContentsModalFlows";
import DeleteModals from "./CollectionDeleteModal";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { AddContentTab, COLLECTIONS } from "@/utils/common";

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
    setActiveTabAndQuery,
    isUploadMode,
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
    setContentsMap,
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

  const handleUploadSuccess = (tab: AddContentTab) => {
    setActiveTabAndQuery(tab);
  };

  const handleBackToBase = () => {
    setSelectedCollection(null);
    setSelectedCollection(selectedCollection);
    setActiveTabAndQuery(COLLECTIONS);
  };

  return (
    <PageShell>
      <PageHeader>
        <HeaderRow>
          {selectedCollection && (
            <AuthBackButton marginBottom="0px" onClick={handleBackToBase} />
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

      <ContentsScrollArea data-lenis-prevent="">
        <ContentsTabsSlot>
          <GenericTabs
            tabs={visibleTabs.map((tab) => ({
              key: tab.key,
              label: t(getTabLabelKey(tab)),
            }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            search={
              isUploadMode
                ? undefined
                : {
                    open: openSearch,
                    value: searchValue,
                    placeholder: t(CONTENTS_KEYS.actions.search),
                    onToggle: () => setOpenSearch((prev) => !prev),
                    onChange: setSearchValue,
                    ariaLabel: t(CONTENTS_KEYS.actions.search),
                  }
            }
          />
        </ContentsTabsSlot>
        <ContentPanel>
          <ContentTabPanel
            activeTab={activeTab}
            selectedCollection={selectedCollection}
            collectionContents={collectionContents}
            collections={collections}
            setCollections={setCollections}
            setContentsMap={setContentsMap}
            setActiveTab={setActiveTabAndQuery}
            setSelectedCollection={setSelectedCollection}
            onDelete={openDelete}
            onEditCollection={handleEditCollection}
          />
        </ContentPanel>
      </ContentsScrollArea>

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
        onUploadSuccess={handleUploadSuccess}
      />

      <GenericModal
        visible={createCollectionFlow.showSuccessModal}
        icon={<SuccessModalIcon />}
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
