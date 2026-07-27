"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../../utils/constants";
import {
  CONTENT_FORMAT,
  normalizeContentFormat,
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

function buildEndpoint(format: ContentFormat, fileKey: string) {
  const query = `?key=${encodeURIComponent(fileKey)}`;
  if (format === CONTENT_FORMAT.VIDEO) {
    return `${API_ENDPOINTS.MEDIA_VIDEO_STREAM}${query}`;
  }
  return `${API_ENDPOINTS.MEDIA_SIGNED_URL}${query}`;
}

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

      if (format === CONTENT_FORMAT.WEB) {
        if (!contentUrl) {
          throw new Error("No web link available for this content.");
        }
        return { url: contentUrl, format };
      }

      if (!fileKey) {
        if (contentUrl) {
          return { url: contentUrl, format };
        }
        throw new Error("No media file available for preview.");
      }

      const response = await apiClient<MediaPreviewPayload>(
        buildEndpoint(format, fileKey),
        { method: "GET" },
      );

      const raw = response as unknown as MediaPreviewResponse;

      if (raw.success === false) {
        throw new Error(raw.message || "Failed to load media preview URL.");
      }

      const url = resolvePreviewUrl(raw, contentUrl);

      if (!url) {
        throw new Error(raw.message || "Failed to load media preview URL.");
      }

      return { url, format };
    },
  });
}
