import { useState } from "react";
import { useQuerySyncedTab } from "@/hooks/useQuerySyncedTab";
import {
  CONTENT_TAB,
  LEGACY_DASHBOARD_TAB_QUERY_KEYS,
} from "@/utils/Constants";
import {
  ADD_CONTENT_TABS,
  AddContentTab,
  COLLECTIONS,
  CONTENT_TABS,
  ContentTab,
  SETTINGS,
} from "@/utils/common";
import { CollectionRow } from "@/types/collectionsType";

type TabItem = {
  key: ContentTab;
  labelKey: string;
};

export const useContentsViewState = () => {
  const { activeTab, setActiveTabAndQuery } = useQuerySyncedTab<ContentTab>({
    queryKey: CONTENT_TAB,
    defaultTab: COLLECTIONS,
    validTabs: [
      ...CONTENT_TABS.map((t) => t.key),
      ...Object.values(ADD_CONTENT_TABS),
    ],
    cleanupQueryKeys: LEGACY_DASHBOARD_TAB_QUERY_KEYS,
  });

  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionRow | null>(null);

  const isCollectionContentMode = !!selectedCollection;
  const isUploadMode = Object.values(ADD_CONTENT_TABS).includes(
    activeTab as AddContentTab,
  );
  const visibleTabs = isUploadMode
    ? [
        {
          key: ADD_CONTENT_TABS.GENERAL,
          labelKey: "contents.tabs.general",
        },
        {
          key: ADD_CONTENT_TABS.METADATA,
          labelKey: "contents.tabs.metadata",
        },
        {
          key: ADD_CONTENT_TABS.PAYMENT,
          labelKey: "contents.tabs.payment",
        },
      ]
    : CONTENT_TABS.filter((tab) =>
        isCollectionContentMode
          ? tab.key === COLLECTIONS || tab.key === SETTINGS
          : true,
      );

  const getTabLabelKey = (tab: TabItem) => {
    if (isCollectionContentMode && tab.key === COLLECTIONS) {
      return "contents.tabs.contents";
    }
    return tab.labelKey;
  };

  const handleTabChange = (tabKey: ContentTab) => {
    setOpenSearch(false);
    setActiveTabAndQuery(tabKey);
  };

  return {
    activeTab,
    visibleTabs,
    getTabLabelKey,
    selectedCollection,
    setSelectedCollection,
    isCollectionContentMode,
    searchValue,
    setSearchValue,
    openSearch,
    setOpenSearch,
    handleTabChange,
    setActiveTabAndQuery,
    isUploadMode,
  };
};
