"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ABOUT, HOME, ProfileTabKey } from "@/utils/common";
import {
  useCreatorProfileTabs,
  useCreatorProfileUi,
} from "@/hooks/useCreatorChannelLayout";
import { findActiveNavItemKey } from "@/utils/creatorChannel";

export function useTabbedHeroState() {
  const router = useRouter();
  const pathname = usePathname();
  const profileTabs = useCreatorProfileTabs();
  const { isAboutOpen, openAbout, closeAbout } = useCreatorProfileUi();
  const activeTab =
    (findActiveNavItemKey(
      pathname,
      profileTabs.map((tab) => ({ key: tab.key, href: tab.href })),
    ) as ProfileTabKey | null) ?? (isAboutOpen ? ABOUT : HOME);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleTabChange = (tab: ProfileTabKey) => {
    if (tab === ABOUT) {
      openAbout();
      return;
    }
    const target = profileTabs.find((item) => item.key === tab)?.href;
    if (!target) return;
    router.push(target, { scroll: false });
  };

  return {
    profileTabs,
    activeTab,
    searchOpen,
    searchValue,
    isAboutOpen,
    openAbout,
    closeAbout,
    handleTabChange,
    setSearchOpen,
    setSearchValue,
  };
}

export type TabbedHeroState = ReturnType<typeof useTabbedHeroState>;
