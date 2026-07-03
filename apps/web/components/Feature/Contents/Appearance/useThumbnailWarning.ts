"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CONTENTS } from "@/utils/translationKeys";
import { ImageType, THUMBNAIL_MIN_DIMENSIONS } from "@/utils/ui";

export function useThumbnailWarning() {
  const { t } = useTranslation();

  const validateImageDataUrl = React.useCallback(
    (
      type: ImageType,
      imageDataUrl: string,
      customWidth?: number,
      customHeight?: number,
    ) => {
      if (!(type in THUMBNAIL_MIN_DIMENSIONS)) return;
      const recommendation =
        THUMBNAIL_MIN_DIMENSIONS[type as keyof typeof THUMBNAIL_MIN_DIMENSIONS];

      const minWidth = customWidth ?? recommendation.width;
      const minHeight = customHeight ?? recommendation.height;

      const img = new Image();
      img.onload = () => {
        const isLowResolution =
          img.naturalWidth < minWidth || img.naturalHeight < minHeight;
        if (!isLowResolution) return;

        toast.warning(
          t(CONTENTS.appearance.coverImage.resolutionWarning, {
            width: minWidth,
            height: minHeight,
          }),
          {
            toastId: `thumbnail-resolution-${type}`,
          },
        );
      };
      img.src = imageDataUrl;
    },
    [t],
  );

  return {
    validateImageDataUrl,
  };
}
