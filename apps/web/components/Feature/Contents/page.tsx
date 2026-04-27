"use client";

import React, { useState } from "react";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { SuccessCheckIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import COLORS from "@repo/ui/colors";
import {
  ContentPanel,
  CreateButton,
  DummyButton,
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

export default function CreatorsContents() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ContentTab>(COLLECTIONS);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  const handleDeleteContent = () => {
    setShowDeleteModal(false);
    setShowDeleteSuccessModal(true);
  };

  return (
    <PageShell>
      <PageHeader>
        <Title>{t("contents.title")}</Title>

        <CreateButton type="button">
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

      <DummyButton type="button" onClick={() => setShowDeleteModal(true)}>
        Dummy button
      </DummyButton>

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
        visible={showDeleteModal}
        title={t("contents.deleteModal.title")}
        message={t("contents.deleteModal.message")}
        cancelLabel={t("contents.deleteModal.cancel")}
        confirmLabel={t("contents.deleteModal.delete")}
        onCancel={() => setShowDeleteModal(false)}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteContent}
        width="480px"
        padding="40px 30px"
        buttonRow
        showCloseButton={false}
      />

      <GenericModal
        visible={showDeleteSuccessModal}
        icon={<SuccessCheckIcon size={22} color={COLORS.neutral.GRAY_400} />}
        title={t("contents.deleteSuccessModal.title")}
        message={t("contents.deleteSuccessModal.message")}
        confirmLabel={t("contents.deleteSuccessModal.done")}
        onClose={() => setShowDeleteSuccessModal(false)}
        onConfirm={() => setShowDeleteSuccessModal(false)}
        width="480px"
        showCloseButton={false}
      />
    </PageShell>
  );
}
