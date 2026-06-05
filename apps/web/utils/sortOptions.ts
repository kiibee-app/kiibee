import { DropdownOption } from "@/components/UI/SortDropdown";
import {
  ImageSource,
  SORT_OPTION_NEW,
  SORT_OPTION_POPULAR,
  SORT_OPTION_FREE,
  SORT_OPTION_AZ,
} from "./Constants";

export type CreatorCategory = "Comedy" | "Music" | "Publication" | "Cooking";

export type CreatorProfile = {
  id: string;
  name: string;
  category: CreatorCategory;
  uploads: number;
  image: ImageSource;
  createdAt: number;
};

export const SORT_OPTIONS = [
  { label: "A-Z", value: "a-z" },
  { label: "Subscribers", value: "subscribers" },
  { label: "Newest", value: "newest" },
] as const;

export const DEFAULT_SORT: SortValue = SORT_OPTIONS[0].value;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

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
    value: SORT_OPTION_FREE,
  },
  { label: t("creators.a-z").toLowerCase(), value: SORT_OPTION_AZ },
];
