import { tutorialVideos } from "@/utils/data";
import {
  discoverContentData,
  type DiscoverContentItem,
} from "@/utils/discoverContent";
import type { TutorialVideo } from "@/utils/types";

export const CONTENT_KIND = {
  TUTORIAL: "tutorial",
  DISCOVER: "discover",
} as const;

export type ResolvedPublishedContent =
  | { kind: typeof CONTENT_KIND.TUTORIAL; tutorial: TutorialVideo }
  | { kind: typeof CONTENT_KIND.DISCOVER; item: DiscoverContentItem };

export function resolvePublishedContentByKey(
  contentKey: string | undefined,
): ResolvedPublishedContent | undefined {
  if (contentKey === undefined || contentKey === "") return undefined;
  const decoded = decodeURIComponent(contentKey);
  const discoverItem = discoverContentData.find(
    (i) => i.contentKey === decoded,
  );
  if (discoverItem) return { kind: CONTENT_KIND.DISCOVER, item: discoverItem };
  const tutorial = tutorialVideos.find((t) => t.id === decoded);
  if (tutorial) return { kind: CONTENT_KIND.TUTORIAL, tutorial };
  return undefined;
}
