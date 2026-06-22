"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findElement } from "@/utils/searchHelper";
import { MonoText } from "@/components/UI/Monotext";
import {
  Wrapper,
  Content,
  Header,
  HeaderActions,
  SecondaryButton,
  Button,
} from "./styles";
import { TAB_KEYS, TabKey, TABS } from "@/utils/settingsTabs";
import { useTranslation } from "react-i18next";
import NotificationContent from "./Notification";
import PayoutContent from "./Payout";
import ExportContent from "./Export";
import GenericTabs from "@/components/UI/GenericTabs";
import NotificationModals from "./Notification/notificationModals";
import { settlementData, settlementHeaders } from "@/utils/dummyData/payout";
import {
  notificationSettings,
  NOTIFICATION_OPTIONS,
} from "@/utils/notificationSettings";
import { EXPORT_TYPE_OPTIONS } from "@/utils/exportOptions";
import { SETTINGS as SETTINGS_KEYS_CONST } from "@/utils/translationKeys";
import { NOTIFICATION_MODAL, NotificationModalType } from "@/utils/ui";
import { useQuerySyncedTab } from "@/hooks/useQuerySyncedTab";
import {
  CONTENT_TAB,
  LEGACY_DASHBOARD_TAB_QUERY_KEYS,
  SCROLL_OPTIONS,
} from "@/utils/Constants";

export default function SettingsContent() {
  const { t } = useTranslation();
  const settingsTabs = useMemo(
    () =>
      TABS.filter((tab) => tab.key !== TAB_KEYS.search).map((tab) => tab.key),
    [],
  );
  const { activeTab, setActiveTabAndQuery } = useQuerySyncedTab<TabKey>({
    queryKey: CONTENT_TAB,
    defaultTab: TAB_KEYS.payout,
    validTabs: settingsTabs,
    cleanupQueryKeys: LEGACY_DASHBOARD_TAB_QUERY_KEYS,
  });

  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [modalType, setModalType] = useState<NotificationModalType>(null);

  const SETTINGS_TABS_INDEX = useMemo(() => {
    const payoutKeywords = [
      t("settings.tabs.payout"),
      t("settings.payout.title"),
      t("settings.payout.description"),
      t("settings.payout.balance"),
      t("settings.payout.purchase"),
      t("settings.payout.rent"),
      t("settings.payout.settlementHistory"),
      ...settlementHeaders,
      ...settlementData.flatMap((row) => [
        row.amount,
        row.status,
        row.creditNo,
        row.bank,
        row.date,
      ]),
    ].map((k) => k.toLowerCase());

    const notificationKeywords = [
      t("settings.tabs.notifications"),
      t("settings.notifications.title"),
      t("settings.notifications.subtitle"),
      ...notificationSettings.flatMap((item) => [
        t(item.title),
        t(item.description),
      ]),
      ...NOTIFICATION_OPTIONS.type(t).map((o) => o.label),
      ...NOTIFICATION_OPTIONS.frequency(t).map((o) => o.label),
      ...NOTIFICATION_OPTIONS.recipient(t).map((o) => o.label),
    ].map((k) => k.toLowerCase());

    const exportKeywords = [
      t("settings.tabs.export"),
      t(SETTINGS_KEYS_CONST.export.title),
      t(SETTINGS_KEYS_CONST.export.description),
      t(SETTINGS_KEYS_CONST.export.buildCsv),
      t(SETTINGS_KEYS_CONST.export.typeLabel),
      t(SETTINGS_KEYS_CONST.export.typeDescription),
      t(SETTINGS_KEYS_CONST.export.dateLabel),
      t(SETTINGS_KEYS_CONST.export.dateDescription),
      ...EXPORT_TYPE_OPTIONS(t).map((o) => o.label),
    ].map((k) => k.toLowerCase());

    return [
      {
        tab: TAB_KEYS.payout,
        keywords: payoutKeywords,
      },
      {
        tab: TAB_KEYS.notifications,
        keywords: notificationKeywords,
      },
      {
        tab: TAB_KEYS.export,
        keywords: exportKeywords,
      },
    ];
  }, [t]);
  const lastAutoMatchedQueryRef = useRef("");

  const handleSearchChange = useCallback((value: string) => {
    if (!value.trim()) {
      lastAutoMatchedQueryRef.current = "";
    }

    setSearchValue(value);
  }, []);

  useEffect(() => {
    if (!searchValue || searchValue.trim().length < 2) return;

    const query = searchValue.trim().toLowerCase();
    const searchChanged = lastAutoMatchedQueryRef.current !== query;

    if (searchChanged) {
      lastAutoMatchedQueryRef.current = query;

      const activeTabKeywords = SETTINGS_TABS_INDEX.find(
        (item) => item.tab === activeTab,
      );
      const activeContainsQuery = activeTabKeywords?.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query),
      );

      if (!activeContainsQuery) {
        const matchedTabItem = SETTINGS_TABS_INDEX.find((item) =>
          item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query),
          ),
        );
        if (!matchedTabItem) return;
        setActiveTabAndQuery(matchedTabItem.tab);
      }
    }

    let attempts = 0;
    const interval = setInterval(() => {
      const container = document.getElementById("settings-content-area");
      const element = container ? findElement(container, query) : null;
      if (element) {
        element.scrollIntoView(SCROLL_OPTIONS);
        return clearInterval(interval);
      }
      if (++attempts > 10) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [searchValue, activeTab, setActiveTabAndQuery, SETTINGS_TABS_INDEX]);

  const isNotificationTab = useMemo(
    () => activeTab === TAB_KEYS.notifications,
    [activeTab],
  );

  const closeModal = useCallback(() => {
    setModalType(null);
  }, []);

  const handleCancel = useCallback(() => {
    setModalType(NOTIFICATION_MODAL.DISCARD);
  }, []);

  const handleConfirmDiscard = useCallback(() => {
    setSearchValue("");
    setOpenSearch(false);
    setModalType(null);
  }, []);

  const handleSave = useCallback(() => {
    setModalType(NOTIFICATION_MODAL.SUCCESS);
  }, []);

  const handleTabClick = useCallback(
    (tabKey: TabKey) => {
      setOpenSearch(false);
      setActiveTabAndQuery(tabKey);
    },
    [setActiveTabAndQuery],
  );

  return (
    <Wrapper>
      <Header>
        <MonoText $use="H4_SemiBold">{t("settings.title")}</MonoText>

        {isNotificationTab && (
          <HeaderActions>
            <SecondaryButton type="button" onClick={handleCancel}>
              <MonoText $use="Body_Medium">{t("common.cancel")}</MonoText>
            </SecondaryButton>
            <Button type="button" onClick={handleSave}>
              <MonoText $use="Body_Medium">{t("common.save")}</MonoText>
            </Button>
          </HeaderActions>
        )}
      </Header>

      <GenericTabs
        tabs={TABS.filter((tab) => tab.key !== TAB_KEYS.search).map((tab) => ({
          key: tab.key,
          label: tab.labelKey ? t(tab.labelKey) : "",
        }))}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        search={{
          open: openSearch,
          value: searchValue,
          placeholder: t("search"),
          onToggle: () => setOpenSearch((prev) => !prev),
          onChange: handleSearchChange,
          ariaLabel: t("search"),
        }}
      />

      <Content id="settings-content-area">
        {activeTab === TAB_KEYS.payout && <PayoutContent />}
        {activeTab === TAB_KEYS.notifications && <NotificationContent />}
        {activeTab === TAB_KEYS.export && <ExportContent />}
      </Content>

      <NotificationModals
        modalType={modalType}
        onClose={closeModal}
        onConfirmDiscard={handleConfirmDiscard}
      />
    </Wrapper>
  );
}
