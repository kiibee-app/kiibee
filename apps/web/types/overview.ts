export type ContentPerformanceRow = {
  id: string;
  name: string;
  contentType: string;
  pageVisits: number;
  clicks: number;
  views: number;
};

export type ContentPerformanceResponse = {
  success?: boolean;
  data?: ContentPerformanceRow[];
};

export type OverviewRange = "Day" | "Week" | "Month" | "Year";

export type OverviewStatKey =
  | "total"
  | "rentals"
  | "purchases"
  | "views"
  | "visits"
  | "downloads";

export type OverviewStats = Record<OverviewStatKey, number>;

export type OverviewActivityPoint = {
  label: string;
  rentals: number;
  purchases: number;
  views: number;
  visits: number;
  downloads: number;
};

export type OverviewAnalyticsData = {
  range: OverviewRange;
  stats: OverviewStats;
  chart: OverviewActivityPoint[];
};

export type OverviewAnalyticsResponse = {
  success?: boolean;
  data?: OverviewAnalyticsData;
};
