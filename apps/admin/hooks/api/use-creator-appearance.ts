"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type {
  ContentAppearance,
  ContentAppearancePayload,
} from "../../types/content-appearance";
import { API_BASE_URL } from "../../utils/api";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";
import { getAccessToken } from "../../utils/token";

export function useCreatorAppearance(creatorId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.CREATOR_APPEARANCE, creatorId],
    enabled: Boolean(creatorId),
    queryFn: async () => {
      const response = await apiClient<ContentAppearance | null>(
        API_ENDPOINTS.CREATOR_APPEARANCE(creatorId as string),
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to load appearance");
      }

      return response.data ?? null;
    },
  });
}

export function useUpdateCreatorAppearance(creatorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ContentAppearancePayload) => {
      const response = await apiClient<ContentAppearance>(
        API_ENDPOINTS.CREATOR_APPEARANCE(creatorId),
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to update appearance");
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CREATOR_APPEARANCE, creatorId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CREATOR_DETAIL, creatorId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.EXISTING_CREATORS],
        }),
      ]);
    },
  });
}

export async function uploadAppearanceImage(
  image: string | null,
): Promise<string | null> {
  if (!image) return null;
  if (!image.startsWith("data:image/")) return image;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.MEDIA_IMAGES_UPLOAD}`,
    {
      method: "POST",
      body: JSON.stringify({ image }),
      headers,
    },
  );

  const data = (await response.json().catch(() => null)) as {
    url?: string;
    message?: string;
  } | null;

  if (!response.ok || !data?.url) {
    throw new Error(data?.message ?? "Failed to upload image");
  }

  return data.url;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Failed to read file"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
