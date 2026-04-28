"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { Wrapper, Content, Title } from "./styles";
import { TAB_KEYS, TabKey, TABS } from "@/utils/settingsTabs";
import { useTranslation } from "react-i18next";
import NotificationContent from "./Notification";
import PayoutContent from "./Payout";
import GenericTabs from "@/components/UI/GenericTabs";

export default function SettingsContent() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.payout);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const handleTabClick = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    setOpenSearch(false);
  };

  return (
    <Wrapper>
      <Title>{t("settings.title")}</Title>

      <GenericTabs
        tabs={TABS.filter((tab) => tab.key !== TAB_KEYS.search).map((tab) => ({
          key: tab.key,
          label: tab.labelKey ? t(tab.labelKey) : "",
        }))}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        search={{
          open: openSearch,
          value: searchValue,
          placeholder: t("search"),
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: setSearchValue,
          ariaLabel: t("search"),
        }}
      />

      <Content>
        {activeTab === TAB_KEYS.payout && <PayoutContent />}
        {activeTab === TAB_KEYS.notifications && <NotificationContent />}
      </Content>
    </Wrapper>
  );
}
