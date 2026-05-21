"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ABOUT, HOME, ProfileTabKey } from "@/utils/common";
import {
  useCreatorAboutModal,
  useCreatorProfileTabs,
} from "@/hooks/useCreatorChannelLayout";

export function useTabbedHeroState() {
  const router = useRouter();
  const pathname = usePathname();
  const profileTabs = useCreatorProfileTabs();
  const { isAboutOpen, openAbout, closeAbout } = useCreatorAboutModal();
  const activeTab =
    profileTabs.find((tab) => tab.href === pathname)?.key ?? HOME;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleTabChange = (tab: ProfileTabKey) => {
    if (tab === ABOUT) {
      openAbout();
      return;
    }
    const target = profileTabs.find((item) => item.key === tab)?.href;
    if (!target) return;
    router.push(target);
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
