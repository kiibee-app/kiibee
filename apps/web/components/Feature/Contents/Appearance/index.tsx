"use client";

import React from "react";
import AppearanceSettingsSection from "./AppearanceSettingsSection";
import { PanelStack } from "./styles";
import ReceiptSection from "./ReceiptSection";
import CoverImageSection from "./CoverImage";
import DescriptionSection from "./Description";
import LogoSection from "./Logo";

export default function AppearanceContent() {
  return (
    <PanelStack>
      <AppearanceSettingsSection />
      <LogoSection />
      <DescriptionSection />
      <CoverImageSection />
      <ReceiptSection />
    </PanelStack>
  );
}
