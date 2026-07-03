import {
  discoverContentData,
  type DiscoverContentItem,
} from "@/utils/discoverContent";

export type ResolvedPublishedContent = {
  kind: "discover";
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
  if (discoverItem) return { kind: "discover", item: discoverItem };
  return undefined;
}
