import {
  discoverContentData,
  type DiscoverContentItem,
} from "@/utils/discoverContent";

export const CONTENT_KIND = {
  DISCOVER: "discover",
} as const;

export type ResolvedPublishedContent = {
  kind: typeof CONTENT_KIND.DISCOVER;
  item: DiscoverContentItem;
};

export function resolvePublishedContentByKey(
  contentKey: string | undefined,
): ResolvedPublishedContent | undefined {
  if (contentKey === undefined || contentKey === "") return undefined;
  const decoded = decodeURIComponent(contentKey);
  const discoverItem = discoverContentData.find(
    (i) => i.contentKey === decoded,
  );
  if (discoverItem) return { kind: CONTENT_KIND.DISCOVER, item: discoverItem };
  return undefined;
}
