"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
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
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { CouponListResponse } from "@/types/couponType";
import { findElement } from "@/utils/searchHelper";
import { useContentsDataState } from "@/hooks/contents/useContentsDataState";
import { useContentsModalFlows } from "@/hooks/contents/useContentsModalFlows";
import DeleteModals from "./CollectionDeleteModal";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { ADD_CONTENT_TABS, APPEARANCE, SETTINGS } from "@/utils/common";
import { ADMISSION_REQUIREMENTS } from "@/utils/admissionRequirements";
import {
  CONTENT_MODAL_KEY_FALLBACK,
  CONTENT_UPLOAD_MODE,
} from "@/utils/content";
import { ContentFormProvider, useContentForm } from "./ContentFormContext";
import { AppearanceFormProvider } from "./Appearance/AppearanceFormContext";
import { useContentFormActions } from "@/hooks/contents/useContentFormActions";
import { useContentsUrlState } from "@/hooks/contents/useContentsUrlState";
import { useContentSettings } from "@/hooks/contents/useContentSettings";
import { useAutoMatchedQuery } from "@/hooks/useAutoMatchedQuery";
import {
  SCROLL_OPTIONS,
  UI_TITLE_FALLBACK,
  CONTENT_ITEM_QUERY_KEY,
} from "@/utils/Constants";
import { COUPONS } from "@/utils/common";

function ContentsUploadTitle({ fallback }: { fallback: string }) {
  const { formState } = useContentForm();
  return <>{formState.title || fallback}</>;
}

function CreatorsContentsInner() {
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

  const needsCouponSearchData =
    searchValue.trim().length >= 2 || activeTab === COUPONS;

  const { data: couponResponse } = useGetAPI<CouponListResponse>(
    API.coupon.getAll,
    undefined,
    {
      enabled: needsCouponSearchData,
    },
  );

  const CONTENTS_TABS_INDEX = useMemo(() => {
    const colNames = collections.map((c) => c.name);
    const contentNames = collectionContents.map((c) => c.name);
    const collectionsKeywords = [
      t("contents.tabs.collections"),
      t("contents.tabs.contents"),
      t(CONTENTS_KEYS.title),
      t("contents.actions.search"),
      t("contents.actions.createCollection"),
      t("contents.actions.createCoupon"),
      t("contents.actions.deleteContent"),
      t("contents.actions.addContent"),
      t("contents.emptyCollection.title"),
      t("contents.emptyCollection.description"),
      ...colNames,
      ...contentNames,
    ];

    const appearanceKeywords = [
      t("contents.tabs.appearance"),
      t(CONTENTS_KEYS.appearance.textColor),
      t(CONTENTS_KEYS.appearance.textColorHint),
      t(CONTENTS_KEYS.appearance.buttonColor),
      t(CONTENTS_KEYS.appearance.buttonColorHint),
      t(CONTENTS_KEYS.appearance.logo.title),
      t(CONTENTS_KEYS.appearance.logo.subtitle),
      t(CONTENTS_KEYS.appearance.description.label),
      t(CONTENTS_KEYS.appearance.description.hint),
      t(CONTENTS_KEYS.appearance.layouts.title),
      t(CONTENTS_KEYS.appearance.layouts.subtitle),
      t(CONTENTS_KEYS.appearance.coverImage.title),
      t(CONTENTS_KEYS.appearance.coverImage.subtitle),
      t(CONTENTS_KEYS.appearance.receipt),
      t(CONTENTS_KEYS.appearance.receiptHint),
    ];

    const settingsKeywords = [
      t("contents.tabs.settings"),
      t("contents.admissionRequirements.title"),
      t("contents.admissionRequirements.description"),
      ...ADMISSION_REQUIREMENTS.map((opt) => t(opt.labelKey)),
    ];

    const coupTitles = (couponResponse?.data ?? []).flatMap((item) => [
      item.title || "",
      ...(item.codes ?? []),
    ]);
    const couponsKeywords = [
      t("contents.tabs.coupons"),
      t("contents.couponsCard.title"),
      t("contents.couponsCard.description"),
      t("contents.couponDetails.title"),
      t("contents.couponDetails.fields.title"),
      t("contents.couponDetails.placeholders.title"),
      t("contents.couponDetails.discountValue"),
      t("contents.couponDetails.discountHelp"),
      t("contents.couponDetails.discountType.fixedAmount"),
      t("contents.couponDetails.discountType.percentage"),
      t("contents.couponCodes.title"),
      t("contents.couponCodes.description"),
      t("contents.couponCodes.fields.discountCodes"),
      t("contents.couponCodes.placeholders.codes"),
      t("contents.couponCodes.helper"),
      t("contents.couponApplicableProducts.title"),
      t("contents.couponApplicableProducts.description"),
      ...coupTitles,
    ];

    return [
      {
        tab: "collections",
        keywords: collectionsKeywords.map((k) => k.toLowerCase()),
      },
      {
        tab: "appearance",
        keywords: appearanceKeywords.map((k) => k.toLowerCase()),
      },
      {
        tab: "settings",
        keywords: settingsKeywords.map((k) => k.toLowerCase()),
      },
      {
        tab: "coupons",
        keywords: couponsKeywords.map((k) => k.toLowerCase()),
      },
    ];
  }, [t, collections, collectionContents, couponResponse]);
  const { lastAutoMatchedQueryRef, handleSearchChange } =
    useAutoMatchedQuery(setSearchValue);

  useEffect(() => {
    if (selectedCollection) return;
    if (!searchValue || searchValue.trim().length < 2) return;

    const query = searchValue.trim().toLowerCase();
    const searchChanged = lastAutoMatchedQueryRef.current !== query;

    if (searchChanged) {
      lastAutoMatchedQueryRef.current = query;

      const activeTabKeywords = CONTENTS_TABS_INDEX.find(
        (item) => item.tab === activeTab,
      );
      const activeContainsQuery = activeTabKeywords?.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query),
      );

      if (!activeContainsQuery) {
        const matchedTabItem = CONTENTS_TABS_INDEX.find((item) =>
          item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query),
          ),
        );
        if (!matchedTabItem) return;
        setActiveTabAndQuery(matchedTabItem.tab as typeof activeTab);
      }
    }

    let attempts = 0;
    const interval = setInterval(() => {
      const container = document.getElementById("contents-content-area");
      const element = container ? findElement(container, query) : null;
      if (element) {
        element.scrollIntoView(SCROLL_OPTIONS);
        return clearInterval(interval);
      }
      if (++attempts > 10) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    searchValue,
    activeTab,
    selectedCollection,
    lastAutoMatchedQueryRef,
    setActiveTabAndQuery,
    CONTENTS_TABS_INDEX,
  ]);
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
    requestCloseCouponFlow,
    isCouponDiscardPending,
  } = useContentsModalFlows(
    activeTab,
    collections,
    isCollectionContentMode,
    setCollections,
    resetAfterRefetch,
  );

  const contentSettings = useContentSettings();

  const contentSettingAccessType =
    contentSettings.data?.data?.accessType ?? undefined;

  const {
    uploadedFile,
    uploadedPreview,
    editingContent,
    showSaveSuccessModal,
    setShowSaveSuccessModal,
    isSaving,
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
    hasUnsavedChanges,
    hasGeneralUnsavedChanges,
    hasMetadataUnsavedChanges,
    hasSettingsUnsavedChanges,
    handleUploadSuccess,
    handleBackToBaseStateOnly,
    resetUploadState,
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
    contentSettingAccessType,
    saveContentSetting: contentSettings.updateSetting,
  });

  const [hasPasswordError, setHasPasswordError] = useState(false);

  const searchParams = useSearchParams();
  const queryContentId = searchParams?.get(CONTENT_ITEM_QUERY_KEY);

  const handleCreate = useCallback(() => {
    resetUploadState();
    handleCreateClick();
  }, [handleCreateClick, resetUploadState]);

  const clearSelectedCollectionContentsOverride = useCallback(() => {
    const id = selectedCollection?.id;
    if (!id) return;

    setContentsMap((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [selectedCollection?.id, setContentsMap]);

  const {
    handleBack,
    handleBackToCollection,
    handleEditContent: handleEditContentWithUrl,
    handleSelectCollection,
    syncContentIdToUrl,
    isStartingEditRef,
  } = useContentsUrlState({
    collections,
    selectedCollection,
    setSelectedCollection,
    onEditContent: (id) => void handleEditContent(id),
    onBackStateOnly: handleBackToBaseStateOnly,
    activeTab,
  });

  useEffect(() => {
    if (
      !queryContentId &&
      editingContent !== null &&
      !isStartingEditRef.current
    ) {
      resetUploadState();
    }
  }, [queryContentId, editingContent, resetUploadState, isStartingEditRef]);

  const handleSaveSuccessClose = () => {
    setShowSaveSuccessModal(false);
    if (activeTab !== APPEARANCE) {
      handleBack();
    }
  };

  const handleDeleteSuccessClose = useCallback(() => {
    if (!isUploadMode && !editingContent?.id) return;
    resetUploadState();
    handleBack();
  }, [editingContent?.id, handleBack, isUploadMode, resetUploadState]);

  return (
    <PageShell>
      <PageHeader>
        <HeaderRow>
          {selectedCollection && (
            <AuthBackButton
              marginBottom="0px"
              onClick={isUploadMode ? handleBack : handleBackToCollection}
            />
          )}
          <Title>
            {isUploadMode ? (
              <ContentsUploadTitle fallback={UI_TITLE_FALLBACK} />
            ) : selectedCollection ? (
              selectedCollection.name
            ) : (
              t(CONTENTS_KEYS.title)
            )}
          </Title>
        </HeaderRow>

        <ContentsHeaderAction
          activeTab={activeTab}
          onCreate={handleCreate}
          onCancel={handleHeaderCancel}
          onCreateCoupon={couponFlow.open}
          onSave={handleHeaderSave}
          isSaveDisabled={
            (activeTab === APPEARANCE && !hasUnsavedChanges) ||
            (activeTab === SETTINGS && !hasSettingsUnsavedChanges) ||
            (activeTab === SETTINGS && hasPasswordError) ||
            (activeTab === ADD_CONTENT_TABS.GENERAL &&
              !hasGeneralUnsavedChanges) ||
            (activeTab === ADD_CONTENT_TABS.METADATA &&
              !hasMetadataUnsavedChanges)
          }
          isSaving={isSaving}
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
                    onChange: handleSearchChange,
                    ariaLabel: t(CONTENTS_KEYS.actions.search),
                  }
            }
          />
        </ContentsTabsSlot>
        <ContentPanel id="contents-content-area">
          <ContentTabPanel
            activeTab={activeTab}
            selectedCollection={selectedCollection}
            collectionContents={collectionContents}
            collections={collections}
            searchValue={searchValue}
            editingContentId={editingContent?.id ?? null}
            setCollections={setCollections}
            setContentsMap={setContentsMap}
            setActiveTab={setActiveTabAndQuery}
            setSelectedCollection={handleSelectCollection}
            onDelete={openDelete}
            onEditCollection={handleEditCollection}
            onEditContent={handleEditContentWithUrl}
            onEditCoupon={openCouponEdit}
            uploadedFile={uploadedFile}
            uploadedPreview={uploadedPreview}
            collectionAccessType={collectionAccessType}
            setCollectionAccessType={setCollectionAccessType}
            collectionPasswords={collectionPasswords}
            setCollectionPasswords={setCollectionPasswords}
            collectionDescription={collectionDescription}
            setCollectionDescription={setCollectionDescription}
            collectionRentalAmount={collectionRentalAmount}
            setCollectionRentalAmount={setCollectionRentalAmount}
            collectionPurchaseAmount={collectionPurchaseAmount}
            setCollectionPurchaseAmount={setCollectionPurchaseAmount}
            collectionAccessDuration={collectionAccessDuration}
            setCollectionAccessDuration={setCollectionAccessDuration}
            onPasswordValidationChange={setHasPasswordError}
            onBack={handleBackToCollection}
          />
        </ContentPanel>
      </ContentsScrollArea>

      {createCollectionFlow.showCreateModal && (
        <CreateCollectionModal
          visible={createCollectionFlow.showCreateModal}
          collectionName={createCollectionFlow.collectionName}
          onChangeCollectionName={createCollectionFlow.setCollectionName}
          onClose={createCollectionFlow.closeCreate}
          onConfirm={createCollectionFlow.completeCreate}
        />
      )}

      {contentTypeFlow.showContentTypeModal && (
        <ContentTypeModal
          visible={contentTypeFlow.showContentTypeModal}
          onClose={contentTypeFlow.close}
          onBack={contentTypeFlow.close}
          onContinue={contentTypeFlow.continueWithType}
        />
      )}

      {contentTypeFlow.showContentUploadModal && (
        <ContentUploadModal
          key={
            editingContent?.id ??
            contentTypeFlow.selectedContentType ??
            CONTENT_MODAL_KEY_FALLBACK
          }
          visible={contentTypeFlow.showContentUploadModal}
          mode={
            editingContent
              ? CONTENT_UPLOAD_MODE.EDIT
              : CONTENT_UPLOAD_MODE.CREATE
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
          onUploadSuccess={(tab, file, preview, createdId, details) => {
            clearSelectedCollectionContentsOverride();
            handleUploadSuccess(tab, file, preview, createdId, details);
            if (createdId) {
              syncContentIdToUrl(createdId);
            }
          }}
        />
      )}

      {createCollectionFlow.showSuccessModal && (
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
      )}

      {showDiscardModal && (
        <ConfirmationModal
          isOpen={showDiscardModal}
          onClose={closeDiscardModal}
          title={t("settings.notifications.discardModal.title")}
          body={t("settings.notifications.discardModal.message")}
          cancelLabel={t("settings.notifications.discardModal.goBack")}
          confirmLabel={t("settings.notifications.discardModal.discard")}
          onConfirm={() => {
            if (isCouponDiscardPending) {
              closeCouponFlow();
            }
            if (isUploadMode) {
              handleBack();
            }
            closeDiscardModal();
          }}
          size="sm"
          spacing="md"
          fullWidthButtons
          buttonRow
          showCloseButton={false}
        />
      )}

      {showSaveSuccessModal && (
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
      )}

      <CouponFlowModals
        collections={collections}
        couponFlow={couponFlow}
        couponForm={couponForm}
        setCouponForm={setCouponForm}
        closeCouponFlow={closeCouponFlow}
        requestCloseCouponFlow={requestCloseCouponFlow}
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
        onSuccessClose={handleDeleteSuccessClose}
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
