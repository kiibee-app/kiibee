import COLORS from "@repo/ui/colors";

export type OverviewPerformanceIcon =
  | "pdf"
  | "audio"
  | "video"
  | "book"
  | "web";

export type OverviewPerformanceItem = {
  id: string;
  name: string;
  icon: OverviewPerformanceIcon;
  pageVisits: number;
  clicks: number;
  views: number;
};

export const OVERVIEW_STATS = [
  { id: "total", label: "Total", value: 66, color: COLORS.primary.BLACK },
  {
    id: "rentals",
    label: "No of rentals",
    value: 10,
    color: COLORS.primary.BLUE,
  },
  {
    id: "purchases",
    label: "No of purchases",
    value: 18,
    color: COLORS.primary.ORANGE,
  },
  {
    id: "views",
    label: "No of views",
    value: 23,
    color: COLORS.secondary.MEDIUM_GREEN,
  },
  {
    id: "visits",
    label: "No of visits",
    value: 23,
    color: COLORS.gredint.PALE_GREEN,
  },
  {
    id: "downloads",
    label: "No of downloads",
    value: 14,
    color: COLORS.primary.GREEN_100,
  },
];

export default OVERVIEW_STATS;

export const OVERVIEW_RANGES = [
  { key: "Day" },
  { key: "Week" },
  { key: "Month" },
  { key: "Year" },
];

export const OVERVIEW_CONTENT_PERFORMANCE: OverviewPerformanceItem[] = [
  {
    id: "health-conscious",
    name: "Health Conscious",
    icon: "pdf",
    pageVisits: 8,
    clicks: 5,
    views: 3,
  },
  {
    id: "instructional-videos",
    name: "Instructional videos",
    icon: "pdf",
    pageVisits: 10,
    clicks: 4,
    views: 7,
  },
  {
    id: "audio-files-podcasts",
    name: "Audio files and Podcasts",
    icon: "audio",
    pageVisits: 16,
    clicks: 12,
    views: 8,
  },
  {
    id: "psychology-contents",
    name: "Psychology contents",
    icon: "video",
    pageVisits: 5,
    clicks: 2,
    views: 4,
  },
  {
    id: "books-of-psychology",
    name: "Books of Psychology",
    icon: "book",
    pageVisits: 8,
    clicks: 8,
    views: 3,
  },
  {
    id: "important-web-pages",
    name: "Important web pages",
    icon: "web",
    pageVisits: 23,
    clicks: 18,
    views: 12,
  },
];
