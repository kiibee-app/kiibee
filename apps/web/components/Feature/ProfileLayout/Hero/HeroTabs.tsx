"use client";

import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import GenericTabs from "@/components/UI/GenericTabs";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  TabsWrapper,
  TabsWrapperCentered,
} from "@/components/Feature/ProfileLayout/Hero/styles";
import type { HeroTabsProps } from "@/utils/profile";

export default function HeroTabs({
  centered = false,
  profileTabs,
  activeTab,
  searchOpen,
  searchValue,
  handleTabChange,
  setSearchOpen,
  setSearchValue,
}: HeroTabsProps) {
  const { t } = useTranslation();
  const { isCollectionsPage } = useCreatorProfileUi();
  const Wrapper = centered ? TabsWrapperCentered : TabsWrapper;
  const searchPlaceholder = isCollectionsPage
    ? t(CREATE_PROFILE_HOME.searchCollectionsPlaceholder)
    : t(CREATE_PROFILE_HOME.searchPlaceholder);

  return (
    <Wrapper>
      <GenericTabs
        tabs={profileTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={{
          open: searchOpen,
          value: searchValue,
          placeholder: searchPlaceholder,
          onToggle: () => setSearchOpen((prev) => !prev),
          onChange: setSearchValue,
          ariaLabel: t(CREATE_PROFILE_HOME.searchAriaLabel),
          icon: <SearchIcon width={18} height={18} />,
        }}
      />
    </Wrapper>
  );
}
