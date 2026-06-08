"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { CACHE_CONFIG } from "@/config/queryCacheConfig";

type ContentSettingResponse = {
  data?: {
    accessType?: string;
    userId?: string;
  };
};

export const CONTENT_SETTING_QUERY_KEY = [API.content.setting];

export function useContentSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<ContentSettingResponse>({
    queryKey: CONTENT_SETTING_QUERY_KEY,
    queryFn: async () => {
      const res = await axiosClient.get(API.content.setting);
      return res.data;
    },
    staleTime: CACHE_CONFIG.dynamic.gcTime,
  });

  const mutation = useMutation({
    mutationFn: async (accessType: string) => {
      const res = await axiosClient.put(API.content.setting, { accessType });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_SETTING_QUERY_KEY });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    updateSetting: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
