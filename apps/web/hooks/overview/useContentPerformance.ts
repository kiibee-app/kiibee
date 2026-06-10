import { API, useGetAPI } from "@/lib/http/api";
import type {
  ContentPerformanceResponse,
  ContentPerformanceRow,
} from "@/types/overview";
import type { OverviewPerformanceItem } from "@/utils/dummyData/overviewData";
import { mapContentTypeToOverviewIcon } from "@/utils/overviewContent";

const mapRowToPerformanceItem = (
  row: ContentPerformanceRow,
): OverviewPerformanceItem => ({
  id: row.id,
  name: row.name,
  icon: mapContentTypeToOverviewIcon(row.contentType),
  pageVisits: row.pageVisits,
  clicks: row.clicks,
  views: row.views,
});

export const useContentPerformance = () => {
  const query = useGetAPI<ContentPerformanceResponse>(
    API.creatorOverview.contentPerformance,
  );

  const rows = (query.data?.data ?? []).map(mapRowToPerformanceItem);

  return {
    ...query,
    rows,
  };
};
