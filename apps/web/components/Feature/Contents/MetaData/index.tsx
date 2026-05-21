"use client";

import React from "react";
import { PanelStack } from "./styles";
import DescriptionSection from "../Appearance/Description";
import ProductionSection from "./Production";
import PublishedSection from "./Published";

export default function MetaData() {
  return (
    <PanelStack>
      <DescriptionSection showTitle={true} />
      <PublishedSection />
      <ProductionSection />
    </PanelStack>
  );
}
