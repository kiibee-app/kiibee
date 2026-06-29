"use client";

import React from "react";
import { toast } from "react-toastify";
import { IMAGE_TYPE, ImageType } from "@/utils/ui";

const LOW_RES_RECOMMENDATIONS: Partial<
  Record<ImageType, { width: number; height: number; warning: string }>
> = {
  [IMAGE_TYPE.MEDIA_CARD]: {
    width: 250,
    height: 190,
    warning:
      "This image is smaller than the recommended size (250 × 190 px). It may appear blurry.",
  },
  [IMAGE_TYPE.PORTRAIT]: {
    width: 376,
    height: 530,
    warning:
      "This image is smaller than the recommended size (376 × 530 px). It may appear blurry.",
  },
};

export function useThumbnailResolutionWarning() {
  const validateImageDataUrl = React.useCallback(
    (type: ImageType, imageDataUrl: string) => {
      const recommendation = LOW_RES_RECOMMENDATIONS[type];
      if (!recommendation) return;

      const img = new Image();
      img.onload = () => {
        const isLowResolution =
          img.naturalWidth < recommendation.width ||
          img.naturalHeight < recommendation.height;
        if (!isLowResolution) return;

        toast.warning(recommendation.warning, {
          toastId: `thumbnail-resolution-${type}`,
        });
      };
      img.src = imageDataUrl;
    },
    [],
  );

  return {
    validateImageDataUrl,
  };
}
