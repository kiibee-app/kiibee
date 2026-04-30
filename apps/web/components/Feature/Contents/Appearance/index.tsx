"use client";

import React from "react";
import AppearanceSettingsSection from "./AppearanceSettingsSection";
import { PanelStack } from "./styles";
import ReceiptSection from "./ReceiptSection";

export default function AppearanceContent() {
  return (
    <PanelStack>
      <AppearanceSettingsSection />
      <ReceiptSection />
    </PanelStack>
  );
}
