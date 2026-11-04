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
import { extractCloudflareStreamVideoId } from "@/utils/media";
import { FORMAT_TYPE } from "@/utils/types";

export function useContentMediaUrl(
  content: ContentDetailItem | undefined,
  warmReader = false,
) {
  const contentType = content && getContentType(content);

  const contentMediaKey = content && getContentMediaKey(content);
  const cloudflareVideoId = extractCloudflareStreamVideoId(contentMediaKey);

  const mediaEndpoint =
    contentType === FORMAT_TYPE.VIDEO && cloudflareVideoId
      ? API.media.videoStream
      : API.media.fileSignedUrl;

  const canFetchMedia =
    Boolean(contentMediaKey) && contentType !== FORMAT_TYPE.WEB;

  const preloadReader =
    warmReader &&
    (contentType === FORMAT_TYPE.PDF || contentType === FORMAT_TYPE.EPUB);
  // File signatures are issued for four hours. Refresh before they expire.
  const reuseWindow = preloadReader ? 3 * 60 * 60_000 : 60_000;

  const {
    data: mediaResponse,
    isLoading,
    dataUpdatedAt,
    refetch,
  } = useGetAPI<ContentMediaUrlResponse>(
    mediaEndpoint,
    { [CONTENT_MEDIA_QUERY_KEYS.KEY]: contentMediaKey },
    {
      enabled: preloadReader && canFetchMedia,
      staleTime: reuseWindow,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const previewMediaUrl = useMemo(() => {
    if (!content) return undefined;
    const signedUrl =
      mediaResponse?.url ||
      mediaResponse?.iframeUrl ||
      mediaResponse?.streamUrl;

    return resolveContentPlaybackUrl(content, signedUrl) || undefined;
  }, [content, mediaResponse]);

  const fetchMediaUrl = useCallback(async () => {
    if (!canFetchMedia) return previewMediaUrl;
    // Reuse a recently issued link when the viewer is reopened.
    if (mediaResponse && Date.now() - dataUpdatedAt < reuseWindow)
      return previewMediaUrl;

    const result = await refetch();
    const signedUrl =
      result.data?.url || result.data?.iframeUrl || result.data?.streamUrl;

    return resolveContentPlaybackUrl(content, signedUrl) || previewMediaUrl;
  }, [
    canFetchMedia,
    content,
    previewMediaUrl,
    mediaResponse,
    dataUpdatedAt,
    refetch,
    reuseWindow,
  ]);

  return {
    contentType,
    previewMediaUrl,
    hasSignedMedia: Boolean(mediaResponse?.url),
    isLoading,
    canFetchMedia,
    fetchMediaUrl,
  } as const;
}
