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
