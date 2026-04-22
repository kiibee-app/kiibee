"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { TabButton, Tabs, Wrapper, SearchWrapper } from "./styles";
import { TAB_KEYS, TabKey, TABS } from "@/utils/settingsTabs";
import SearchBar from "@/components/UI/SearchBar";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";

export default function SettingsContent() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.payout);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const settlementHeaders = ["Amount", "Status", "Credit No", "Bank", "Date"];

  const settlementData = [
    {
      amount: "32kr.",
      status: "Pending",
      creditNo: "KBF-1645",
      bank: "-",
      date: "17 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "-",
      date: "17 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "-",
      date: "17 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Rejected",
      creditNo: "KBF-1645",
      bank: "-",
      date: "17 Oct 2025",
    },
  ];

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

      {activeTab === TAB_KEYS.payout && (
        <Table
          headers={settlementHeaders}
          data={settlementData}
          headerToKey={(h) => {
            const map: Record<
              string,
              "amount" | "status" | "creditNo" | "bank" | "date"
            > = {
              Amount: "amount",
              Status: "status",
              "Credit No": "creditNo",
              Bank: "bank",
              Date: "date",
            };
            return map[h];
          }}
          getRowKey={(row, index) => `${row.creditNo}-${row.date}-${index}`}
          getMobileTitle={(row) => row.amount}
        />
      )}
    </Wrapper>
  );
}
