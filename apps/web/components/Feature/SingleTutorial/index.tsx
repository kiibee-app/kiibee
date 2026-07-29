"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TutorialVideo } from "@/utils/types";
import logo from "@/assets/images/logo.webp";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import { VARIANT } from "@/utils/Constants";
import {
  getDownloadAction,
  hasDownloadLimit,
} from "@/utils/contentPricingActions";
import { FORMAT_TYPE } from "@/utils/types";
import { resolveCloudflareStreamPlaybackUrl } from "@/utils/media";
import { resolveTutorialThumbnailCandidates } from "@/utils/tutorialVideoMapper";
import CollectionItems from "./CollectionItems";

type Props = {
  tutorial: TutorialVideo;
  relatedVideos?: TutorialVideo[];
  collectionId?: string;
};

export default function SingleTutorial({
  tutorial,
  relatedVideos = [],
  collectionId,
}: Props) {
  const { t } = useTranslation();

  const playbackUrl = useMemo(
    () => resolveCloudflareStreamPlaybackUrl(null, tutorial.videoUrl),
    [tutorial.videoUrl],
  );
  const hasTrailer = Boolean(tutorial.trailerUrl?.trim());
  const heroThumbnails = useMemo(
    () =>
      tutorial.videoUrl
        ? resolveTutorialThumbnailCandidates({
            videoUrl: tutorial.videoUrl,
            trailerUrl: tutorial.trailerUrl,
          })
        : [],
    [tutorial.trailerUrl, tutorial.videoUrl],
  );

  const descriptions = useMemo(() => {
    const items = [
      tutorial.description ?? tutorial.focus,
      tutorial.descriptionSecondary,
    ].filter((value): value is string => Boolean(value?.trim()));

    if (items.length > 0) {
      return items;
    }

    return [t("singleTutorial.descriptionSecondary")];
  }, [t, tutorial.description, tutorial.descriptionSecondary, tutorial.focus]);

  const displayTags = useMemo(() => {
    if (tutorial.tags?.length) {
      return tutorial.tags;
    }

    return [tutorial.category, t("singleTutorial.tags.tutorials")].filter(
      Boolean,
    );
  }, [t, tutorial.category, tutorial.tags]);

  const publisherName = tutorial.publisher ?? tutorial.creator;
  const publishedValue = tutorial.publishedYear ?? tutorial.published;
  const durationValue =
    tutorial.duration ?? t("singleTutorial.meta.durationValue");

  const rawDownloadLimit =
    tutorial.maxDownloadLimit ?? tutorial.maxDownloadCount;

  const hasDownloadLimitAction = hasDownloadLimit(rawDownloadLimit);

  return (
    <SingleContentPage
      contentId={tutorial.id}
      publicPlayback
      title={tutorial.title}
      descriptions={descriptions}
      tags={displayTags}
      creator={{
        id: tutorial.creatorId,
        name: publisherName,
        avatar: logo,
      }}
      hero={{
        image: heroThumbnails[0] ?? tutorial.image,
        imageFallback: heroThumbnails[1] ?? tutorial.imageFallback,
        imageAlt: tutorial.title,
        contentType: FORMAT_TYPE.VIDEO,
        contentUrl: playbackUrl || undefined,
        ...(hasTrailer && tutorial.trailerUrl
          ? {
              media: {
                type: FORMAT_TYPE.VIDEO,
                src: tutorial.trailerUrl,
                title: tutorial.title,
              },
              trailerLabel: t("singleTutorial.playTrailer"),
              trailerIcon: playIcon,
              trailerIconAlt: t("singleTutorial.playTrailer"),
            }
          : {}),
        categoryLabel: tutorial.category,
        mediaLabel: tutorial.formatLabel,
        mediaIcon: playCircleIcon,
        mediaIconAlt: t("singleTutorial.seeContent"),
      }}
      primaryAction={
        hasDownloadLimitAction
          ? undefined
          : {
              label: t("singleTutorial.seeContent"),
            }
      }
      primaryActions={
        hasDownloadLimitAction
          ? [
              {
                label: t("singleTutorial.seeContent"),
                variant: VARIANT.PRIMARY,
              },
              getDownloadAction(rawDownloadLimit),
            ]
          : undefined
      }
      metaItems={[
        {
          label: t("singleTutorial.meta.publishedLabel"),
          value: publishedValue,
        },
        {
          label: t("singleTutorial.meta.publishedByLabel"),
          value: <strong>{publisherName}</strong>,
        },
        {
          label: t("singleTutorial.meta.durationLabel"),
          value: durationValue,
        },
      ]}
      shareLabel={t("common.share")}
    >
      {relatedVideos.length ? (
        <CollectionItems videos={relatedVideos} collectionId={collectionId} />
      ) : null}
    </SingleContentPage>
  );
}
