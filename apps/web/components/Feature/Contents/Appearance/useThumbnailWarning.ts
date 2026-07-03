"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CONTENTS } from "@/utils/translationKeys";
import { ImageType, THUMBNAIL_MIN_DIMENSIONS } from "@/utils/ui";

export function useThumbnailWarning() {
  const { t } = useTranslation();

  const validateImageDataUrl = React.useCallback(
    (type: ImageType, imageDataUrl: string) => {
      if (!(type in THUMBNAIL_MIN_DIMENSIONS)) return;
      const recommendation =
        THUMBNAIL_MIN_DIMENSIONS[type as keyof typeof THUMBNAIL_MIN_DIMENSIONS];

      const img = new Image();
      img.onload = () => {
        const isLowResolution =
          img.naturalWidth < recommendation.width ||
          img.naturalHeight < recommendation.height;
        if (!isLowResolution) return;

        toast.warning(
          t(CONTENTS.appearance.coverImage.resolutionWarning, {
            width: recommendation.width,
            height: recommendation.height,
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
