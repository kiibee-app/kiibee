import { QueryClient } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/config/queryCacheConfig";

const HTTP_STATUS = {
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
} as const;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = "status" in error ? error.status : undefined;

          if (
            status === HTTP_STATUS.unauthorized ||
            status === HTTP_STATUS.forbidden ||
            status === HTTP_STATUS.notFound
          ) {
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
