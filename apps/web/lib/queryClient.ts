import { QueryClient } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/config/queryCacheConfig";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = "status" in error ? error.status : undefined;

          if (status === 401 || status === 403 || status === 404) {
            return false;
          }

          return failureCount < 2;
        },
        staleTime: CACHE_CONFIG.dynamic.staleTime,
        gcTime: CACHE_CONFIG.dynamic.gcTime,
        structuralSharing: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
