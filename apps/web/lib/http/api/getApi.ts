"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { REQUEST_TIMEOUT } from "@/lib/http/config";
import { ApiError, normalizeApiError } from "@/lib/http/errors/apiError";
import type { QueryOptionsKey } from "@/types/apiClientTypes";

type GetApiOptions<T> = Omit<
  UseQueryOptions<T, ApiError, T, QueryKey>,
  QueryOptionsKey
>;

export const useGetAPI = <T>(
  route: string,
  params?: Record<string, unknown>,
  options?: GetApiOptions<T>,
) => {
  const hasParams = params && Object.keys(params).length > 0;

  return useQuery<T, ApiError>({
    queryKey: hasParams ? [route, params] : [route],
    queryFn: async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const response = await axiosClient.get<T>(route, {
          params,
          signal: controller.signal,
        });

        return response.data;
      } catch (error) {
        throw normalizeApiError(error);
      } finally {
        clearTimeout(timeout);
      }
    },
    ...options,
  });
};
