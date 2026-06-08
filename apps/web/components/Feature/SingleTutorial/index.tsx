"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TutorialVideo } from "@/utils/types";
import logo from "@/assets/images/logo.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
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
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const isFreeContent = useMemo(() => {
    if (tutorial.isFree != null) {
      return tutorial.isFree;
    }

    const firstButtonLabel = tutorial.buttons?.[0]?.label?.trim().toLowerCase();
    return (
      !tutorial.buttons?.length ||
      firstButtonLabel === "free" ||
      firstButtonLabel === freeLabel.trim().toLowerCase()
    );
  }, [freeLabel, tutorial.buttons, tutorial.isFree]);
  const primaryActions = useMemo(() => {
    if (isFreeContent) {
      return undefined;
    }

    return (tutorial.buttons ?? []).map((button) => {
      const normalizedLabel = button.label.toLowerCase();
      const isBuy = normalizedLabel.includes("buy");
      const isRent = normalizedLabel.includes("rent");

      return {
        label: button.label,
        subtitle: isBuy
          ? t("singleContent.pricing.downloadFiles")
          : isRent
            ? t("singleContent.pricing.accessDefault")
            : undefined,
        variant: isBuy ? VARIANT.PRIMARY : VARIANT.SOFT_OUTLINE,
        onClick: button.onClick,
        disabled: false,
      };
    });
  }, [isFreeContent, t, tutorial.buttons]);

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
      primaryAction={
        isFreeContent ? { label: t("singleTutorial.seeContent") } : undefined
      }
      primaryActions={primaryActions}
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
      {relatedVideos.length ? (
        <CollectionItems videos={relatedVideos} collectionId={collectionId} />
      ) : null}
    </SingleContentPage>
  );
}
