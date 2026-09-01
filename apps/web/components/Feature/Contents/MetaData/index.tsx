"use client";

import React, { useMemo } from "react";
import { PanelStack } from "./styles";
import DescriptionSection from "../Appearance/Description";
import CoverImageSection from "../Appearance/CoverImage";
import {
  CONTENT_THUMBNAIL_PREVIEW,
  CONTENT_THUMBNAIL_SIZE,
  IMAGE_TYPE,
} from "@/utils/ui";
import { CONTENTS } from "@/utils/translationKeys";
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
    formState.contentTypeId === FORMAT_TYPE.EPUB ||
    formState.contentTypeId === FORMAT_TYPE.WEB;

  const mediaCard = CONTENT_THUMBNAIL_SIZE.MEDIA_CARD;
  const portrait = isPortraitPdf
    ? CONTENT_THUMBNAIL_SIZE.PORTRAIT_PDF
    : CONTENT_THUMBNAIL_SIZE.PORTRAIT;

  const uploadConfigs = useMemo(
    () => [
      {
        label: t(CONTENTS.metadata.coverImage.mediaCardLabel),
        sizeText: t(CONTENTS.metadata.coverImage.mediaCardSize, {
          width: mediaCard.width,
          height: mediaCard.height,
        }),
        cropWidth: mediaCard.width,
        cropHeight: mediaCard.height,
        type: IMAGE_TYPE.MEDIA_CARD,
        previewAspectRatio: `${mediaCard.width} / ${mediaCard.height}`,
        previewMaxWidth: CONTENT_THUMBNAIL_PREVIEW.MEDIA_CARD.maxWidth,
        previewMinHeight: CONTENT_THUMBNAIL_PREVIEW.MEDIA_CARD.minHeight,
      },
      {
        label: t(CONTENTS.metadata.coverImage.portraitLabel),
        sizeText: t(
          isPortraitPdf
            ? CONTENTS.metadata.coverImage.portraitPdfSize
            : CONTENTS.metadata.coverImage.portraitSize,
          {
            width: portrait.width,
            height: portrait.height,
          },
        ),
        cropWidth: portrait.width,
        cropHeight: portrait.height,
        type: IMAGE_TYPE.PORTRAIT,
        previewAspectRatio: `${portrait.width} / ${portrait.height}`,
        previewMaxWidth: isPortraitPdf
          ? CONTENT_THUMBNAIL_PREVIEW.PORTRAIT_PDF.maxWidth
          : CONTENT_THUMBNAIL_PREVIEW.PORTRAIT.maxWidth,
        previewHeight: isPortraitPdf
          ? CONTENT_THUMBNAIL_PREVIEW.PORTRAIT_PDF.height
          : undefined,
        previewMinHeight: isPortraitPdf
          ? CONTENT_THUMBNAIL_PREVIEW.PORTRAIT_PDF.minHeight
          : CONTENT_THUMBNAIL_PREVIEW.PORTRAIT.minHeight,
      },
    ],
    [
      isPortraitPdf,
      mediaCard.height,
      mediaCard.width,
      portrait.height,
      portrait.width,
      t,
    ],
  );

  return (
    <PanelStack>
      <DescriptionSection showTitle={true} useFormContext={true} />
      <PublishedSection />
      <ProductionSection />
      <CoverImageSection
        title={t(CONTENTS.metadata.coverImage.title)}
        subtitle={true}
        useFormContext={true}
        uploadConfigs={uploadConfigs}
      />
    </PanelStack>
  );
}
