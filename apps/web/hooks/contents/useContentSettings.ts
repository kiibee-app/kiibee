"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { CACHE_CONFIG } from "@/config/queryCacheConfig";

export type ContentSettingData = {
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  rentDuration?: string | null;
  accessType?: string;
  userId?: string;
  hasPassword?: boolean;
  passwordCount?: number;
};

type ContentSettingResponse = {
  data?: ContentSettingData;
};

export type SaveContentSettingPayload = {
  buyPrice?: number | null;
  rentPrice?: number | null;
  rentDuration?: string | null;
  accessType: string;
  password?: string;
  removePasswordIndexes?: number[];
};

export const CONTENT_SETTING_QUERY_KEY = [API.content.setting];

export function useContentSettings(enabled = true) {
  const queryClient = useQueryClient();

  const query = useQuery<ContentSettingResponse>({
    queryKey: CONTENT_SETTING_QUERY_KEY,
    enabled,
    queryFn: async () => {
      const res = await axiosClient.get(API.content.setting);
      return res.data;
    },
    staleTime: CACHE_CONFIG.dynamic.gcTime,
  });

  const mutation = useMutation({
    mutationFn: async (payload: SaveContentSettingPayload) => {
      const res = await axiosClient.put(API.content.setting, payload);
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
