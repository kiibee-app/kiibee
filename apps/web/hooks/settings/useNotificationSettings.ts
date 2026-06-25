"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { CACHE_CONFIG } from "@/config/queryCacheConfig";
import type { NotificationValues } from "@/utils/notificationSettings";

export type NotificationSettingsResponse = NotificationValues & {
  id?: string;
  userId?: string;
};

export const NOTIFICATION_SETTINGS_QUERY_KEY = [API.notificationSettings.get];

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationSettingsResponse>({
    queryKey: NOTIFICATION_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await axiosClient.get<NotificationSettingsResponse>(
        API.notificationSettings.get,
      );
      return response.data;
    },
    staleTime: CACHE_CONFIG.dynamic.gcTime,
  });

  const mutation = useMutation({
    mutationFn: async (payload: NotificationValues) => {
      const response = await axiosClient.put<NotificationSettingsResponse>(
        API.notificationSettings.update,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_SETTINGS_QUERY_KEY,
      });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
