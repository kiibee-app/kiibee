"use client";

import React, { useState } from "react";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/UI/Modals";
import COLORS from "@repo/ui/colors";
import {
  ContentPanel,
  CreateButton,
  PageHeader,
  PageShell,
  PlaceholderLine,
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
import GenericTabs from "@/components/UI/GenericTabs";

export default function CreatorsContents() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ContentTab>(COLLECTIONS);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
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

      <GenericTabs
        tabs={CONTENT_TABS.map((tab) => ({
          key: tab.key,
          label: t(tab.labelKey),
        }))}
        activeTab={activeTab}
        onTabChange={(tabKey) => {
          setActiveTab(tabKey);
          setOpenSearch(false);
        }}
        search={{
          open: openSearch,
          value: searchValue,
          placeholder: t("contents.actions.search"),
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: setSearchValue,
          ariaLabel: t("contents.actions.search"),
        }}
      />

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
        fullWidthButtons
        buttonRow
        showCloseButton={false}
      />

      <GenericModal
        visible={showDeleteSuccessModal}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        iconMargin="0 auto 8px"
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
