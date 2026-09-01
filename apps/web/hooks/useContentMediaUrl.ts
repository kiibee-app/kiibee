"use client";

import { useCallback, useMemo } from "react";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import {
  CONTENT_MEDIA_QUERY_KEYS,
  type ContentDetailItem,
  type ContentMediaUrlResponse,
  getContentMediaKey,
  getContentType,
  resolveContentPlaybackUrl,
} from "@/utils/contentApi";
import { FORMAT_TYPE } from "@/utils/types";

function pickMediaPlaybackUrl(
  payload: ContentMediaUrlResponse | undefined,
): string | undefined {
  if (!payload) return undefined;

  const nested =
    payload && typeof payload === "object" && "data" in payload
      ? ((payload as { data?: ContentMediaUrlResponse }).data ?? payload)
      : payload;

  const url = nested.iframeUrl || nested.url || nested.streamUrl;
  return typeof url === "string" && url.trim() ? url.trim() : undefined;
}

export function useContentMediaUrl(content: ContentDetailItem | undefined) {
  const contentType = content && getContentType(content);

  const contentMediaKey = content && getContentMediaKey(content);

  const mediaEndpoint =
    contentType === FORMAT_TYPE.VIDEO
      ? API.media.videoStream
      : API.media.fileSignedUrl;

  const canFetchMedia =
    Boolean(contentMediaKey) && contentType !== FORMAT_TYPE.WEB;

  const {
    data: mediaResponse,
    isLoading,
    refetch,
  } = useGetAPI<ContentMediaUrlResponse>(
    mediaEndpoint,
    { [CONTENT_MEDIA_QUERY_KEYS.KEY]: contentMediaKey },
    { enabled: false },
  );

  const previewMediaUrl = useMemo(() => {
    if (!content) return undefined;
    const signedUrl = pickMediaPlaybackUrl(mediaResponse);

    return resolveContentPlaybackUrl(content, signedUrl) || undefined;
  }, [content, mediaResponse]);

  const fetchMediaUrl = useCallback(async () => {
    if (!canFetchMedia) return previewMediaUrl;

    const result = await refetch();
    if (result.error) {
      throw result.error;
    }

    const signedUrl = pickMediaPlaybackUrl(result.data);

    return resolveContentPlaybackUrl(content, signedUrl) || previewMediaUrl;
  }, [canFetchMedia, content, previewMediaUrl, refetch]);

  return {
    contentType,
    previewMediaUrl,
    isLoading,
    canFetchMedia,
    fetchMediaUrl,
  } as const;
}
