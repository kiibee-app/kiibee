"use client";

import React, { useState } from "react";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import {
  ContentPanel,
  CreateButton,
  PageHeader,
  PageShell,
  PlaceholderLine,
  SearchButton,
  TabButton,
  TabsRow,
  Title,
} from "./styles";
import { COLLECTIONS, CONTENT_TABS, ContentTab } from "@/utils/common";

export default function CreatorsContents() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ContentTab>(COLLECTIONS);

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

      <ContentPanel>
        <PlaceholderLine>
          {(() => {
            const activeItem = CONTENT_TABS.find(
              (tab) => tab.key === activeTab,
            );
            if (activeItem?.descriptionKey) return t(activeItem.descriptionKey);
            return (
              activeItem?.description ?? t("contents.placeholders.collections")
            );
          })()}
        </PlaceholderLine>
      </ContentPanel>
    </PageShell>
  );
}
