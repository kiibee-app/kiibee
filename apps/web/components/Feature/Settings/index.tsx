"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { TabButton, Tabs, Wrapper, SearchWrapper, Content } from "./styles";
import { TAB_KEYS, TabKey, TABS } from "@/utils/settingsTabs";
import SearchBar from "@/components/UI/SearchBar";
import { useTranslation } from "react-i18next";
import Table from "@/components/UI/Table";
import NotificationContent from "./Notification";
import PayoutContent from "./Payout";

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
      bank: "Nordea",
      date: "17 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "Nordea",
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
      bank: "SEB",
      date: "17 Oct 2025",
    },
    {
      amount: "128kr.",
      status: "Pending",
      creditNo: "KBF-1890",
      bank: "Handelsbanken",
      date: "18 Oct 2025",
    },
    {
      amount: "64kr.",
      status: "Completed",
      creditNo: "KBF-1723",
      bank: "Swedbank",
      date: "19 Oct 2025",
    },
    {
      amount: "256kr.",
      status: "Processing",
      creditNo: "KBF-2012",
      bank: "Danske Bank",
      date: "20 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "Nordea",
      date: "21 Oct 2025",
    },
    {
      amount: "96kr.",
      status: "Pending",
      creditNo: "KBF-1567",
      bank: "SEB",
      date: "22 Oct 2025",
    },
    {
      amount: "48kr.",
      status: "Rejected",
      creditNo: "KBF-2105",
      bank: "-",
      date: "23 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "Swedbank",
      date: "24 Oct 2025",
    },
    {
      amount: "512kr.",
      status: "Processing",
      creditNo: "KBF-2234",
      bank: "Handelsbanken",
      date: "25 Oct 2025",
    },
    {
      amount: "64kr.",
      status: "Pending",
      creditNo: "KBF-1789",
      bank: "Nordea",
      date: "26 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "SEB",
      date: "27 Oct 2025",
    },
    {
      amount: "160kr.",
      status: "Rejected",
      creditNo: "KBF-1901",
      bank: "Danske Bank",
      date: "28 Oct 2025",
    },
    {
      amount: "80kr.",
      status: "Completed",
      creditNo: "KBF-1678",
      bank: "-",
      date: "29 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Processing",
      creditNo: "KBF-1645",
      bank: "Swedbank",
      date: "30 Oct 2025",
    },
    {
      amount: "224kr.",
      status: "Pending",
      creditNo: "KBF-2156",
      bank: "Nordea",
      date: "31 Oct 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "Handelsbanken",
      date: "01 Nov 2025",
    },
    {
      amount: "72kr.",
      status: "Completed",
      creditNo: "KBF-1823",
      bank: "SEB",
      date: "02 Nov 2025",
    },
    {
      amount: "32kr.",
      status: "Rejected",
      creditNo: "KBF-1645",
      bank: "-",
      date: "03 Nov 2025",
    },
    {
      amount: "144kr.",
      status: "Pending",
      creditNo: "KBF-1976",
      bank: "Danske Bank",
      date: "04 Nov 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "Nordea",
      date: "05 Nov 2025",
    },
    {
      amount: "88kr.",
      status: "Processing",
      creditNo: "KBF-2039",
      bank: "Swedbank",
      date: "06 Nov 2025",
    },
    {
      amount: "32kr.",
      status: "Completed",
      creditNo: "KBF-1645",
      bank: "SEB",
      date: "07 Nov 2025",
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

      <Content>
        {activeTab === TAB_KEYS.payout && <PayoutContent />}
        {activeTab === TAB_KEYS.notifications && <NotificationContent />}
      </Content>

      {activeTab === TAB_KEYS.payout && (
        <Table
          headers={settlementHeaders}
          data={settlementData}
          rowsPerPage={10}
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
