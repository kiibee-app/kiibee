"use client";

import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { apiClient } from "./api-client";
import { API_ENDPOINTS, QUERY_KEY } from "../../utils/constants";

export function getCloseCreatorMutationOptions(queryClient: QueryClient) {
  return {
    mutationFn: async (creatorId: string) => {
      const response = await apiClient<{ id: string; isDeleted: boolean }>(
        API_ENDPOINTS.CLOSE_CREATOR(creatorId),
        {
          method: "POST",
        },
      );
      if (!response.success)
        throw new Error(response.message || "Could not close account");
      if (
        response.data?.id !== creatorId ||
        response.data?.isDeleted !== true
      ) {
        throw new Error(
          "The server did not confirm account closure. Refresh and try again.",
        );
      }
      return response;
    },
    onSuccess: async (_: unknown, creatorId: string) => {
      // Discard every cached list/filter/page and any in-flight response containing this account.
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.EXISTING_CREATORS],
      });
      queryClient.removeQueries({ queryKey: [QUERY_KEY.EXISTING_CREATORS] });
      queryClient.removeQueries({
        queryKey: [QUERY_KEY.CREATOR_DETAIL, creatorId],
      });
      await Promise.all(
        [
          QUERY_KEY.EXISTING_CREATORS,
          QUERY_KEY.CREATOR_DELETION_REQUESTS,
          QUERY_KEY.CREATOR_DELETION_HISTORY,
        ].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      );
    },
  };
}

export function useCloseCreator() {
  const queryClient = useQueryClient();
  return useMutation(getCloseCreatorMutationOptions(queryClient));
}
