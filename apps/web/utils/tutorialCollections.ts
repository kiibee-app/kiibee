import { tutorialVideoSections, tutorialVideos } from "@/utils/data";
import type { TutorialVideo, TutorialVideoSection } from "@/utils/types";

export type TutorialCollection = TutorialVideoSection & {
  tutorials: TutorialVideo[];
};

const videoById = new Map(tutorialVideos.map((video) => [video.id, video]));

export const tutorialCollections: TutorialCollection[] =
  tutorialVideoSections.map((section) => ({
    ...section,
    tutorials: section.videoIds
      .map((videoId) => videoById.get(videoId))
      .filter((video): video is TutorialVideo => Boolean(video)),
  }));

export const getTutorialCollectionById = (
  collectionId: string | null,
): TutorialCollection | undefined =>
  tutorialCollections.find((collection) => collection.id === collectionId);

export const getTutorialCollectionByVideoId = (
  videoId: string | null | undefined,
): TutorialCollection | undefined =>
  tutorialCollections.find((collection) =>
    collection.tutorials.some((tutorial) => tutorial.id === videoId),
  );
