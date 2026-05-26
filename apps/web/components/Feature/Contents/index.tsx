"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import ConfirmationModal from "@/components/UI/ConfirmationModal";
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
import { APPEARANCE } from "@/utils/common";
import {
  CONTENT_MODAL_KEY_FALLBACK,
  CONTENT_UPLOAD_MODE,
} from "@/utils/content";
import { ContentFormProvider, useContentForm } from "./ContentFormContext";
import { AppearanceFormProvider } from "./Appearance/AppearanceFormContext";
import { useContentFormActions } from "@/hooks/contents/useContentFormActions";
import { UI_TITLE_FALLBACK } from "@/utils/Constants";

function CreatorsContentsInner() {
  const { t } = useTranslation();
  const { formState } = useContentForm();
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
    resetAfterRefetch,
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
    openCouponEdit,
  } = useContentsModalFlows(
    activeTab,
    collections,
    isCollectionContentMode,
    setCollections,
    resetAfterRefetch,
  );

  const {
    uploadedFile,
    uploadedPreview,
    editingContent,
    showSaveSuccessModal,
    setShowSaveSuccessModal,
    collectionAccessType,
    setCollectionAccessType,
    collectionPasswords,
    setCollectionPasswords,
    hasUnsavedChanges,
    handleUploadSuccess,
    handleBackToBase,
    handleHeaderSave,
    handleHeaderCancel,
    handleEditContent,
    closeContentUpload,
    handleContentUploadBack,
  } = useContentFormActions({
    activeTab,
    isUploadMode,
    selectedCollection,
    setSelectedCollection,
    setCollections,
    collectionContents,
    setActiveTabAndQuery,
    openDiscardModal,
    createCollectionFlow,
    contentTypeFlow,
  });

  const handleSaveSuccessClose = () => {
    setShowSaveSuccessModal(false);
    if (activeTab !== APPEARANCE) {
      handleBackToBase();
    }
  };

  return (
    <PageShell>
      <PageHeader>
        <HeaderRow>
          {(selectedCollection || isUploadMode) && (
            <AuthBackButton marginBottom="0px" onClick={handleBackToBase} />
          )}
          <Title>
            {isUploadMode
              ? formState.title || UI_TITLE_FALLBACK
              : selectedCollection
                ? selectedCollection.name
                : t(CONTENTS_KEYS.title)}
          </Title>
        </HeaderRow>

        <ContentsHeaderAction
          activeTab={activeTab}
          onCreate={handleCreateClick}
          onCancel={handleHeaderCancel}
          onCreateCoupon={couponFlow.open}
          onSave={handleHeaderSave}
          isSaveDisabled={activeTab === APPEARANCE && !hasUnsavedChanges}
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
            onEditContent={handleEditContent}
            onEditCoupon={openCouponEdit}
            uploadedFile={uploadedFile}
            uploadedPreview={uploadedPreview}
            collectionAccessType={collectionAccessType}
            setCollectionAccessType={setCollectionAccessType}
            collectionPasswords={collectionPasswords}
            setCollectionPasswords={setCollectionPasswords}
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
        key={
          editingContent?.id ??
          contentTypeFlow.selectedContentType ??
          CONTENT_MODAL_KEY_FALLBACK
        }
        visible={contentTypeFlow.showContentUploadModal}
        mode={
          editingContent ? CONTENT_UPLOAD_MODE.EDIT : CONTENT_UPLOAD_MODE.CREATE
        }
        contentId={editingContent?.id}
        initialTitle={editingContent?.name}
        initialDescription={editingContent?.description}
        contentType={
          editingContent?.contentType ?? contentTypeFlow.selectedContentType
        }
        collectionId={selectedCollection?.id ?? null}
        onClose={closeContentUpload}
        onBack={handleContentUploadBack}
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

      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={closeDiscardModal}
        title={t("settings.notifications.discardModal.title")}
        body={t("settings.notifications.discardModal.message")}
        cancelLabel={t("settings.notifications.discardModal.goBack")}
        confirmLabel={t("settings.notifications.discardModal.discard")}
        onConfirm={() => {
          if (isUploadMode) {
            handleBackToBase();
          }
          closeDiscardModal();
        }}
        size="sm"
        spacing="md"
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />

      <GenericModal
        visible={showSaveSuccessModal}
        icon={<SuccessModalIcon />}
        iconMargin="0 auto 8px"
        title={t("settings.notifications.successModal.title")}
        message={t("settings.notifications.successModal.message")}
        confirmLabel={t("settings.notifications.successModal.done")}
        onClose={handleSaveSuccessClose}
        onConfirm={handleSaveSuccessClose}
        size="sm"
        spacing="xs"
        showCloseButton={false}
      />

      <CouponFlowModals
        collections={collections}
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

export default function CreatorsContents() {
  return (
    <ContentFormProvider>
      <AppearanceFormProvider>
        <CreatorsContentsInner />
      </AppearanceFormProvider>
    </ContentFormProvider>
  );
}
