"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { NavBarItem } from "@/utils/profile";
import {
  CREATOR_LAYOUT_UPDATED,
  type CreatorLayoutKey,
  type CreatorLayoutParam,
  DEFAULT_CREATOR_LAYOUT,
  getCreatorChannelPath,
  getCreatorNavItemDefs,
  getCreatorProfileTabDefs,
  isCreatorLayoutParam,
  layoutParamFromKey,
  readSavedCreatorLayout,
  withCreatorIdQuery,
  writeSavedCreatorLayout,
} from "@/utils/creatorChannel";

type CreatorChannelLayoutContextValue = {
  selectedLayout: CreatorLayoutKey;
  savedLayout: CreatorLayoutKey;
  channelHref: string;
  hasUnsavedChanges: boolean;
  setSelectedLayout: (layout: CreatorLayoutKey) => void;
  saveLayout: () => void;
  cancelLayout: () => void;
};

const CreatorChannelLayoutContext =
  createContext<CreatorChannelLayoutContextValue | null>(null);

function subscribeToCreatorLayout(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(CREATOR_LAYOUT_UPDATED, handler);
  return () => window.removeEventListener(CREATOR_LAYOUT_UPDATED, handler);
}

function getCreatorLayoutServerSnapshot(): CreatorLayoutKey {
  return DEFAULT_CREATOR_LAYOUT;
}

function useCreatorChannelLayoutState(): CreatorChannelLayoutContextValue {
  const savedLayout = useSyncExternalStore(
    subscribeToCreatorLayout,
    readSavedCreatorLayout,
    getCreatorLayoutServerSnapshot,
  );
  const [draftLayout, setDraftLayout] = useState<CreatorLayoutKey | null>(null);
  const selectedLayout = draftLayout ?? savedLayout;

  const setSelectedLayout = useCallback((layout: CreatorLayoutKey) => {
    setDraftLayout(layout);
  }, []);

  const saveLayout = useCallback(() => {
    writeSavedCreatorLayout(selectedLayout);
    setDraftLayout(null);
  }, [selectedLayout]);

  const cancelLayout = useCallback(() => {
    setDraftLayout(null);
  }, []);

  const channelHref = useMemo(
    () => getCreatorChannelPath(savedLayout),
    [savedLayout],
  );

  return {
    selectedLayout,
    savedLayout,
    channelHref,
    hasUnsavedChanges: draftLayout !== null && draftLayout !== savedLayout,
    setSelectedLayout,
    saveLayout,
    cancelLayout,
  };
}

export function CreatorChannelLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useCreatorChannelLayoutState();

  return (
    <CreatorChannelLayoutContext.Provider value={value}>
      {children}
    </CreatorChannelLayoutContext.Provider>
  );
}

export function useCreatorChannelLayout() {
  const context = useContext(CreatorChannelLayoutContext);

  if (!context) {
    throw new Error(
      "useCreatorChannelLayout must be used within CreatorChannelLayoutProvider",
    );
  }

  return context;
}

export function useCreatorLayoutParam(): CreatorLayoutParam {
  const params = useParams();
  const layout = params?.layout;

  if (typeof layout === "string" && isCreatorLayoutParam(layout)) {
    return layout;
  }

  return layoutParamFromKey(DEFAULT_CREATOR_LAYOUT);
}

export function useCreatorProfileTabs() {
  const { t } = useTranslation();
  const layoutParam = useCreatorLayoutParam();
  const publicCreatorId = useSearchParams().get("creatorId");

  return useMemo(
    () =>
      getCreatorProfileTabDefs(layoutParam).map((tab) => ({
        key: tab.key,
        label: t(tab.labelKey),
        href: tab.href
          ? withCreatorIdQuery(tab.href, publicCreatorId)
          : undefined,
      })),
    [layoutParam, publicCreatorId, t],
  );
}

type CreatorProfileUiContextValue = {
  isAboutOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSearch: () => void;
  isCollectionsPage: boolean;
};

const CreatorProfileUiContext =
  createContext<CreatorProfileUiContextValue | null>(null);

function useCreatorProfileUiState(): CreatorProfileUiContextValue {
  const pathname = usePathname();
  const isCollectionsPage = pathname.includes("/collections");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const openAbout = useCallback(() => setIsAboutOpen(true), []);
  const closeAbout = useCallback(() => setIsAboutOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen((open) => !open), []);

  return {
    isAboutOpen,
    openAbout,
    closeAbout,
    searchQuery,
    setSearchQuery,
    searchOpen,
    setSearchOpen,
    toggleSearch,
    isCollectionsPage,
  };
}

function CreatorProfileUiProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const value = useCreatorProfileUiState();
  const { closeAbout, setSearchQuery, setSearchOpen } = value;

  useEffect(() => {
    closeAbout();
    setSearchQuery("");
    setSearchOpen(false);
  }, [pathname, closeAbout, setSearchQuery, setSearchOpen]);

  return (
    <CreatorProfileUiContext.Provider value={value}>
      {children}
    </CreatorProfileUiContext.Provider>
  );
}

export function CreatorProfileUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreatorProfileUiProviderInner>{children}</CreatorProfileUiProviderInner>
  );
}

export function useCreatorProfileUi() {
  const context = useContext(CreatorProfileUiContext);

  if (!context) {
    throw new Error(
      "useCreatorProfileUi must be used within CreatorProfileUiProvider",
    );
  }

  return context;
}

export function useCreatorNavItems() {
  const layoutParam = useCreatorLayoutParam();
  const publicCreatorId = useSearchParams().get("creatorId");
  const { isAboutOpen, openAbout } = useCreatorProfileUi();

  const navItems = useMemo((): NavBarItem[] => {
    const defs = getCreatorNavItemDefs(layoutParam);
    return defs.map((item) =>
      item.key === "nav.profile.about"
        ? {
            key: item.key,
            onClick: openAbout,
            isActive: isAboutOpen,
          }
        : {
            key: item.key,
            href: item.href
              ? withCreatorIdQuery(item.href, publicCreatorId)
              : undefined,
          },
    );
  }, [isAboutOpen, layoutParam, openAbout, publicCreatorId]);

  return { navItems };
}
