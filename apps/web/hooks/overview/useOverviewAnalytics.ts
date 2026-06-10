import { API, useGetAPI } from "@/lib/http/api";
import type {
  OverviewActivityPoint,
  OverviewAnalyticsResponse,
  OverviewRange,
  OverviewStats,
} from "@/types/overview";

const EMPTY_STATS: OverviewStats = {
  total: 0,
  rentals: 0,
  purchases: 0,
  views: 0,
  visits: 0,
  downloads: 0,
};

const EMPTY_CHART: OverviewActivityPoint[] = [];

export const useOverviewAnalytics = (range: OverviewRange) => {
  const query = useGetAPI<OverviewAnalyticsResponse>(
    API.creatorOverview.analytics,
    { range },
  );

  return {
    ...query,
    stats: query.data?.data?.stats ?? EMPTY_STATS,
    chart: query.data?.data?.chart ?? EMPTY_CHART,
  };
};
