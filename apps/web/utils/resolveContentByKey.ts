import { tutorialVideos } from "@/utils/data";
import {
  discoverContentData,
  type DiscoverContentItem,
} from "@/utils/discoverContent";
import type { TutorialVideo } from "@/utils/types";

export type ResolvedPublishedContent =
  | { kind: "tutorial"; tutorial: TutorialVideo }
  | { kind: "discover"; item: DiscoverContentItem };

export function resolvePublishedContentByKey(
  contentKey: string | undefined,
): ResolvedPublishedContent | undefined {
  if (contentKey === undefined || contentKey === "") return undefined;
  const decoded = decodeURIComponent(contentKey);
  const discoverItem = discoverContentData.find(
    (i) => i.contentKey === decoded,
  );
  if (discoverItem) return { kind: "discover", item: discoverItem };
  const tutorial = tutorialVideos.find((t) => t.id === decoded);
  if (tutorial) return { kind: "tutorial", tutorial };
  return undefined;
}
