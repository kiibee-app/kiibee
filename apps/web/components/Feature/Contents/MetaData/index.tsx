"use client";

import React, { useMemo } from "react";
import { PanelStack } from "./styles";
import DescriptionSection from "../Appearance/Description";
import CoverImageSection from "../Appearance/CoverImage";
import { IMAGE_TYPE } from "@/utils/ui";
import { FORMAT_TYPE } from "@/utils/types";
import { useTranslation } from "react-i18next";
import ProductionSection from "./Production";
import PublishedSection from "./Published";
import { useContentForm } from "../ContentFormContext";

export default function MetaData() {
  const { t } = useTranslation();
  const { formState } = useContentForm();
  const isPortraitPdf =
    formState.contentTypeId === FORMAT_TYPE.PDF ||
    formState.contentTypeId === FORMAT_TYPE.EPUB;

  const uploadConfigs = useMemo(
    () => [
      {
        label: t("contents.metadata.coverImage.mediaCardLabel"),
        sizeText: t("contents.metadata.coverImage.mediaCardSize"),
        cropWidth: 250,
        cropHeight: 190,
        type: IMAGE_TYPE.MEDIA_CARD,
      },
      {
        label: t("contents.metadata.coverImage.portraitLabel"),
        sizeText: isPortraitPdf
          ? t("contents.metadata.coverImage.portraitPdfSize")
          : t("contents.metadata.coverImage.portraitSize"),
        cropWidth: isPortraitPdf ? 376 : 634,
        cropHeight: isPortraitPdf ? 530 : 345,
        type: IMAGE_TYPE.PORTRAIT,
        previewAspectRatio: isPortraitPdf ? "71 / 100" : "634 / 345",
        previewMaxWidth: isPortraitPdf ? "71px" : "184px",
        previewHeight: isPortraitPdf ? "100px" : undefined,
        previewMinHeight: isPortraitPdf ? "100px" : "100px",
      },
    ],
    [isPortraitPdf, t],
  );

  return (
    <PanelStack>
      <DescriptionSection showTitle={true} useFormContext={true} />
      <PublishedSection />
      <ProductionSection />
      <CoverImageSection
        title={t("contents.metadata.coverImage.title")}
        subtitle={true}
        useFormContext={true}
        uploadConfigs={uploadConfigs}
      />
    </PanelStack>
  );
}
