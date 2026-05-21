"use client";

import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import GenericTabs from "@/components/UI/GenericTabs";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  TabsWrapper,
  TabsWrapperCentered,
} from "@/components/Feature/ProfileLayout/Hero/styles";
import type { useTabbedHeroState } from "@/hooks/useTabbedHeroState";

type HeroTabsProps = Pick<
  ReturnType<typeof useTabbedHeroState>,
  | "profileTabs"
  | "activeTab"
  | "searchOpen"
  | "searchValue"
  | "handleTabChange"
  | "setSearchOpen"
  | "setSearchValue"
> & {
  centered?: boolean;
};

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
  const Wrapper = centered ? TabsWrapperCentered : TabsWrapper;

  return (
    <Wrapper>
      <GenericTabs
        tabs={profileTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={{
          open: searchOpen,
          value: searchValue,
          placeholder: t(CREATE_PROFILE_HOME.searchPlaceholder),
          onToggle: () => setSearchOpen((prev) => !prev),
          onChange: setSearchValue,
          ariaLabel: t(CREATE_PROFILE_HOME.searchAriaLabel),
          icon: <SearchIcon width={18} height={18} />,
        }}
      />
    </Wrapper>
  );
}
