"use client";

import React, { useCallback, useMemo, useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import {
  TabButton,
  Tabs,
  Wrapper,
  SearchWrapper,
  Content,
  Header,
  HeaderActions,
  SecondaryButton,
  Button,
} from "./styles";
import { TAB_KEYS, TabKey, TABS } from "@/utils/settingsTabs";
import SearchBar from "@/components/UI/SearchBar";
import { useTranslation } from "react-i18next";
import NotificationContent from "./Notification";
import PayoutContent from "./Payout";
import NotificationModals from "./Notification/notificationModals";
import { NOTIFICATION_MODAL, NotificationModalType } from "@/utils/ui";

export default function SettingsContent() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.payout);
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

  const handleTabClick = useCallback((tabKey: TabKey, isSearch?: boolean) => {
    if (isSearch) {
      setOpenSearch((prev) => !prev);
      return;
    }
    setActiveTab(tabKey);
    setOpenSearch(false);
  }, []);

  return (
    <Wrapper>
      <Header>
        <MonoText $use="H4_SemiBold">{t("settings.title")}</MonoText>

        {isNotificationTab && (
          <HeaderActions>
            <SecondaryButton onClick={handleCancel}>
              <MonoText $use="Body_Medium">{t("common.cancel")}</MonoText>
            </SecondaryButton>
            <Button onClick={handleSave}>
              <MonoText $use="Body_Medium">{t("common.save")}</MonoText>
            </Button>
          </HeaderActions>
        )}
      </Header>

      <Tabs>
        {TABS.map((tab) => {
          const isSearch = tab.key === TAB_KEYS.search;
          const isActive = activeTab === tab.key;

          return (
            <TabButton
              key={tab.key}
              $active={isActive}
              $isIcon={isSearch}
              onClick={() => handleTabClick(tab.key, isSearch)}
            >
              {isSearch && openSearch ? (
                <SearchWrapper onClick={(e) => e.stopPropagation()}>
                  <SearchBar
                    placeholder={t("search")}
                    value={searchValue}
                    onChange={setSearchValue}
                  />
                </SearchWrapper>
              ) : tab.icon ? (
                tab.icon
              ) : (
                <MonoText $use="Body_SemiBold">
                  {tab.labelKey ? t(tab.labelKey) : ""}
                </MonoText>
              )}
            </TabButton>
          );
        })}
      </Tabs>

      <Content>
        {activeTab === TAB_KEYS.payout && <PayoutContent />}
        {activeTab === TAB_KEYS.notifications && <NotificationContent />}
      </Content>
      <NotificationModals
        modalType={modalType}
        onClose={closeModal}
        onConfirmDiscard={handleConfirmDiscard}
      />
    </Wrapper>
  );
}
