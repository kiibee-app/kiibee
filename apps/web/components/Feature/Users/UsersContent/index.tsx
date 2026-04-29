"use client";

import { useState } from "react";
import { USER_TABS, UserTabKey } from "@/utils/usersTabs";
import RegistrationsTabContent from "./Registrations";
import SalestTabContent from "./Salest";
import { Title, Wrapper } from "./styles";
import GenericTabs from "@/components/UI/GenericTabs";

export default function UsersContent() {
  const [activeTab, setActiveTab] = useState<UserTabKey>(USER_TABS[0].key);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const handleTabClick = (tabKey: UserTabKey) => {
    setActiveTab(tabKey);
    setOpenSearch(false);
  };

  return (
    <Wrapper>
      <Title>Users</Title>

      <GenericTabs
        tabs={USER_TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
        }))}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        search={{
          open: openSearch,
          value: searchValue,
          placeholder: "Search for posts",
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: setSearchValue,
        }}
      />

      {activeTab === "registrations" && <RegistrationsTabContent />}
      {activeTab === "salest" && <SalestTabContent />}
    </Wrapper>
  );
}
