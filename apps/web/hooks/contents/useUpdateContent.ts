"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { withMutationGuards } from "@/lib/http/api/mutationUtils";
import { API } from "@/lib/http/api/endpoints";
import { ApiError } from "@/lib/http/errors/apiError";

export interface UpdateContentBody {
  title?: string;
  description?: string;
  contentUrl?: string;
  trailerUrl?: string;
  thumbnailUrl?: string;
  thumbnailLandscapeUrl?: string;
  publishedYear?: number;
  duration?: number;
  categoryId?: string;
  productionCompany?: string;
  manufacturerLink?: string;
  visibility?: string;
  accessType?: string;
  buyPrice?: number;
  rentPrice?: number;
  rentDurationHours?: number;
  maximumDownloadCount?: number;
  physicalProductLink?: string;
  isDownloadable?: boolean;
}

export interface UpdateContentParams {
  contentId: string;
  body: UpdateContentBody;
}

export function useUpdateContent(
  options?: Omit<
    UseMutationOptions<unknown, ApiError, UpdateContentParams>,
    "mutationKey" | "mutationFn"
  >,
) {
  return useMutation<unknown, ApiError, UpdateContentParams>({
    mutationKey: ["updateContent"],
    mutationFn: ({ contentId, body }) =>
      withMutationGuards((signal) =>
        axiosClient
          .put<unknown>(API.content.update(contentId), body, { signal })
          .then((response) => response.data),
      ),
    ...options,
  });
}
