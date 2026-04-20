"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { TabButton, Tabs, Wrapper, SearchWrapper } from "./styles";
import { TabKey, TABS } from "@/utils/settingsTabs";
import SearchBar from "@/components/UI/SearchBar";
import { useTranslation } from "react-i18next";

export default function SettingsContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("payout");
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <Wrapper>
      <MonoText $use="H4_SemiBold">Settings</MonoText>

      <Tabs>
        {TABS.map((tab) => {
          const isSearch = tab.key === "search";
          const isActive = activeTab === tab.key;
          return (
            <TabButton
              key={tab.key}
              $active={isActive}
              $isIcon={isSearch}
              onClick={() => {
                if (isSearch) {
                  setOpenSearch((prev) => !prev);
                } else {
                  setActiveTab(tab.key);
                  setOpenSearch(false);
                }
              }}
            >
              {isSearch && openSearch ? (
                <SearchWrapper onClick={(e) => e.stopPropagation()}>
                  <SearchBar
                    placeholder={t("search")}
                    value={searchValue}
                    onChange={setSearchValue}
                  />
                </SearchWrapper>
              ) : (
                <MonoText $use="Body_SemiBold">{tab.label}</MonoText>
              )}
            </TabButton>
          );
        })}
      </Tabs>
    </Wrapper>
  );
}
