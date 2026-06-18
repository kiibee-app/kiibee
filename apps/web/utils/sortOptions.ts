import { DropdownOption } from "@/components/UI/SortDropdown";
import {
  ImageSource,
  SORT_OPTION_NEW,
  SORT_OPTION_POPULAR,
  ACCESS_TYPE_FREE,
  SORT_OPTION_AZ,
} from "./Constants";
import { CREATORS } from "./translationKeys";

export type CreatorCategory = "Comedy" | "Music" | "Publication" | "Cooking";

export type CreatorProfile = {
  id: string;
  name: string;
  category: CreatorCategory;
  uploads: number;
  image: ImageSource;
  createdAt: number;
};

export const SORT_OPTION_SUBSCRIBERS = "subscribers";
export const SORT_OPTION_NEWEST = "newest";

export const SORT_OPTIONS = [
  { label: "A-Z", value: SORT_OPTION_AZ },
  { label: "Subscribers", value: SORT_OPTION_SUBSCRIBERS },
  { label: "Newest", value: SORT_OPTION_NEWEST },
] as const;

export const DEFAULT_SORT: SortValue = SORT_OPTIONS[0].value;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const SORT_NEW = "new";
export const SORT_POPULAR = "popular";
export const SORT_FEATURED = "featured";
export const SORT_ALL = "all";

export const EXPLORE_CREATOR_FILTERS = [
  SORT_ALL,
  SORT_FEATURED,
  SORT_NEW,
  SORT_POPULAR,
] as const;

export type ExploreCreatorFilter = (typeof EXPLORE_CREATOR_FILTERS)[number];

export const EXPLORE_CREATOR_FILTER_TITLE_KEYS: Record<
  ExploreCreatorFilter,
  string
> = {
  [SORT_ALL]: CREATORS.allCreators,
  [SORT_FEATURED]: CREATORS.featured,
  [SORT_NEW]: CREATORS.newCreators,
  [SORT_POPULAR]: CREATORS.popular,
};

export const EXPLORE_CREATOR_INITIAL_SORT: Partial<
  Record<ExploreCreatorFilter, SortValue>
> = {
  [SORT_NEW]: SORT_OPTION_NEWEST,
  [SORT_POPULAR]: SORT_OPTION_SUBSCRIBERS,
};

export function isExploreCreatorFilter(
  value: unknown,
): value is ExploreCreatorFilter {
  return EXPLORE_CREATOR_FILTERS.includes(value as ExploreCreatorFilter);
}

export function resolveExploreCreatorFilter(
  value: unknown,
): ExploreCreatorFilter {
  return isExploreCreatorFilter(value) ? value : SORT_ALL;
}

export function getExploreCreatorInitialSort(
  filter: ExploreCreatorFilter,
): SortValue {
  return EXPLORE_CREATOR_INITIAL_SORT[filter] ?? DEFAULT_SORT;
}

export function getExploreCreatorTitleKey(
  filter: ExploreCreatorFilter,
): string {
  return EXPLORE_CREATOR_FILTER_TITLE_KEYS[filter];
}

export const ROW_ACTION_LABEL_MOVE_UP = "Move up";
export const ROW_ACTION_LABEL_MOVE_DOWN = "Move down";
export const ROW_ACTION_LABEL_SETTINGS = "Settings";
export const ROW_ACTION_LABEL_MOVE_TO_ANOTHER_COLLECTION =
  "Move to another collection";

export const MOVE_UP = "move-up";
export const MOVE_DOWN = "move-down";
export const MOVE_SETTINGS = "settings";
export const MOVE_TO_ANOTHER_COLLECTION = "move-to-another-collection";

export type RowAction =
  | typeof MOVE_UP
  | typeof MOVE_DOWN
  | typeof MOVE_SETTINGS
  | typeof MOVE_TO_ANOTHER_COLLECTION;

export const MOVE_DIRECTION_UP = "up";
export const MOVE_DIRECTION_DOWN = "down";

export type MoveDirection =
  | typeof MOVE_DIRECTION_UP
  | typeof MOVE_DIRECTION_DOWN;

export const moveItemInArray = <T extends { id: string }>(
  items: readonly T[],
  id: string,
  direction: MoveDirection,
): T[] => {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return [...items];

  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) return [...items];

  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
};

export const actionOptions: DropdownOption<RowAction>[] = [
  { label: ROW_ACTION_LABEL_MOVE_UP, value: MOVE_UP },
  { label: ROW_ACTION_LABEL_MOVE_DOWN, value: MOVE_DOWN },
  { label: ROW_ACTION_LABEL_SETTINGS, value: MOVE_SETTINGS },
];

export const SORT_MAP: Record<
  SortValue,
  typeof SORT_NEW | typeof SORT_POPULAR | typeof SORT_ALL
> = {
  [SORT_OPTION_AZ]: SORT_ALL,
  [SORT_OPTION_SUBSCRIBERS]: SORT_POPULAR,
  [SORT_OPTION_NEWEST]: SORT_NEW,
};

export function mapSortValueToExploreSort(
  sortBy: SortValue,
): typeof SORT_NEW | typeof SORT_POPULAR | typeof SORT_ALL {
  return SORT_MAP[sortBy] ?? SORT_ALL;
}

export function mapCreatorSortToExploreFilter(
  filter: ExploreCreatorFilter,
  sortBy: SortValue,
): ExploreCreatorFilter {
  return filter === SORT_FEATURED && sortBy === DEFAULT_SORT
    ? SORT_FEATURED
    : mapSortValueToExploreSort(sortBy);
}

export const contentActionOptions: DropdownOption<RowAction>[] = [
  { label: ROW_ACTION_LABEL_MOVE_UP, value: MOVE_UP },
  { label: ROW_ACTION_LABEL_MOVE_DOWN, value: MOVE_DOWN },
  {
    label: ROW_ACTION_LABEL_MOVE_TO_ANOTHER_COLLECTION,
    value: MOVE_TO_ANOTHER_COLLECTION,
  },
];

export const getCategorySortOptions = (
  t: (key: string) => string,
): DropdownOption<string>[] => [
  { label: t("creators.newest").toLowerCase(), value: SORT_OPTION_NEW },
  {
    label: t("nav.explore.popular").toLowerCase(),
    value: SORT_OPTION_POPULAR,
  },
  {
    label: t("nav.explore.freeContent").toLowerCase(),
    value: ACCESS_TYPE_FREE,
  },
  { label: t("creators.a-z").toLowerCase(), value: SORT_OPTION_AZ },
];
