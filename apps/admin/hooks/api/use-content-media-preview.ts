"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../../utils/constants";
import { contentPreviewLabels } from "../../utils/contentConfig";
import {
  CONTENT_FORMAT,
  isCloudflareStreamVideoId,
  isEmbedVideoUrl,
  normalizeContentFormat,
  toEmbeddablePreviewUrl,
  type ContentFormat,
} from "../../utils/contentMedia";

type MediaPreviewPayload = {
  url?: string;
  iframeUrl?: string;
  streamUrl?: string;
  token?: string;
};

type MediaPreviewResponse = MediaPreviewPayload & {
  success?: boolean;
  message?: string;
  data?: MediaPreviewPayload;
};

export type ContentMediaPreviewInput = {
  contentType?: string | null;
  contentTypeId?: string | null;
  fileKey?: string | null;
  contentUrl?: string | null;
};

export type ContentMediaPreviewResult = {
  url: string;
  format: ContentFormat;
};

function resolvePreviewUrl(
  response: MediaPreviewResponse,
  fallbackUrl?: string | null,
) {
  const payload = response.data ?? response;
  return (
    payload.iframeUrl || payload.url || payload.streamUrl || fallbackUrl || null
  );
}

export function useContentMediaPreview() {
  return useMutation({
    mutationFn: async (
      input: ContentMediaPreviewInput,
    ): Promise<ContentMediaPreviewResult> => {
      const format = normalizeContentFormat(
        input.contentType,
        input.contentTypeId,
      );
      const fileKey = input.fileKey?.trim() || null;
      const contentUrl = input.contentUrl?.trim() || null;

      if (contentUrl && isEmbedVideoUrl(contentUrl)) {
        return { url: toEmbeddablePreviewUrl(contentUrl), format };
      }

      if (format === CONTENT_FORMAT.WEB) {
        if (!contentUrl) {
          throw new Error(contentPreviewLabels.noWebLink);
        }
        return { url: toEmbeddablePreviewUrl(contentUrl), format };
      }

      if (!fileKey) {
        if (contentUrl) {
          return { url: toEmbeddablePreviewUrl(contentUrl), format };
        }
        throw new Error(contentPreviewLabels.noMediaFile);
      }

      const endpoint =
        format === CONTENT_FORMAT.VIDEO && isCloudflareStreamVideoId(fileKey)
          ? `${API_ENDPOINTS.MEDIA_VIDEO_STREAM}?key=${encodeURIComponent(fileKey)}`
          : `${API_ENDPOINTS.MEDIA_SIGNED_URL}?key=${encodeURIComponent(fileKey)}`;

      const response = await apiClient<MediaPreviewPayload>(endpoint, {
        method: "GET",
      });

      const raw = response as unknown as MediaPreviewResponse;

      if (raw.success === false) {
        throw new Error(
          raw.message || contentPreviewLabels.failedMediaPreviewUrl,
        );
      }

      const url = resolvePreviewUrl(raw, contentUrl);

      if (!url) {
        throw new Error(
          raw.message || contentPreviewLabels.failedMediaPreviewUrl,
        );
      }

      const shouldBlobPreview =
        (format === CONTENT_FORMAT.PDF ||
          format === CONTENT_FORMAT.AUDIO ||
          format === CONTENT_FORMAT.EPUB) &&
        url.includes("/media/legacy-file");

      if (shouldBlobPreview) {
        const fileResponse = await fetch(url);
        if (!fileResponse.ok) {
          throw new Error(contentPreviewLabels.failedMediaPreviewUrl);
        }

        const blob = await fileResponse.blob();
        if (/html|xml/i.test(blob.type)) {
          throw new Error(contentPreviewLabels.failedMediaPreviewUrl);
        }

        return { url: URL.createObjectURL(blob), format };
      }

      return { url, format };
    },
  });
}
