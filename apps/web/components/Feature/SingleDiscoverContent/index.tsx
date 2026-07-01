"use client";

import { useTranslation } from "react-i18next";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import type { DiscoverContentItem } from "@/utils/discoverContent";
import { MEDIA_TYPE } from "@/utils/Constants";

type Props = {
  item: DiscoverContentItem;
};

export default function SingleDiscoverContent({ item }: Props) {
  const { t } = useTranslation();
  const isVideo = item.mediaType === MEDIA_TYPE.VIDEO;
  const actionLabels = item.actions.map((a) => t(a.labelKey));

  return (
    <SingleContentPage
      contentId={String(item.id)}
      title={t(item.titleKey)}
      tags={[t(item.categoryKey)]}
      creator={{
        name: t(item.authorKey),
      }}
      hero={{
        image: item.image,
        imageAlt: t(item.titleKey),
        contentType: item.mediaType,
        categoryLabel: t(item.categoryKey),
        mediaLabel: t(item.mediaTypeKey),
        ...(isVideo
          ? {
              mediaIcon: playCircleIcon,
              mediaIconAlt: "Play circle",
            }
          : {}),
      }}
      primaryAction={
        actionLabels.length ? { label: actionLabels.join(" · ") } : undefined
      }
      metaItems={[
        {
          label: t("singleTutorial.meta.publishedLabel"),
          value: t(item.dateKey),
        },
        {
          label: t("discoverContent.detail.formatLabel"),
          value: t(item.mediaTypeKey),
        },
      ]}
      shareLabel={t("common.share")}
    />
  );
}
