"use client";

import React from "react";
import AppearanceSettingsSection from "./AppearanceSettingsSection";
import { PanelStack } from "./styles";
import ReceiptSection from "./ReceiptSection";
import CoverImageSection from "./CoverImage";

export default function AppearanceContent() {
  return (
    <PanelStack>
      <AppearanceSettingsSection />
      <CoverImageSection />
      <ReceiptSection />
    </PanelStack>
  );
}
