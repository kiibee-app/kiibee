"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import {
  API_ENDPOINTS,
  ERROR_MESSAGES,
  QUERY_KEY,
} from "../../utils/constants";

export type UploadItem = {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  thumbnailLandscapeUrl?: string | null;
  contentUrl?: string | null;
  trailerUrl?: string | null;
  contentType?: string | null;
  accessType?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  rentDurationHours?: number | null;
  fileSize?: number | null;
  duration?: number | null;
  isPublished?: boolean;
  visibility?: string | null;
  createdAt?: string | null;
  publishedAt?: string | null;
};

const UPLOADS_QUERY_KEY = (creatorId: string | null) => [
  QUERY_KEY.CREATOR_UPLOADS,
  creatorId,
];

export function useCreatorUploads(creatorId: string | null) {
  return useQuery({
    queryKey: UPLOADS_QUERY_KEY(creatorId),
    queryFn: async () => {
      if (!creatorId) return [];
      const response = await apiClient<UploadItem[]>(
        API_ENDPOINTS.CREATOR_UPLOADS,
        { method: "POST", body: JSON.stringify({ creatorId }) },
      );
      if (!response.success) {
        throw new Error(
          response.message || ERROR_MESSAGES.FETCH_CREATOR_UPLOADS_FAILED,
        );
      }
      return response.data ?? [];
    },
    enabled: Boolean(creatorId),
  });
}
