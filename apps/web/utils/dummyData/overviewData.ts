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
  {
    id: "total",
    labelKey: "dashboard.overviewStats.total",
    value: 66,
    color: COLORS.primary.BLACK,
  },
  {
    id: "rentals",
    labelKey: "dashboard.overviewStats.rentals",
    value: 10,
    color: COLORS.primary.BLUE,
  },
  {
    id: "purchases",
    labelKey: "dashboard.overviewStats.purchases",
    value: 18,
    color: COLORS.primary.ORANGE,
  },
  {
    id: "views",
    labelKey: "dashboard.overviewStats.views",
    value: 23,
    color: COLORS.secondary.MEDIUM_GREEN,
  },
  {
    id: "visits",
    labelKey: "dashboard.overviewStats.visits",
    value: 23,
    color: COLORS.gradient.PALE_GREEN,
  },
  {
    id: "downloads",
    labelKey: "dashboard.overviewStats.downloads",
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
] as const;

export type OverviewRange = (typeof OVERVIEW_RANGES)[number]["key"];

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

export type OverviewActivityPoint = {
  label: string;
  rentals: number;
  purchases: number;
  views: number;
  visits: number;
  downloads: number;
};

export const OVERVIEW_ACTIVITY_DATA: Record<
  OverviewRange,
  OverviewActivityPoint[]
> = {
  Day: [
    {
      label: "00:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "01:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "02:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "03:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "04:00",
      rentals: 0,
      purchases: 0,
      views: 3,
      visits: 1,
      downloads: 0,
    },
    {
      label: "05:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "06:00",
      rentals: 0,
      purchases: 0,
      views: 1,
      visits: 1,
      downloads: 0,
    },
    {
      label: "07:00",
      rentals: 0,
      purchases: 0,
      views: 3,
      visits: 2,
      downloads: 0,
    },
    {
      label: "08:00",
      rentals: 0,
      purchases: 1,
      views: 1,
      visits: 1,
      downloads: 0,
    },
    {
      label: "09:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "10:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "11:00",
      rentals: 0,
      purchases: 1,
      views: 2,
      visits: 0,
      downloads: 2,
    },
    {
      label: "12:00",
      rentals: 1,
      purchases: 2,
      views: 1,
      visits: 1,
      downloads: 2,
    },
    {
      label: "13:00",
      rentals: 1,
      purchases: 0,
      views: 1,
      visits: 1,
      downloads: 1,
    },
    {
      label: "14:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "15:00",
      rentals: 1,
      purchases: 2,
      views: 1,
      visits: 0,
      downloads: 2,
    },
    {
      label: "16:00",
      rentals: 1,
      purchases: 0,
      views: 1,
      visits: 2,
      downloads: 1,
    },
    {
      label: "17:00",
      rentals: 1,
      purchases: 2,
      views: 1,
      visits: 0,
      downloads: 2,
    },
    {
      label: "18:00",
      rentals: 2,
      purchases: 3,
      views: 3,
      visits: 0,
      downloads: 2,
    },
    {
      label: "19:00",
      rentals: 0,
      purchases: 2,
      views: 1,
      visits: 2,
      downloads: 2,
    },
    {
      label: "20:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "21:00",
      rentals: 1,
      purchases: 2,
      views: 3,
      visits: 2,
      downloads: 0,
    },
    {
      label: "22:00",
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    },
    {
      label: "23:00",
      rentals: 2,
      purchases: 4,
      views: 1,
      visits: 1,
      downloads: 2,
    },
  ],
  Week: [
    {
      label: "Mon",
      rentals: 1,
      purchases: 1,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Tue",
      rentals: 1,
      purchases: 2,
      views: 1,
      visits: 0,
      downloads: 2,
    },
    {
      label: "Wed",
      rentals: 2,
      purchases: 1,
      views: 2,
      visits: 1,
      downloads: 2,
    },
    {
      label: "Thu",
      rentals: 1,
      purchases: 2,
      views: 3,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Fri",
      rentals: 2,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 2,
    },
    {
      label: "Sat",
      rentals: 1,
      purchases: 1,
      views: 3,
      visits: 2,
      downloads: 1,
    },
    {
      label: "Sun",
      rentals: 2,
      purchases: 3,
      views: 2,
      visits: 1,
      downloads: 2,
    },
  ],
  Month: [
    {
      label: "W1",
      rentals: 1,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "W2",
      rentals: 2,
      purchases: 1,
      views: 3,
      visits: 1,
      downloads: 2,
    },
    {
      label: "W3",
      rentals: 2,
      purchases: 3,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "W4",
      rentals: 3,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 2,
    },
  ],
  Year: [
    {
      label: "Jan",
      rentals: 1,
      purchases: 1,
      views: 1,
      visits: 1,
      downloads: 0,
    },
    {
      label: "Feb",
      rentals: 1,
      purchases: 1,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Mar",
      rentals: 2,
      purchases: 1,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Apr",
      rentals: 1,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "May",
      rentals: 1,
      purchases: 2,
      views: 3,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Jun",
      rentals: 2,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Jul",
      rentals: 2,
      purchases: 1,
      views: 3,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Aug",
      rentals: 2,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 2,
    },
    {
      label: "Sep",
      rentals: 1,
      purchases: 2,
      views: 2,
      visits: 2,
      downloads: 1,
    },
    {
      label: "Oct",
      rentals: 2,
      purchases: 2,
      views: 3,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Nov",
      rentals: 2,
      purchases: 3,
      views: 2,
      visits: 1,
      downloads: 1,
    },
    {
      label: "Dec",
      rentals: 3,
      purchases: 2,
      views: 2,
      visits: 1,
      downloads: 2,
    },
  ],
};
