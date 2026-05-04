"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import InputField from "@/components/UI/InputFields";
import COLORS from "@repo/ui/colors";
import {
  ContentPanel,
  CreateCollectionModalContent,
  HeaderRow,
  PageHeader,
  PageShell,
  PlaceholderLine,
  Title,
} from "./styles";
import {
  COLLECTIONS,
  APPEARANCE,
  CONTENT_TABS,
  ContentTab,
  COUPONS,
  SETTINGS,
} from "@/utils/common";
import AdmissionRequirements from "./AdmissionRequirements";
import AppearanceContent from "./Appearance";
import ContentTypeModal from "./ContentTypeModal";
import { SuccessArcIcon } from "@/assets/icons";
import { MODAL_ALIGN } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";
import ContentsHeaderAction from "./ContentsHeaderAction";
import GenericTabs from "@/components/UI/GenericTabs";
import InfoTextCard from "@/components/UI/InfoTextCard";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";
import CouponDetailsModal from "@/components/Feature/Contents/coupon/coupon-details";
import CouponCodesModal from "@/components/Feature/Contents/coupon/coupon-codes";
import { CollectionRow } from "@/types/collectionsType";
import CollectionTable from "./Collections";
import {
  collectionsData,
  collectionContentsData,
} from "@/utils/dummyData/collectionData";
import AuthBackButton from "../Auth/AuthBackButton";
import { COLLECTION_TABLE_TYPE } from "@/utils/collection";
import CouponApplicableProductsModal from "@/components/Feature/Contents/coupon/coupon-applicable-products";

export default function CreatorsContents() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ContentTab>(COLLECTIONS);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionRow | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);
  const [showContentTypeModal, setShowContentTypeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [showCouponDetails, setShowCouponDetails] = useState(false);
  const [showCouponCodes, setShowCouponCodes] = useState(false);
  const collectionContents = selectedCollection
    ? (collectionContentsData[selectedCollection.id] ?? [])
    : [];
  const [showCouponApplicableProducts, setShowCouponApplicableProducts] =
    useState(false);

  const closeCouponFlow = () => {
    setShowCouponDetails(false);
    setShowCouponCodes(false);
    setShowCouponApplicableProducts(false);
  };

  const handleCreateClick = () => {
    switch (activeTab) {
      case COUPONS:
        setShowCouponDetails(true);
        break;

      case COLLECTIONS:
        setShowCreateCollectionModal(true);
        break;

      default:
        break;
    }
  };

  const handleSaveCollection = () => {
    if (!collectionName.trim()) return;
    setShowCreateCollectionModal(false);
    setCollectionName("");
    setShowSuccessModal(true);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
  };

  return (
    <PageShell>
      <PageHeader>
        <HeaderRow>
          {selectedCollection && (
            <AuthBackButton
              marginBottom="0px"
              onClick={handleBackToCollections}
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
          onCancel={() => setShowDiscardModal(true)}
          onCreateCoupon={() => setShowCouponDetails(true)}
          onSave={() => setShowSuccessModal(true)}
        />
      </PageHeader>

      <GenericTabs
        tabs={CONTENT_TABS.map((tab) => ({
          key: tab.key,
          label: t(tab.labelKey),
        }))}
        activeTab={activeTab}
        onTabChange={(tabKey) => {
          setActiveTab(tabKey);
          setOpenSearch(false);
          setSelectedCollection(null);
        }}
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
        {activeTab === APPEARANCE ? (
          <AppearanceContent />
        ) : activeTab === SETTINGS ? (
          <AdmissionRequirements />
        ) : activeTab === COUPONS ? (
          <InfoTextCard
            title={t(CONTENTS_KEYS.couponsCard.title)}
            description={t(CONTENTS_KEYS.couponsCard.description)}
          />
        ) : activeTab === COLLECTIONS ? (
          selectedCollection ? (
            <>
              <CollectionTable
                type={COLLECTION_TABLE_TYPE.CONTENTS}
                data={collectionContents}
              />
            </>
          ) : (
            <CollectionTable
              type={COLLECTION_TABLE_TYPE.COLLECTIONS}
              data={collectionsData}
              onRowClick={(row) => setSelectedCollection(row)}
            />
          )
        ) : (
          <PlaceholderLine>
            {(() => {
              const activeItem = CONTENT_TABS.find(
                (tab) => tab.key === activeTab,
              );
              if (activeItem?.descriptionKey) {
                return t(activeItem.descriptionKey);
              }
              return (
                activeItem?.description ??
                t(CONTENTS_KEYS.placeholders.collections)
              );
            })()}
          </PlaceholderLine>
        )}
      </ContentPanel>

      <ContentTypeModal
        visible={showContentTypeModal}
        onClose={() => setShowContentTypeModal(false)}
        onContinue={() => setShowContentTypeModal(false)}
      />

      <GenericModal
        visible={showCreateCollectionModal}
        title={t("contents.createCollectionModal.title")}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.save")}
        onCancel={() => {
          setShowCreateCollectionModal(false);
          setCollectionName("");
        }}
        onClose={() => {
          setShowCreateCollectionModal(false);
          setCollectionName("");
        }}
        onConfirm={handleSaveCollection}
        confirmDisabled={!collectionName.trim()}
        width="630px"
        padding="30px"
        buttonRow
        buttonAlign={MODAL_ALIGN.END}
        textAlign={MODAL_ALIGN.START}
      >
        <CreateCollectionModalContent>
          <InputField
            label={t("contents.createCollectionModal.collectionName")}
            value={collectionName}
            onChange={(value) => setCollectionName(value as string)}
            placeholder={t("contents.createCollectionModal.placeholder")}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            height="40px"
          />
        </CreateCollectionModalContent>
      </GenericModal>

      <GenericModal
        visible={showSuccessModal}
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
        onClose={() => {
          setShowSuccessModal(false);
        }}
        onConfirm={() => {
          setShowSuccessModal(false);
        }}
        width="480px"
        padding="40px 30px"
        showCloseButton={false}
      />

      <GenericModal
        visible={showDiscardModal}
        title={t("settings.notifications.discardModal.title")}
        message={t("settings.notifications.discardModal.message")}
        cancelLabel={t("settings.notifications.discardModal.goBack")}
        confirmLabel={t("settings.notifications.discardModal.discard")}
        onCancel={() => setShowDiscardModal(false)}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => setShowDiscardModal(false)}
        width="480px"
        padding="40px 44px"
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />

      <CouponDetailsModal
        visible={showCouponDetails}
        onClose={closeCouponFlow}
        onNext={() => {
          setShowCouponDetails(false);
          setShowCouponCodes(true);
        }}
      />

      <CouponCodesModal
        visible={showCouponCodes}
        onBack={() => {
          setShowCouponCodes(false);
          setShowCouponDetails(true);
        }}
        onClose={closeCouponFlow}
        onNext={() => {
          setShowCouponCodes(false);
          setShowCouponApplicableProducts(true);
        }}
      />

      <CouponApplicableProductsModal
        visible={showCouponApplicableProducts}
        onBack={() => {
          setShowCouponApplicableProducts(false);
          setShowCouponCodes(true);
        }}
        onClose={closeCouponFlow}
        onNext={closeCouponFlow}
      />
    </PageShell>
  );
}
