export const DEFAULT_VISIBLE_CREATORS = 10;

export const CREATOR_OPTIONS = [
  "Kammas kantine",
  "Chief1",
  "Morten Bonde",
  "Simon Talbot",
  "Amin Jensen",
  "ADHDfokus",
  "Jacob Taarnhoj",
  "Tjeles venner",
  "Helt vild, kogebog",
  "Comedy-TV",
  "The Fit Lab",
  "Business Daily",
] as const;

export const CATEGORY_OPTION_KEYS = [
  "all",
  "business",
  "comedyShows",
  "musicAndAudio",
  "educational",
  "fitnessAndHealth",
  "food",
  "podcasts",
  "theater",
  "tutorials",
  "publications",
] as const;

export const FORMAT_OPTION_KEYS = [
  "all",
  "video",
  "ePublication",
  "pdf",
  "audioFile",
  "webContent",
] as const;

export const filterGroupMap = {
  creators: "creators",
  categories: "categories",
  formats: "formats",
} as const;

export const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

export type CreatorOption = (typeof CREATOR_OPTIONS)[number];
export type CategoryOptionKey = (typeof CATEGORY_OPTION_KEYS)[number];
export type FormatOptionKey = (typeof FORMAT_OPTION_KEYS)[number];
export type RatingOption = (typeof RATING_OPTIONS)[number];
export type FilterGroupKey = keyof typeof filterGroupMap;
