"use client";

import { useTranslation } from "react-i18next";
import type { TutorialVideo } from "@/utils/types";
import logo from "@/assets/images/logo.png";
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
      title={tutorial.title}
      descriptions={[tutorial.focus, t("singleTutorial.descriptionSecondary")]}
      tags={[tutorial.category, t("singleTutorial.tags.tutorials")]}
      creator={{
        name: tutorial.creator,
        avatar: logo,
      }}
      hero={{
        image: tutorial.image,
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
          value: tutorial.creator || "Kiibee",
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
