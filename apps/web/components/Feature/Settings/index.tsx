"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { TabButton, Tabs, Wrapper } from "./styles";
import { TabKey, TABS } from "@/utils/settingsTabs";

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("payout");

  return (
    <Wrapper>
      <MonoText $use="H4_SemiBold">Settings</MonoText>

      <Tabs>
        {TABS.map((tab) => {
          const isIconOnly = tab.key === "search";

          return (
            <TabButton
              key={tab.key}
              $active={activeTab === tab.key}
              $isIcon={isIconOnly}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          );
        })}
      </Tabs>
    </Wrapper>
  );
}
