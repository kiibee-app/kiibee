"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";
import type { ExistingCreator } from "../../types/existing-creator";

export type UpdateCreatorProfilePayload = {
  creatorId: string;
  ownerName?: string;
  companyName?: string;
  channelName?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  cvr?: string;
};

async function ensureSuccess<T>(
  promise: Promise<{
    success: boolean;
    data?: T;
    message?: string;
  }>,
) {
  const response = await promise;

  if (!response.success) {
    throw new Error(response.message || "Request failed");
  }

  return response.data;
}

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ creatorId, ...body }: UpdateCreatorProfilePayload) =>
      ensureSuccess<ExistingCreator>(
        apiClient<ExistingCreator>(
          API_ENDPOINTS.ADMIN_UPDATE_CREATOR_PROFILE(creatorId),
          {
            method: "PATCH",
            body: JSON.stringify(body),
          },
        ),
      ),
    onSuccess: async (_data, { creatorId }) => {
      toast.success("Creator profile updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.EXISTING_CREATORS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CREATOR_DETAIL, creatorId],
        }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update creator profile");
    },
  });
}
