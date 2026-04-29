export const CACHE_CONFIG = {
  static: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  },
  dynamic: {
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  realtime: {
    staleTime: 0,
    gcTime: 60 * 1000,
  },
} as const;
