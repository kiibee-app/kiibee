"use client";

import React, { useState } from "react";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";

import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import InputField from "@/components/UI/InputFields";
import COLORS from "@repo/ui/colors";
import {
  ContentPanel,
  CreateCollectionModalContent,
  CreateButton,
  PageHeader,
  PageShell,
  PlaceholderLine,
  SearchButton,
  TabButton,
  TabsRow,
  Title,
} from "./styles";
import {
  COLLECTIONS,
  CONTENT_TABS,
  ContentTab,
  SETTINGS,
} from "@/utils/common";
import AdmissionRequirements from "./AdmissionRequirements";
import { SuccessArcIcon } from "@/assets/icons";
import { MODAL_ALIGN } from "@/utils/ui";
import { INPUT_VARIANTS } from "@/utils/Constants";

export default function CreatorsContents() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ContentTab>(COLLECTIONS);
  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState(false);
  const [collectionName, setCollectionName] = useState("");

  const handleSaveCollection = () => {
    setShowCreateCollectionModal(false);
    setShowPasswordSuccessModal(true);
  };

  return (
    <PageShell>
      <PageHeader>
        <Title>{t("contents.title")}</Title>

        <CreateButton
          type="button"
          onClick={() => setShowCreateCollectionModal(true)}
        >
          <PlusIcon width={16} height={16} color="white" />
          <MonoText $use="Body_Medium" color="inherit">
            {t("contents.actions.createCollection")}
          </MonoText>
        </CreateButton>
      </PageHeader>

      <TabsRow>
        {CONTENT_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            type="button"
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {t(tab.labelKey)}
          </TabButton>
        ))}

        <SearchButton type="button" aria-label={t("contents.actions.search")}>
          <SearchIcon width={22} height={22} />
        </SearchButton>
      </TabsRow>

      <ContentPanel>
        {activeTab === SETTINGS ? (
          <AdmissionRequirements />
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
                t("contents.placeholders.collections")
              );
            })()}
          </PlaceholderLine>
        )}
      </ContentPanel>

      <GenericModal
        visible={showCreateCollectionModal}
        title={t("contents.createCollectionModal.title")}
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.save")}
        onCancel={() => setShowCreateCollectionModal(false)}
        onClose={() => setShowCreateCollectionModal(false)}
        onConfirm={handleSaveCollection}
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
        visible={showPasswordSuccessModal}
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
        onClose={() => setShowPasswordSuccessModal(false)}
        onConfirm={() => setShowPasswordSuccessModal(false)}
        width="480px"
        padding="40px 30px"
        showCloseButton={false}
      />
    </PageShell>
  );
}
