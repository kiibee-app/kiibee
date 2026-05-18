"use client";

import { useState } from "react";
import { USER_TABS, UserTabKey } from "@/utils/usersTabs";
import RegistrationsTabContent from "../Registrations";
import { Title, Wrapper } from "./styles";
import GenericTabs from "@/components/UI/GenericTabs";
import { useTranslation } from "react-i18next";
import { useQuerySyncedTab } from "@/hooks/useQuerySyncedTab";
import {
  CONTENT_TAB,
  LEGACY_DASHBOARD_TAB_QUERY_KEYS,
} from "@/utils/Constants";
import SalesTabContent from "../Sales";
import { DASHBOARD_USERS } from "@/utils/translationKeys";

const DEFAULT_USERS_TAB = USER_TABS[0].key;

export default function UsersContent() {
  const { t } = useTranslation();
  const { activeTab, setActiveTabAndQuery } = useQuerySyncedTab<UserTabKey>({
    queryKey: CONTENT_TAB,
    defaultTab: DEFAULT_USERS_TAB,
    validTabs: USER_TABS.map((tab) => tab.key),
    cleanupQueryKeys: LEGACY_DASHBOARD_TAB_QUERY_KEYS,
  });
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const handleTabClick = (tabKey: UserTabKey) => {
    if (!searchValue.trim()) {
      setOpenSearch(false);
    }
    setActiveTabAndQuery(tabKey);
  };

  return (
    <Wrapper>
      <Title>Users</Title>

      <GenericTabs
        tabs={USER_TABS.map((tab) => ({
          key: tab.key,
          label: t(tab.labelKey),
        }))}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        search={{
          open: openSearch,
          value: searchValue,
          placeholder: t(DASHBOARD_USERS.search),
          ariaLabel: t(DASHBOARD_USERS.search),
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: setSearchValue,
        }}
      />
      {activeTab === "registrations" && (
        <RegistrationsTabContent searchValue={searchValue} />
      )}
      {activeTab === "sales" && <SalesTabContent searchValue={searchValue} />}
    </Wrapper>
  );
}
