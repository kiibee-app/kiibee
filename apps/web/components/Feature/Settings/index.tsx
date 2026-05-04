"use client";

import React, { useCallback, useMemo, useState } from "react";
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
import { NOTIFICATION_MODAL, NotificationModalType } from "@/utils/ui";
import { useQuerySyncedTab } from "@/hooks/useQuerySyncedTab";
import {
  CONTENT_TAB,
  LEGACY_DASHBOARD_TAB_QUERY_KEYS,
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
          onChange: setSearchValue,
          ariaLabel: t("search"),
        }}
      />

      <Content>
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
