"use client";

import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { USER_TABS, UserTabKey } from "@/utils/usersTabs";
import { useTheme } from "styled-components";
import RegistrationsTabContent from "./Registrations";
import SalestTabContent from "./Salest";
import {
  HeaderRow,
  SearchArea,
  SearchIconWrap,
  SearchInput,
  TabButton,
  Tabs,
  Title,
  Wrapper,
} from "./styles";

export default function UsersContent() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<UserTabKey>(USER_TABS[0].key);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openSearch) {
      searchInputRef.current?.focus();
    }
  }, [openSearch]);

  const handleSearchToggle = () => {
    setOpenSearch((prev) => !prev);
  };

  const handleTabClick = (tabKey: UserTabKey) => {
    setActiveTab(tabKey);
    setOpenSearch(false);
  };

  return (
    <Wrapper>
      <Title>Users</Title>

      <HeaderRow>
        <Tabs>
          {USER_TABS.map((tab) => (
            <TabButton
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </Tabs>

        <SearchArea $open={openSearch}>
          <SearchIconWrap
            type="button"
            aria-label="Toggle search"
            onClick={handleSearchToggle}
          >
            <SearchIcon
              width={18}
              height={18}
              color={theme.colors.neutral.GRAY_400}
            />
          </SearchIconWrap>
          <SearchInput
            ref={searchInputRef}
            $open={openSearch}
            placeholder="Search for posts"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </SearchArea>
      </HeaderRow>

      {activeTab === "registrations" && <RegistrationsTabContent />}
      {activeTab === "salest" && <SalestTabContent />}
    </Wrapper>
  );
}
