import type { ProfileTabKey } from "@/utils/common";
import { PATHS } from "@/utils/path";
export const CREATOR_LAYOUT_STORAGE_KEY = "kiibee.creatorChannelLayout";
export const CREATOR_LAYOUT_UPDATED = "kiibee:creator-channel-layout-updated";
export const CREATOR_ID_PARAM = "creatorId";

export const CREATOR_LAYOUTS = [
  { key: "layout1", param: "1" },
  { key: "layout2", param: "2" },
  { key: "layout3", param: "3" },
] as const;

export type CreatorLayoutKey = (typeof CREATOR_LAYOUTS)[number]["key"];
export type CreatorLayoutParam = (typeof CREATOR_LAYOUTS)[number]["param"];

export const CREATOR_LAYOUT_KEYS = CREATOR_LAYOUTS.map((l) => l.key);
export const CREATOR_LAYOUT_PARAMS = CREATOR_LAYOUTS.map((l) => l.param);

export const DEFAULT_CREATOR_LAYOUT: CreatorLayoutKey = CREATOR_LAYOUTS[0].key;

const keyByParam = Object.fromEntries(
  CREATOR_LAYOUTS.map((l) => [l.param, l.key]),
) as Record<CreatorLayoutParam, CreatorLayoutKey>;

const paramByKey = Object.fromEntries(
  CREATOR_LAYOUTS.map((l) => [l.key, l.param]),
) as Record<CreatorLayoutKey, CreatorLayoutParam>;

export function isCreatorLayoutKey(value: string): value is CreatorLayoutKey {
  return CREATOR_LAYOUT_KEYS.includes(value as CreatorLayoutKey);
}

export function isCreatorLayoutParam(
  value: string,
): value is CreatorLayoutParam {
  return CREATOR_LAYOUT_PARAMS.includes(value as CreatorLayoutParam);
}

export function layoutParamFromKey(
  layout: CreatorLayoutKey,
): CreatorLayoutParam {
  return paramByKey[layout];
}

export function layoutKeyFromParam(
  param: CreatorLayoutParam,
): CreatorLayoutKey {
  return keyByParam[param];
}

export function getCreatorHomePath(layout: CreatorLayoutParam): string {
  return `${PATHS.CREATOR_PROFILE}/${layout}`;
}

export function getPublicCreatorProfilePath(
  creatorId: string,
  layout: CreatorLayoutParam = layoutParamFromKey(DEFAULT_CREATOR_LAYOUT),
): string {
  const params = new URLSearchParams({ [CREATOR_ID_PARAM]: creatorId });
  return `${getCreatorHomePath(layout)}?${params.toString()}`;
}

export function withCreatorIdQuery(
  href: string,
  creatorId: string | null | undefined,
): string {
  if (!creatorId) return href;

  const [pathname, search = ""] = href.split("?");
  const params = new URLSearchParams(search);
  params.set(CREATOR_ID_PARAM, creatorId);

  return `${pathname}?${params.toString()}`;
}

export function getCreatorCollectionsPath(layout: CreatorLayoutParam): string {
  return `${getCreatorHomePath(layout)}/collections`;
}

export function getCreatorChannelPath(
  layout: CreatorLayoutKey = DEFAULT_CREATOR_LAYOUT,
): string {
  return getCreatorHomePath(layoutParamFromKey(layout));
}

export function readSavedCreatorLayout(): CreatorLayoutKey {
  if (typeof window === "undefined") return DEFAULT_CREATOR_LAYOUT;

  const stored = window.localStorage.getItem(CREATOR_LAYOUT_STORAGE_KEY);
  if (stored && isCreatorLayoutKey(stored)) return stored;

  return DEFAULT_CREATOR_LAYOUT;
}

export function writeSavedCreatorLayout(layout: CreatorLayoutKey) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(CREATOR_LAYOUT_STORAGE_KEY, layout);
  window.dispatchEvent(new Event(CREATOR_LAYOUT_UPDATED));
}

export type CreatorProfileTabDef = {
  key: ProfileTabKey;
  labelKey: string;
  href?: string;
};

export function getCreatorProfileTabDefs(
  layout: CreatorLayoutParam,
): CreatorProfileTabDef[] {
  return [
    {
      key: "home",
      labelKey: "nav.profile.home",
      href: getCreatorHomePath(layout),
    },
    {
      key: "collections",
      labelKey: "nav.profile.collections",
      href: getCreatorCollectionsPath(layout),
    },
    { key: "about", labelKey: "nav.profile.about" },
  ];
}

export function getCreatorNavItemDefs(layout: CreatorLayoutParam) {
  return [
    { key: "nav.profile.home", href: getCreatorHomePath(layout) },
    {
      key: "nav.profile.collections",
      href: getCreatorCollectionsPath(layout),
    },
    { key: "nav.profile.about" as const },
  ];
}
