"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { TIME_MS } from "@/utils/Constants";
import { isSafeDownloadUrl } from "@/utils/path";
import { logger } from "@/lib/logger";

export type ContentDownloadInfo = {
  maxDownloadLimit: number;
  downloadCount: number;
  remainingDownloads: number;
};

export type ContentDownloadInfoResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: ContentDownloadInfo;
};

export type ContentDownloadUrlResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    downloadUrl: string;
    fileName?: string;
  };
};

export function useContentDownload(
  contentId?: string,
  enabled: boolean = true,
) {
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  const route = contentId ? API.download.contentInfo(contentId) : "";

  const { data, isLoading, refetch } = useGetAPI<ContentDownloadInfoResponse>(
    route,
    undefined,
    {
      enabled: Boolean(contentId && enabled),
      staleTime: TIME_MS.ONE_MINUTE,
    },
  );

  const downloadInfo = data?.data;

  const triggerDownload = useCallback(
    async (customTitle?: string) => {
      if (!contentId || isDownloading) return;

      try {
        setIsDownloading(true);
        const response = await axiosClient.get<ContentDownloadUrlResponse>(
          API.download.url(contentId),
        );

        const downloadUrl = response.data?.data?.downloadUrl;
        const fileName = response.data?.data?.fileName;

        if (!downloadUrl) {
          throw new Error(
            response.data?.message || "Failed to get download URL",
          );
        }

        if (!isSafeDownloadUrl(downloadUrl)) {
          logger.error("Blocked unsafe download URL protocol:", downloadUrl);
          throw new Error("Invalid download URL protocol");
        }

        const targetFileName = fileName || customTitle;

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (targetFileName) {
          link.setAttribute("download", targetFileName);
        } else {
          link.setAttribute("download", "");
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await queryClient.invalidateQueries({ queryKey: [route] });
        await refetch();
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          (error as Error)?.message ||
          "Failed to download content";
        toast.error(errorMessage);
      } finally {
        setIsDownloading(false);
      }
    },
    [contentId, isDownloading, queryClient, refetch, route],
  );

  return {
    downloadInfo,
    isLoading,
    isDownloading,
    triggerDownload,
  };
}
