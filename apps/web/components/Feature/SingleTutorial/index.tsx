"use client";

import { useTranslation } from "react-i18next";
import type { TutorialVideo } from "@/utils/types";
import logo from "@/assets/images/logo.png";
import contentImage from "@/assets/images/single-tutorial/Content image.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import SingleContentPage from "@/components/Feature/SingleContentPage";
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

  return (
    <SingleContentPage
      title={t("singleTutorial.title")}
      descriptions={[
        t("singleTutorial.descriptionPrimary"),
        t("singleTutorial.descriptionSecondary"),
      ]}
      tags={[
        t("singleTutorial.tags.guide"),
        t("singleTutorial.tags.tutorials"),
      ]}
      creator={{
        name: "Kiibee",
        avatar: logo,
      }}
      hero={{
        image: contentImage,
        imageAlt: tutorial.title,
        categoryLabel: tutorial.category,
        mediaLabel: tutorial.formatLabel,
        mediaIcon: playCircleIcon,
        mediaIconAlt: "Play circle",
        trailerLabel: t("singleTutorial.playTrailer"),
        trailerIcon: playIcon,
        trailerIconAlt: "Play",
      }}
      primaryAction={{
        label: t("singleTutorial.seeContent"),
      }}
      metaItems={[
        {
          label: t("singleTutorial.meta.publishedLabel"),
          value: tutorial.published,
        },
        {
          label: t("singleTutorial.meta.publishedByLabel"),
          value: <strong>{tutorial.creator}</strong>,
        },
        {
          label: t("singleTutorial.meta.durationLabel"),
          value: t("singleTutorial.meta.durationValue"),
        },
      ]}
      shareLabel={t("common.share")}
    >
      <CollectionItems videos={relatedVideos} collectionId={collectionId} />
    </SingleContentPage>
  );
}
