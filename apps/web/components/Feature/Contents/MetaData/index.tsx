"use client";

import React from "react";
import { PanelStack } from "./styles";
import DescriptionSection from "../Appearance/Description";
import ProductionSection from "./Production";

export default function MetaData() {
  return (
    <PanelStack>
      <DescriptionSection showTitle={true} />
      <ProductionSection />
    </PanelStack>
  );
}
