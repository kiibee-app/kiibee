"use client";

import React from "react";
import { PanelStack } from "./styles";
import DescriptionSection from "../Appearance/Description";
import CoverImageSection from "../Appearance/CoverImage";
import { IMAGE_TYPE } from "@/utils/ui";
import { useTranslation } from "react-i18next";
import ProductionSection from "./Production";
import PublishedSection from "./Published";

export default function MetaData() {
  const { t } = useTranslation();

  return (
    <PanelStack>
      <DescriptionSection showTitle={true} useFormContext={true} />
      <PublishedSection />
      <ProductionSection />
      <CoverImageSection
        title={t("contents.metadata.coverImage.title")}
        subtitle={true}
        useFormContext={true}
        uploadConfigs={[
          {
            label: t("contents.metadata.coverImage.mediaCardLabel"),
            sizeText: t("contents.metadata.coverImage.mediaCardSize"),
            cropWidth: 250,
            cropHeight: 190,
            type: IMAGE_TYPE.MEDIA_CARD,
          },
          {
            label: t("contents.metadata.coverImage.portraitLabel"),
            sizeText: t("contents.metadata.coverImage.portraitSize"),
            cropWidth: 634,
            cropHeight: 345,
            type: IMAGE_TYPE.PORTRAIT,
          },
        ]}
      />
    </PanelStack>
  );
}
