import design from "@/assets/images/design.webp";
import { VARIANT } from "@/utils/Constants";
import {
  extractCloudflareStreamVideoId,
  extractYouTubeVideoId,
  isYouTubeUrl,
} from "@/utils/media";
import {
  FORMAT_TYPE,
  type TutorialVideo,
  type TutorialVideoSection,
} from "@/utils/types";

export type TutorialVideoApiItem = {
  type: "video";
  id: string;
  title: string;
  videoUrl: string;
  trailerUrl?: string | null;
  sortOrder: number;
  description?: string | null;
  descriptionSecondary?: string | null;
  publisher?: string | null;
  publishedYear?: string | null;
  duration?: string | null;
  tags?: string[];
};

export type TutorialQuickguideApiItem = {
  type: "quickguide";
  id: string;
  title: string;
  pdfUrl: string;
  thumbnailUrl?: string | null;
  sortOrder: number;
};

export type TutorialItemApiItem =
  | TutorialVideoApiItem
  | TutorialQuickguideApiItem;

export type TutorialVideoSectionApiItem = {
  id: string;
  title: string;
  sortOrder: number;
  gridMaxWidth?: string | null;
  items: TutorialItemApiItem[];
};

type ApiResponse<T> = {
  success?: boolean;
  data?: T | null;
};

export type TutorialVideosApiResponse = ApiResponse<
  TutorialVideoSectionApiItem[]
>;

export const QUICKGUIDES_SECTION_ID = "quickguides";

function isVideoItem(item: TutorialItemApiItem): item is TutorialVideoApiItem {
  return item.type === "video";
}

function isQuickguideItem(
  item: TutorialItemApiItem,
): item is TutorialQuickguideApiItem {
  return item.type === "quickguide";
}

function getVideoItems(section: TutorialVideoSectionApiItem) {
  return section.items.filter(isVideoItem);
}

function getQuickguideItems(section: TutorialVideoSectionApiItem) {
  return section.items.filter(isQuickguideItem);
}

function getYouTubeThumbnailUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

export function resolveTutorialThumbnailCandidates(
  video: Pick<TutorialVideoApiItem, "videoUrl" | "trailerUrl">,
): string[] {
  const candidates: string[] = [];
  const videoId = extractCloudflareStreamVideoId(null, video.videoUrl);

  if (videoId) {
    try {
      const { origin } = new URL(video.videoUrl);
      candidates.push(
        `${origin}/${videoId}/thumbnails/thumbnail.jpg?time=1s&height=600`,
        `${origin}/${videoId}/thumbnails/thumbnail.jpg?time=1s`,
        `${origin}/${videoId}/thumbnails/thumbnail.jpg`,
      );
    } catch {
      // ignore invalid video URL
    }

    candidates.push(
      `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=1s&height=600`,
      `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=1s`,
      `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`,
    );
  }

  if (video.trailerUrl && isYouTubeUrl(video.trailerUrl)) {
    const youtubeThumb = getYouTubeThumbnailUrl(video.trailerUrl);
    if (youtubeThumb) {
      candidates.push(
        youtubeThumb,
        youtubeThumb.replace("/hqdefault.", "/mqdefault."),
      );
    }
  }

  return [...new Set(candidates.filter(Boolean))];
}

export function tutorialVideoApiToCard(
  video: TutorialVideoApiItem,
  sectionTitle: string,
  freeLabel: string,
): TutorialVideo {
  const thumbnails = resolveTutorialThumbnailCandidates(video);

  return {
    id: video.id,
    title: video.title,
    category: sectionTitle,
    creator: video.publisher ?? "Kiibee",
    published: video.publishedYear ?? "",
    focus: video.description ?? "",
    description: video.description ?? undefined,
    descriptionSecondary: video.descriptionSecondary ?? undefined,
    publisher: video.publisher ?? undefined,
    publishedYear: video.publishedYear ?? undefined,
    duration: video.duration ?? undefined,
    tags: video.tags ?? [],
    level: "Free",
    isFree: true,
    formatLabel: "Video",
    formatType: FORMAT_TYPE.VIDEO,
    image: thumbnails[0] ?? design.src,
    imageFallback: thumbnails[1],
    videoUrl: video.videoUrl,
    trailerUrl: video.trailerUrl,
    buttons: [
      {
        label: freeLabel,
        variant: VARIANT.SECONDARY,
      },
    ],
  };
}

export function tutorialSectionsToCollections(
  sections: TutorialVideoSectionApiItem[],
  freeLabel: string,
): Array<TutorialVideoSection & { tutorials: TutorialVideo[] }> {
  return sections
    .filter((section) => section.id !== QUICKGUIDES_SECTION_ID)
    .map((section) => ({
      id: section.id,
      title: section.title,
      videoIds: getVideoItems(section).map((video) => video.id),
      gridMaxWidth: section.gridMaxWidth ?? undefined,
      tutorials: getVideoItems(section).map((video) =>
        tutorialVideoApiToCard(video, section.title, freeLabel),
      ),
    }));
}

export function findTutorialVideoInSections(
  sections: TutorialVideoSectionApiItem[],
  videoId: string | null | undefined,
  freeLabel: string,
): TutorialVideo | undefined {
  if (!videoId) return undefined;

  for (const section of sections) {
    const match = getVideoItems(section).find((video) => video.id === videoId);
    if (match) {
      return tutorialVideoApiToCard(match, section.title, freeLabel);
    }
  }

  return undefined;
}

export function findTutorialCollectionByVideoId(
  sections: TutorialVideoSectionApiItem[],
  videoId: string | null | undefined,
  freeLabel: string,
) {
  if (!videoId) return undefined;

  const collections = tutorialSectionsToCollections(sections, freeLabel);
  return collections.find((collection) =>
    collection.tutorials.some((tutorial) => tutorial.id === videoId),
  );
}

export function findTutorialCollectionById(
  sections: TutorialVideoSectionApiItem[],
  collectionId: string | null,
  freeLabel: string,
) {
  if (!collectionId) return undefined;

  const collections = tutorialSectionsToCollections(sections, freeLabel);
  return collections.find((collection) => collection.id === collectionId);
}

export { getQuickguideItems, getVideoItems };
