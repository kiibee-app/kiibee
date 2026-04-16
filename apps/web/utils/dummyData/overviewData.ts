import COLORS from "@kiibee/ui/colors";

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
