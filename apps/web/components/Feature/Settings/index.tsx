"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { TabButton, Tabs, Wrapper, SearchWrapper, Content } from "./styles";
import { TAB_KEYS, TabKey, TABS } from "@/utils/settingsTabs";
import SearchBar from "@/components/UI/SearchBar";
import { useTranslation } from "react-i18next";
import NotificationContent from "./Notification";
import PayoutContent from "./Payout";
import ExportContent from "./Export";

export default function SettingsContent() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.payout);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const handleTabClick = (tabKey: TabKey, isSearch?: boolean) => {
    if (isSearch) {
      setOpenSearch((prev) => !prev);
    } else {
      setActiveTab(tabKey);
      setOpenSearch(false);
    }
  };

  return (
    <Wrapper>
      <MonoText $use="H4_SemiBold">{t("settings.title")}</MonoText>

      <Tabs>
        {TABS.map((tab) => {
          const isSearch = tab.key === TAB_KEYS.search;
          const isActive = activeTab === tab.key;

          return (
            <TabButton
              key={tab.key}
              $active={isActive}
              $isIcon={isSearch}
              onClick={() => handleTabClick(tab.key, isSearch)}
            >
              {isSearch && openSearch ? (
                <SearchWrapper onClick={(e) => e.stopPropagation()}>
                  <SearchBar
                    placeholder={t("search")}
                    value={searchValue}
                    onChange={setSearchValue}
                  />
                </SearchWrapper>
              ) : tab.icon ? (
                tab.icon
              ) : (
                <MonoText $use="Body_SemiBold">
                  {tab.labelKey ? t(tab.labelKey) : ""}
                </MonoText>
              )}
            </TabButton>
          );
        })}
      </Tabs>

      <Content>
        {activeTab === TAB_KEYS.payout && <PayoutContent />}
        {activeTab === TAB_KEYS.notifications && <NotificationContent />}
        {activeTab === TAB_KEYS.export && <ExportContent />}
      </Content>
    </Wrapper>
  );
}
