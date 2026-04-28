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
import InfoTextCard from "@/components/UI/InfoTextCard";
import { CONTENTS as CONTENTS_KEYS } from "@/utils/translationKeys";

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
        <Title>{t(CONTENTS_KEYS.title)}</Title>

        <CreateButton type="button">
          <PlusIcon width={16} height={16} color="white" />
          <MonoText $use="Body_Medium" color="inherit">
            {t(CONTENTS_KEYS.actions.createCollection)}
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
          placeholder: t(CONTENTS_KEYS.actions.search),
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: setSearchValue,
          ariaLabel: t(CONTENTS_KEYS.actions.search),
        }}
      />

      <ContentPanel>
        {activeTab === SETTINGS ? (
          <AdmissionRequirements />
        ) : activeTab === "coupons" ? (
          <InfoTextCard
            title={t(CONTENTS_KEYS.couponsCard.title)}
            description={t(CONTENTS_KEYS.couponsCard.description)}
          />
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

      <GenericModal
        visible={showDeleteModal}
        title={t(CONTENTS_KEYS.deleteModal.title)}
        message={t(CONTENTS_KEYS.deleteModal.message)}
        cancelLabel={t(CONTENTS_KEYS.deleteModal.cancel)}
        confirmLabel={t(CONTENTS_KEYS.deleteModal.delete)}
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
        title={t(CONTENTS_KEYS.deleteSuccessModal.title)}
        message={t(CONTENTS_KEYS.deleteSuccessModal.message)}
        confirmLabel={t(CONTENTS_KEYS.deleteSuccessModal.done)}
        onClose={() => setShowDeleteSuccessModal(false)}
        onConfirm={() => setShowDeleteSuccessModal(false)}
        width="480px"
        showCloseButton={false}
      />
    </PageShell>
  );
}
